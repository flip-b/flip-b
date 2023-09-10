import {App} from './app';
import {snakeCase} from 'change-case';
import mongoose from 'mongoose';

export abstract class Model {
  app: App;
  abstract fields: Fields;
  options: any = {};
  getters: any = {};
  setters: any = {};
  plugins: any = {};

  /**
   * Constructor
   */
  constructor(app: App) {
    this.app = app;
  }

  /**
   * Self
   */
  get self(): any {
    if (typeof this.options.timestamps === 'undefined') {
      this.options.timestamps = {createdAt: 'created_at', updatedAt: 'updated_at'};
      this.options.versionKey = false;
    }
    const entity: any = snakeCase(`${this.constructor.name}`).replace(/_model$/, '');
    const schema: any = new mongoose.Schema<Fields>(this.fields, this.options);
    for (const v in this.getters) {
      schema.virtual(`${v}`).get(this.getters[`${v}`]);
    }
    for (const v in this.setters) {
      schema.virtual(`${v}`).set(this.setters[`${v}`]);
    }
    for (const v in this.plugins) {
      schema.plugin(this.plugins[`${v}`]);
    }
    return this.app.database.model(entity, schema);
  }
}

export interface Fields {
  [index: string]: any;
}

export class Document extends mongoose.Document {}
export class Schema extends mongoose.Schema {}
export const Types = mongoose.Schema.Types;
export const ObjectId = mongoose.Schema.Types.ObjectId;
