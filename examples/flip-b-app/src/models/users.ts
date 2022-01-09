import { Model, Fields, Schema } from '@flip-b/app';

export default class UsersModel extends Model {
  fields: Fields = {
    name: { type: String, index: true },
    group: { type: String, index: true },
    image: { type: String },
    notes: { type: String },
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipcode: { type: String },
      position: { type: Array, default: undefined }
    },
    website: { type: String },
    recovery: { type: String },
    password: { type: String },
    security: { type: String },
    is_admin: { type: Boolean },
    accounts: [
      {
        account: { type: Schema.Types.ObjectId, ref: 'accounts', index: true },
        access: { type: String },
        status: { type: String },
        places: [
          {
            place: { type: Schema.Types.ObjectId, ref: 'places', index: true },
            access: { type: String },
            status: { type: String }
          }
        ]
      }
    ],
    created_at: { type: Number },
    updated_at: { type: Number }
  };

  /**
   * Getters
   */
  override getters: any = {
    slug: function (this: any) {
      return this.name.toLowerCase();
    }
  };
}
