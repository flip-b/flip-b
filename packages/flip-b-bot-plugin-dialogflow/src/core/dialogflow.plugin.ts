import { Plugin, Message, Request, Response } from '@flip-b/bot';
import * as dialogflow from '@google-cloud/dialogflow';

/**
 * Dialogflow plugin
 */
export class DialogFlowPlugin extends Plugin {
  override status: any = ['agent side', 'outgoing', 'transfer'];

  /**
   * Register
   */
  override async register(): Promise<any> {
    this.bot.server.router.get(`/${this.plugin}/status`, (req: Request, res: Response) => {
      res.send({ plugin: this.plugin, status: this.status, method: req.method });
    });
  }

  /**
   * Dispatch incoming message
   */
  override async dispatchIncomingMessage(message: Message): Promise<any> {
    const client = new dialogflow.SessionsClient({
      credentials: this.config.credentials
    });
    const input: any = {
      session: client.projectAgentSessionPath(this.config.projectId, message.ticketId),
      queryInput: {},
      queryParams: {
        payload: {
          fields: {
            source: {
              stringValue: `${message.source}`,
              kind: 'stringValue'
            }
          }
        }
      }
    };
    if (message.text) {
      input.queryInput.text = {
        text: `${message.text}`,
        languageCode: this.config.options.languageCode
      };
    }
    if (message.file) {
      input.queryInput.event = {
        name: 'file',
        parameters: jsonToStructProto({ file: `${message.file}` }),
        languageCode: this.config.options.languageCode
      };
    }
    const result = await client.detectIntent(input);
    const intent = `${(result[0]?.queryResult?.intent?.displayName || '').toLowerCase().trim()}`;
    message.intent = intent;

    // Define outgoing messages on array of messages
    const outgoingMessages: any[] = [];

    if (result[0]?.queryResult?.fulfillmentMessages) {
      for (const m in result[0].queryResult.fulfillmentMessages) {
        const textItems = result[0].queryResult.fulfillmentMessages[m].text?.text || [];
        if (textItems.length > 0) {
          for (const t in textItems) {
            const text = textItems[t];
            if (text) {
              const outgoingMessage: any = {};
              outgoingMessage.ticketId = message.ticketId;
              //outgoingMessage.intent(intent);
              outgoingMessage.text = `${text}`;
              outgoingMessages.push(outgoingMessage);
            }
          }
        }
        const listItems = result[0].queryResult.fulfillmentMessages[m].payload?.fields?.richContent?.listValue?.values || [];
        if (listItems.length > 0) {
          for (const m in listItems) {
            const _text = [];
            const _file = [];
            const _menu = [];
            const _form = [];
            const _event = [];
            const _other = [];

            for (const item of listItems[m].listValue?.values || []) {
              const r = structProtoToJson(item.structValue);
              if (r.type == 'text') {
                _text.push(`${r.text || r.title || r.subtitle || ''}`);
              } else if (r.type == 'file' || r.type == 'image' || r.type == 'audio' || r.type == 'document') {
                _file.push(`${r.rawUrl}`);
              } else if (r.type == 'list') {
                _menu.push({ text: r.title, help: r.subtitle });
              } else if (r.type == 'form') {
                _form.push({ text: r.title, help: r.subtitle });
              } else if (r.type == 'event') {
                _event.push({ name: r.event.name, parameters: r.event.parameters, subscriber: r.event.subscribeTo });
              } else {
                _other.push(r);
              }
            }
            if (_text.length > 0 || _file.length > 0 || _menu.length > 0 || _form.length > 0 || _event.length > 0) {
              const outgoingMessage: any = {};
              outgoingMessage.ticketId = message.ticketId;
              //outgoingMessage.setIntent(intent);
              if (_text.length > 0) {
                outgoingMessage.text = _text[0];
              }
              if (_file.length > 0) {
                outgoingMessage.file = _file[0];
              }
              //if (_menu.length > 0) {
              //  outgoingMessage.setMenu(_menu);
              //}
              //if (_form.length > 0) {
              //  outgoingMessage.setForm(_form);
              //}
              //if (_event.length > 0) {
              //  outgoingMessage.setEvent(_event[0]);
              //}
              outgoingMessages.push(outgoingMessage);
            }
          }
        }
      }
    }
    if (outgoingMessages.length > 0) {
      this.bot.addOutgoingMessages(outgoingMessages);
    }
  }
}

const JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP: any = {
  [typeof 0]: 'numberValue',
  [typeof '']: 'stringValue',
  [typeof false]: 'boolValue'
};

const JSON_SIMPLE_VALUE_KINDS: any = new Set(['numberValue', 'stringValue', 'boolValue']);

function jsonToStructProto(json: any) {
  const fields: any = {};
  for (const k in json) {
    fields[k] = jsonValueToProto(json[k]);
  }
  return { fields };
}

function jsonValueToProto(value: any) {
  const valueProto: any = {};
  if (value === null) {
    valueProto.kind = 'nullValue';
    valueProto.nullValue = 'NULL_VALUE';
  } else if (value instanceof Array) {
    valueProto.kind = 'listValue';
    valueProto.listValue = { values: value.map(jsonValueToProto) };
  } else if (typeof value === 'object') {
    valueProto.kind = 'structValue';
    valueProto.structValue = jsonToStructProto(value);
  } else if (typeof value in JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP) {
    const kind = JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP[typeof value];
    valueProto.kind = kind;
    valueProto[kind] = value;
  } else {
    console.warn('Unsupported value type ', typeof value);
  }
  return valueProto;
}

function structProtoToJson(proto: any) {
  if (!proto || !proto.fields) {
    return {};
  }
  const json: any = {};
  for (const k in proto.fields) {
    json[k] = valueProtoToJson(proto.fields[k]);
  }
  return json;
}

function valueProtoToJson(proto: any) {
  if (!proto || !proto.kind) {
    return null;
  }
  if (JSON_SIMPLE_VALUE_KINDS.has(proto.kind)) {
    return proto[proto.kind];
  } else if (proto.kind === 'nullValue') {
    return null;
  } else if (proto.kind === 'listValue') {
    if (!proto.listValue || !proto.listValue.values) {
      console.warn('Invalid JSON list value proto: ', JSON.stringify(proto));
    }
    return proto.listValue.values.map(valueProtoToJson);
  } else if (proto.kind === 'structValue') {
    return structProtoToJson(proto.structValue);
  } else {
    console.warn('Unsupported JSON value proto kind: ', proto.kind);
    return null;
  }
}
