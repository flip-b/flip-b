import {App} from './app';
import mongoose from 'mongoose';

export abstract class Model {
  app: App;

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
  }

  /**
   * Get model
   */
  get self(): any {
    if (typeof this.options.timestamps === 'undefined') {
      this.options.timestamps = {createdAt: 'created_at', updatedAt: 'updated_at'};
      this.options.versionKey = false;
    }

    // Define entity
    const entity: any = this.app.helper.changeCase.snakeCase(`${this.constructor.name}`).replace(/_model$/, '');

    // Define schema
    const schema: any = new mongoose.Schema<Fields>(this.fields, this.options);

    // Define schema getters
    for (const v in this.getters) {
      schema.virtual(`${v}`).get(this.getters[`${v}`]);
    }

    // Define schema setters
    for (const v in this.setters) {
      schema.virtual(`${v}`).set(this.setters[`${v}`]);
    }

    // Define schema plugins
    for (const v in this.plugins) {
      schema.plugin(this.plugins[`${v}`]);
    }

    // Return model
    return this.app.database.model(entity, schema);
  }
}

export interface Fields {
  [index: string]: any;
}

export class Document extends mongoose.Document {}
export class Schema extends mongoose.Schema {}
