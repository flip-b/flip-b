import {App} from './app';
import mongoose from 'mongoose';

/**
 * Model
 */
export abstract class Model {
  app: App;
  name: string;
  path: string;

  /**
   * Fields
   */
  abstract fields: Fields;

  /**
   * Define getters, setters and plugins
   */
  options: any = {};
  getters: any = {};
  setters: any = {};
  plugins: any = {};

  /**
   * Constructor
   */
  constructor(app: App) {
    this.app = app;
    this.name = this.app.helper.changeCase.snakeCase(`${this.constructor.name}`).replace(/_model$/, '');
    this.path = this.app.helper.changeCase.paramCase(`${this.constructor.name}`).replace(/-model$/, '');
  }

  /**
   * Get model
   */
  getModel(): any {
    if (typeof this.options.timestamps === 'undefined') {
      this.options.timestamps = {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      };

      this.options.versionKey = false;
    }

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
    return this.app.database.model(`${this.name}`, schema);
  }
}

/**
 * Fields interface
 */
export interface Fields {
  [index: string]: any;
}

export class Document extends mongoose.Document {}
export class Schema extends mongoose.Schema {}
