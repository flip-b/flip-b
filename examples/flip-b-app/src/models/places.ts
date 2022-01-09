import { Model, Fields, Schema } from '@flip-b/app';

export default class PlacesModel extends Model {
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
    config: {
      theme: { type: String },
      color: { type: String },
      color_contrast: { type: String },
      image: { type: String },
      panel: { type: String }
    },
    account: { type: Schema.Types.ObjectId, ref: 'accounts', index: true },
    created_at: { type: Number },
    updated_at: { type: Number }
  };
}
