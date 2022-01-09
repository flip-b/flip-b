import { App } from './app';
import mongoose from 'mongoose';

/**
 * Model
 */
export abstract class Model {
  app: App;

  /**
   * Fields
   */
  abstract fields: Fields;

  /**
   * Getters
   */
  getters: any = {};

  /**
   * Setters
   */
  setters: any = {};

  /**
   * Constructor
   */
  constructor(app: App) {
    this.app = app;
  }

  /**
   * Get model
   */
  getModel(): any {
    return this.getSchema();
  }

  /**
   * Get model name
   */
  getModelName(): any {
    return this.app.helper.changeCase.snakeCase(`${this.constructor.name}`).replace(/_model$/, '');
  }

  /**
   * Get model path
   */
  getModelPath(): any {
    return this.app.helper.changeCase.paramCase(`${this.constructor.name}`).replace(/-model$/, '');
  }

  /**
   * Get schema
   */
  private getSchema(): any {
    const schema = new mongoose.Schema<Fields>(this.fields);
    for (const v in this.getters) {
      schema.virtual(`${v}`).get(this.getters[`${v}`]);
    }
    for (const v in this.setters) {
      schema.virtual(`${v}`).set(this.setters[`${v}`]);
    }
    schema.pre('save', function save(this: Fields, next: any) {
      this.created_at = this.created_at || new Date().getTime();
      this.updated_at = new Date().getTime();
      next();
    });
    return this.app.database.model(`${this.getModelName()}`, schema);
  }
}

export interface Fields {
  [index: string]: any;
}

export class Document extends mongoose.Document {}
export class Schema extends mongoose.Schema {}
