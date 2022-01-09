import { Controller } from '@flip-b/app';

export default class PlacesController extends Controller {
  /**
   * Search
   */
  async search(body: any, auth: any): Promise<any> {
    const filters: any = { $and: [] };

    // Define query filter
    if (body.where?.query) {
      const regexp: any = { $regex: new RegExp(body.where.query.replace(/[^ A-Za-z0-9 ÑÁÉÍÓÚ ñáéíóú -@,.¿?¡!/ ]/g, '') + '.*', 'i') };
      filters.$and.push({ $or: [{ name: regexp }, { phone: regexp }, { email: regexp }, { 'address.street': regexp }] });
    }

    // Define scope filter
    filters.$and.push({ _id: { $in: auth.places.map((v: any) => this.app.database.Types.ObjectId(v)) } });

    // Define options
    const options: any = {};
    if (body.offset) {
      options.skip = Number(body.offset);
    }
    if (body.limit) {
      options.limit = Number(body.limit);
    }
    if (body.order) {
      options.sort = { [body.order.field]: Number(body.order.type) || 1 };
    }

    // Define select
    const select: any = '-__v';

    // Define result
    const result: any = await this.app.models.places.find(filters, select, options).exec();
    return result;
  }

  /**
   * Count
   */
  async count(body: any, auth: any): Promise<any> {
    const filters: any = { $and: [] };

    // Define query filter
    if (body.where?.query) {
      const regexp: any = { $regex: new RegExp(body.where.query.replace(/[^ A-Za-z0-9 ÑÁÉÍÓÚ ñáéíóú -@,.¿?¡!/ ]/g, '') + '.*', 'i') };
      filters.$and.push({ $or: [{ name: regexp }, { phone: regexp }, { email: regexp }, { 'address.street': regexp }] });
    }

    // Define scope filter
    filters.$and.push({ _id: { $in: auth.places.map((v: any) => this.app.database.Types.ObjectId(v)) } });

    // Define facets
    const facets: any = {};

    // Define facets: by group
    facets.by_group = [{ $group: { _id: '$group', count: { $sum: 1 } } }, { $project: { _id: 0, title: '$_id', count: 1 } }, { $sort: { count: -1 } }];

    // Define facets: by total
    facets.by_total = [{ $group: { _id: null, count: { $sum: 1 } } }, { $project: { _id: 0, count: 1 } }];

    // Define object
    const object: any = await this.app.models.places.aggregate([{ $match: filters }, { $facet: facets }]);

    // Define result
    const result: any = [];
    if (object && object[0]) {
      for (const o in object[0]) {
        if (object[0][o].length > 0) {
          result.push({ code: o, data: object[0][o] });
        }
      }
    }
    return result;
  }

  /**
   * Select
   */
  async select(body: any, auth: any): Promise<any> {
    const filters: any = { $and: [] };
    filters.$and.push({ _id: { $in: auth.places.map((v: any) => this.app.database.Types.ObjectId(v)) } });
    filters.$and.push({ _id: { $eq: this.app.database.Types.ObjectId(body._id) } });

    // Define select
    const select: any = '-__v';

    // Define object
    const object: any = await this.app.models.places.findOne(filters).select(select);

    // Define result
    const result: any = object ? object.toObject() : null;
    return result;
  }

  /**
   * Update
   */
  async update(body: any, auth: any): Promise<any> {
    const filters: any = { $and: [] };
    filters.$and.push({ _id: { $in: auth.places.map((v: any) => this.app.database.Types.ObjectId(v)) } });
    filters.$and.push({ _id: { $eq: this.app.database.Types.ObjectId(body._id) } });

    // Define object
    const object: any = body._id ? await this.app.models.places.findOne(filters) : new this.app.models.places();
    if (object) {
      for (const b in body) {
        object[b] = body[b] || undefined;
      }
      object.account = auth.account;
      await object.save();
    }

    // Define result
    const result: any = { _id: object._id, status: true };
    return result;
  }

  /**
   * Delete
   */
  async delete(body: any, auth: any): Promise<any> {
    const filters: any = { $and: [] };
    filters.$and.push({ _id: { $in: auth.places.map((v: any) => this.app.database.Types.ObjectId(v)) } });
    filters.$and.push({ _id: { $eq: this.app.database.Types.ObjectId(body._id) } });

    // Define object
    const object: any = await this.app.models.places.deleteOne(filters);

    // Define result
    const result: any = { _id: body._id, status: object.acknowledged };
    return result;
  }
}
