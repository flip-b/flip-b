import { Model, Fields } from '@flip-b/app';

export default class AccountsModel extends Model {
  fields: Fields = {
    name: { type: String, index: true },
    group: { type: String, index: true },
    image: { type: String },
    notes: { type: String },
    phone: { type: String, index: true },
    email: { type: String, index: true },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipcode: { type: String },
      position: { type: Array, default: undefined }
    },
    website: { type: String },
    created_at: { type: Number },
    updated_at: { type: Number }
  };
}
