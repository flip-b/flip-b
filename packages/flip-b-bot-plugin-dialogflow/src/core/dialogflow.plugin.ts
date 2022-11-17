import {Plugin, Message} from '@flip-b/bot';
import * as dialogflow from '@google-cloud/dialogflow';

/**
 * Dialogflow plugin
 */
export class DialogflowPlugin extends Plugin {
  // Plugin definitions

  /**
   * Dispatch incoming message
   */
  override async dispatchIncomingMessage(message: Message): Promise<any> {
    const origin: any = this.bot.config.origins[`${message.origin || ''}`] || {};
    const config: any = origin[`${this.plugin}`] || this.bot.config.plugins[`${this.plugin}`] || undefined;
    if (!config || !config.enabled) {
      return;
    }

    // Define client
    const client: any = new dialogflow.SessionsClient({
      credentials: {private_key: config.account_secrets.replace(/\\n/g, '\n'), client_email: config.account_id}
    });

    // Define client session
    let clientSession: string;
    if (message.settings.environment) {
      clientSession = `projects/${config.project_id}/agent/environments/${message.settings.environment}/users/-/sessions/${message.ticket}:detectIntent`;
    } else {
      clientSession = `projects/${config.project_id}/agent/sessions/${message.ticket}`;
    }

    // Define client payload
    const clientPayload: any = {session: clientSession, queryParams: {}, queryInput: {}};
    if (message.text) {
      clientPayload.queryInput.text = {text: `${message.text}`, languageCode: `${message.language}`};
    }
    if (message.file) {
      clientPayload.queryInput.text = {text: `${message.file}`, languageCode: `${message.language}`};
    }
    if (message.action && !['show_dialog', 'hide_dialog', 'quit_dialog', 'talking', 'silence', 'waiting', 'disconnect'].includes(message.action)) {
      clientPayload.queryInput.event = {name: `${message.action}`, languageCode: `${message.language}`};
    }
    if (message.action && message.data.length && clientPayload.queryInput.event) {
      clientPayload.queryInput.event.parameters = jsonToStructProto(message.getDataObject());
    }
    if (message.settings?.contexts?.length > 0) {
      clientPayload.queryParams.contexts = message.settings.contexts;
    }
    if (!clientPayload.queryInput.text && !clientPayload.queryInput.event) {
      return;
    }

    // Define result
    let result: any;
    try {
      result = await client.detectIntent(clientPayload);
    } catch (error: any) {
      return;
    }
    if (result[0]?.queryResult?.intent?.displayName) {
      message.intent = result[0]?.queryResult?.intent?.displayName;
    }
    if (result[0]?.queryResult?.outputContexts) {
      message.settings.contexts = result[0].queryResult.outputContexts;
    }

    // Define outgoing messages
    const outgoingMessages: any[] = [];
    if (result[0]?.queryResult?.fulfillmentMessages) {
      for (const m in result[0].queryResult.fulfillmentMessages) {
        // Verify items

        // Verify text items
        const textItems = result[0].queryResult.fulfillmentMessages[m].text?.text || [];
        if (textItems.length > 0) {
          for (const t in textItems) {
            const text = textItems[t];
            if (text) {
              const outgoingMessage: any = {};
              outgoingMessage.parent = message.id;
              outgoingMessage.origin = message.origin;
              outgoingMessage.ticket = message.ticket;
              outgoingMessage.source = message.source;
              outgoingMessage.target = message.target;
              outgoingMessage.action = message.action;
              outgoingMessage.intent = message.intent;
              outgoingMessage.language = message.language;
              outgoingMessage.settings = message.settings;
              outgoingMessage.incoming = message.toObject();
              outgoingMessage.text = `${text}`;
              outgoingMessages.push(outgoingMessage);
            }
          }
        }

        // Verify list items
        const listItems = result[0].queryResult.fulfillmentMessages[m].payload?.fields?.richContent?.listValue?.values || [];
        if (listItems.length > 0) {
          for (const m in listItems) {
            const _text = [];
            const _file = [];
            const _menu = [];
            const _form = [];

            for (const item of listItems[m].listValue?.values || []) {
              const r = structProtoToJson(item.structValue);
              if (typeof r.type === 'undefined' && typeof r.text !== 'undefined') {
                if (typeof r.text === 'object') {
                  r.text = r.text[Math.floor(Math.random() * r.text.length)];
                }
                _text.push(`${r.text || ''}`);
                continue;
              }
              if (typeof r.type === 'undefined' && typeof r.file !== 'undefined') {
                if (typeof r.file === 'object') {
                  r.file = r.file[Math.floor(Math.random() * r.file.length)];
                }
                _file.push(`${r.file || ''}`);
                continue;
              }
              if (typeof r.type === 'undefined' && typeof r.menu !== 'undefined') {
                if (typeof r.menu === 'object') {
                  r.menu = r.menu[Math.floor(Math.random() * r.menu.length)];
                }
                for (const x of r.menu) {
                  _menu.push(x);
                }
                continue;
              }
              if (typeof r.type === 'undefined' && typeof r.form !== 'undefined') {
                if (typeof r.form === 'object') {
                  r.form = r.form[Math.floor(Math.random() * r.form.length)];
                }
                for (const x of r.form) {
                  _form.push(x);
                }
                continue;
              }

              // Verify old format
              if (typeof r.type !== 'undefined') {
                if (typeof r.rawUrl === 'object') {
                  r.rawUrl = r.rawUrl[Math.floor(Math.random() * r.rawUrl.length)];
                }
                if (typeof r.display === 'string') {
                  r.attr = r.attr || {};
                  r.attr.display = r.display;
                }
                if (r.type == 'text') {
                  _text.push(`${r.text || r.title || r.subtitle || ''}`);
                }
                if (r.type == 'file' || r.type == 'image' || r.type == 'video' || r.type == 'audio' || r.type == 'document') {
                  _file.push(`${r.file || r.rawUrl || ''}`);
                }
                if (r.type == 'menu' || r.type == 'list') {
                  _menu.push({
                    text: `${r.text || r.title || ''}`,
                    help: `${r.help || r.subtitle || ''}`,
                    file: `${r.file || ''}`,
                    attr: r.attr || r.attributes,
                    action: r.action || r.event,
                    intent: r.intent
                  });
                }
                if (r.type == 'form') {
                  _form.push({
                    text: `${r.text || r.title || ''}`,
                    help: `${r.help || r.subtitle || ''}`,
                    file: `${r.file || ''}`,
                    attr: r.attr || r.attributes,
                    action: r.action || r.event,
                    intent: r.intent
                  });
                }
              }
            }

            // Define outgoing message
            if (_text.length > 0 || _file.length > 0 || _menu.length > 0 || _form.length > 0) {
              const outgoingMessage: any = {};
              outgoingMessage.parent = message.id;
              outgoingMessage.origin = message.origin;
              outgoingMessage.ticket = message.ticket;
              outgoingMessage.source = message.source;
              outgoingMessage.target = message.target;
              outgoingMessage.action = message.action;
              outgoingMessage.intent = message.intent;
              outgoingMessage.language = message.language;
              outgoingMessage.settings = message.settings;
              outgoingMessage.incoming = message.toObject();

              if (_text.length > 0) {
                outgoingMessage.text = _text[0];
              }
              if (_file.length > 0) {
                outgoingMessage.file = _file[0];
              }
              if (_menu.length > 0) {
                outgoingMessage.menu = _menu;
              }
              if (_form.length > 0) {
                outgoingMessage.form = _form;
              }
              outgoingMessages.push(outgoingMessage);
            }
          }
        }
      }
    }

    // Verify outgoing messages
    if (outgoingMessages.length > 0) {
      await this.bot.addOutgoingMessages(outgoingMessages);
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
  return {fields};
}

function jsonValueToProto(value: any) {
  const valueProto: any = {};
  if (value === null) {
    valueProto.kind = 'nullValue';
    valueProto.nullValue = 'NULL_VALUE';
  } else if (value instanceof Array) {
    valueProto.kind = 'listValue';
    valueProto.listValue = {values: value.map(jsonValueToProto)};
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
