import { Controller } from '@flip-b/app';

export default class UsersController extends Controller {
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

    // Define access filter
    filters.$and.push({ 'accounts.access': { $in: auth.access == 'administrator' ? ['administrator', 'supervisor', 'operator'] : ['operator'] } });
    filters.$and.push({ 'accounts.places.place': { $eq: this.app.database.Types.ObjectId(auth.place) } });
    filters.$and.push({ 'accounts.account': { $eq: this.app.database.Types.ObjectId(auth.account) } });
    filters.$and.push({ _id: { $ne: this.app.database.Types.ObjectId(auth._id) } });

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
    const select: any = '-__v -recovery -password -is_admin';

    // Define result
    const result: any = await this.app.models.users.find(filters, select, options).exec();
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

    // Define access filter
    filters.$and.push({ 'accounts.access': { $in: auth.access == 'administrator' ? ['administrator', 'supervisor', 'operator'] : ['operator'] } });
    filters.$and.push({ 'accounts.places.place': { $eq: this.app.database.Types.ObjectId(auth.place) } });
    filters.$and.push({ 'accounts.account': { $eq: this.app.database.Types.ObjectId(auth.account) } });
    filters.$and.push({ _id: { $ne: this.app.database.Types.ObjectId(auth._id) } });

    // Define facets
    const facets: any = {};

    // Define facets: by group
    facets.by_group = [{ $group: { _id: '$group', count: { $sum: 1 } } }, { $project: { _id: 0, title: '$_id', count: 1 } }, { $sort: { count: -1 } }];

    // Define facets: by total
    facets.by_total = [{ $group: { _id: null, count: { $sum: 1 } } }, { $project: { _id: 0, count: 1 } }];

    // Define object
    const object: any = await this.app.models.users.aggregate([{ $match: filters }, { $facet: facets }]);

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
    filters.$and.push({ 'accounts.account': { $eq: this.app.database.Types.ObjectId(auth.account) } });
    filters.$and.push({ _id: { $ne: this.app.database.Types.ObjectId(auth._id) } });
    filters.$and.push({ _id: { $eq: this.app.database.Types.ObjectId(body._id) } });

    // Define select
    const select: any = '-__v -recovery -password -is_admin';

    // Define object
    const object: any = await this.app.models.users.findOne(filters).select(select);

    // Define result
    const result: any = object ? object.toObject() : null;

    // Define places
    if (result) {
      const account = result.accounts.find((o: any) => o.account.toString() == auth.account.toString()) || {};
      const places: any = await this.app.models.places.find({ account: { $eq: auth.account }, _id: { $in: auth.places || [] } }, undefined, { sort: { name: 1 } }).select('name');
      result.access = account.access || '';
      result.status = account.status || '';
      result.places = account.places || [];
      result.places = places.map((p: any) => {
        const place: any = result.places.find((o: any) => o.place.toString() == p._id.toString()) || {};
        return {
          _id: place._id || undefined,
          place: p
        };
      });
      delete result.accounts;
    }
    return result;
  }

  /**
   * Update
   */
  async update(body: any, auth: any): Promise<any> {
    const filters: any = { $and: [] };
    filters.$and.push({ 'accounts.account': { $eq: this.app.database.Types.ObjectId(auth.account) } });
    filters.$and.push({ _id: { $ne: this.app.database.Types.ObjectId(auth._id) } });
    filters.$and.push({ _id: { $eq: this.app.database.Types.ObjectId(body._id) } });

    if (body.password) {
      body.password = this.app.helper.bcryptjs.hashSync(body.password);
    } else {
      delete body.password;
    }

    // Define object
    const object: any = body._id ? await this.app.models.users.findOne(filters) : new this.app.models.users();
    if (object) {
      for (const b in body) {
        object[b] = body[b] || undefined;
      }

      const exists = object.accounts.find((a: any) => a.account.toString() == auth.account);
      if (!exists) {
        object.accounts.push({
          account: auth.account,
          access: 'operator',
          status: 'enabled',
          places: []
        });
      }

      const account = object.accounts.find((a: any) => a.account.toString() == auth.account);
      if (account) {
        account.access = body.access || account.access;
        account.status = body.status || account.status;
        (body.places || []).forEach((p: any) => {
          if (auth.places.includes(p.place)) {
            const i = account.places.findIndex((o: any) => o.place.toString() == p.place);
            if (p.enabled) {
              if (i > -1) {
                account.places[i] = p;
              } else {
                account.places.push(p);
              }
            } else {
              if (i > -1) {
                account.places.pull({ _id: account.places[i]._id });
              }
            }
          }
        });
      }
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
    filters.$and.push({ 'accounts.account': { $eq: this.app.database.Types.ObjectId(auth.account) } });
    filters.$and.push({ _id: { $ne: this.app.database.Types.ObjectId(auth._id) } });
    filters.$and.push({ _id: { $eq: this.app.database.Types.ObjectId(body._id) } });

    // Define object
    const object: any = await this.app.models.users.deleteOne(filters);

    // Define result
    const result: any = { _id: body._id, status: object.acknowledged };
    return result;
  }

  /**
   * Profile
   */
  async profile(body: any, auth: any): Promise<any> {
    if (!body || !auth) {
      throw new Error('#400 Missing parameters');
    }

    // Define object
    const object: any = await this.app.models.users.findById({ _id: auth._id });
    if (body.name !== undefined) {
      object.set({ name: body.name || undefined });
    }
    if (body.image !== undefined) {
      object.set({ image: body.image || undefined });
    }
    if (body.phone !== undefined) {
      object.set({ phone: body.phone || undefined });
    }
    if (body.email !== undefined) {
      object.set({ email: body.email || undefined });
    }
    if (body.address !== undefined) {
      object.set({ address: body.address || undefined });
    }
    if (body.website !== undefined) {
      object.set({ website: body.website || undefined });
    }
    if (body.recovery !== undefined) {
      object.set({ recovery: this.app.helper.bcryptjs.hashSync(body.recovery) || undefined });
    }
    if (body.password !== undefined) {
      object.set({ password: this.app.helper.bcryptjs.hashSync(body.password) || undefined });
    }
    if (body.security !== undefined) {
      object.set({ security: body.security || undefined });
    }
    await object.save();

    // Define result
    const result: any = await this.session(body, auth);

    // Define account
    if (result.account) {
      result.account = await this.app.models.accounts.findOne({ _id: { $eq: result.account } }).select('_id name group image notes phone email address website');

      // Define place
      if (result.place) {
        result.place = await this.app.models.places.findOne({ account: { $eq: result.account._id }, _id: { $eq: result.place } }).select('_id name group image notes phone email address website person locale device config');
      }
    }

    // Define token
    const token: any = {};
    token._id = result._id.toString();
    token.account = result.account?._id.toString();
    token.place = result.place?._id.toString();
    token.access = result.access;
    token.status = result.status;
    result.token = this.app.helper.jsonwebtoken.sign(token, this.app.config.security.secret, { expiresIn: this.app.config.security.expire });
    return result;
  }

  /**
   * Signout
   */
  async signout(body: any, auth: any): Promise<any> {
    if (!auth || !body || !body.email) {
      throw new Error('#400 Missing parameters');
    }

    // Define object
    const object: any = await this.app.models.users.findOne({ email: body.email.toLowerCase().trim() });
    if (!object) {
      throw new Error('#403 Invalid credentials');
    }

    // Define result
    const result: any = { status: true, goto: 'home' };
    return result;
  }

  /**
   * Signin
   */
  async signin(body: any, auth: any): Promise<any> {
    if (!auth || !body || !body.email || !body.password) {
      throw new Error('#400 Missing parameters');
    }

    // Define object
    const object: any = await this.app.models.users.findOne({ email: body.email.toLowerCase().trim() });
    if (!object || !this.app.helper.bcryptjs.compareSync(body.password, object.password)) {
      throw new Error('#403 Invalid credentials');
    }

    // Verify 2fa
    if (object.security != '2fa') {
      return await this.profile({}, object.toObject());
    }

    // Define data
    const random: any = parseInt(this.app.helper.crypto.randomBytes(4).toString('hex'), 16).toString().substring(0, 5);
    object.recovery = this.app.helper.bcryptjs.hashSync(random);
    await object.save();

    // Define result
    const result: any = { status: true, goto: 'user/verify', email: object.email };
    return result;
  }

  /**
   * Signup
   */
  async signup(body: any, auth: any): Promise<any> {
    if (!auth || !body || !body.email) {
      throw new Error('#400 Missing parameters');
    }

    // Define object
    const object: any = (await this.app.models.users.findOne({ email: body.email.toLowerCase().trim() })) ? null : new this.app.models.users();
    if (!object) {
      throw new Error('#403 Invalid credentials');
    }

    // Define data
    const random: any = parseInt(this.app.helper.crypto.randomBytes(4).toString('hex'), 16).toString().substr(0, 5);
    object.name = body.name || body.email.split('@')[0];
    object.email = body.email;
    object.recovery = this.app.helper.bcryptjs.hashSync(random);
    object.security = 'standard';
    await object.save();

    // Define result
    const result: any = { status: true, goto: 'user/verify', email: object.email, change_password: true };
    return result;
  }

  /**
   * Forgot
   */
  async forgot(body: any, auth: any): Promise<any> {
    if (!auth || !body || !body.email) {
      throw new Error('#400 Missing parameters');
    }

    // Define object
    const object: any = await this.app.models.users.findOne({ email: body.email.toLowerCase().trim() });
    if (!object) {
      throw new Error('#403 Invalid credentials');
    }

    // Define data
    const random: any = parseInt(this.app.helper.crypto.randomBytes(4).toString('hex'), 16).toString().substr(0, 5);
    object.recovery = this.app.helper.bcryptjs.hashSync(random);
    await object.save();

    // Define result
    const result: any = { status: true, goto: 'user/verify', email: object.email, change_password: true };
    return result;
  }

  /**
   * Verify
   */
  async verify(body: any, auth: any): Promise<any> {
    if (!auth || !body || !body.email || !body.recovery) {
      throw new Error('#400 Missing parameters');
    }

    // Define object
    const object: any = await this.app.models.users.findOne({ email: body.email.toLowerCase().trim() });
    if (!object || !this.app.helper.bcryptjs.compareSync(body.recovery, object.recovery)) {
      throw new Error('#403 Invalid credentials');
    }
    object.recovery = undefined;
    object.password = body.password ? this.app.helper.bcryptjs.hashSync(body.password) : object.password;
    await object.save();

    // Define result
    const result: any = await this.profile({}, object);
    return result;
  }

  /**
   * Get authorization
   */
  async getAuthorization(token: string, body: any = {}): Promise<any> {
    if (token) {
      const auth: any = this.app.helper.jsonwebtoken.verify(token, `${this.app.config.security.secret}`);
      return await this.session(body, auth);
    }
  }

  /**
   * Session
   */
  async session(body: any, auth: any): Promise<any> {
    if (!body || !auth || !auth._id) {
      throw new Error('#401 Invalid authorization');
    }

    // Define object
    const object: any = await this.app.models.users.findById({ _id: auth._id });

    // Define values
    const values: any = object.toObject();

    // Is admin?
    if (values.is_admin) {
      const allAccounts = await this.app.models.accounts.find({}).select('_id');
      for (const a of allAccounts) {
        const allAccountPlaces = await this.app.models.places.find({ account: { $eq: a._id } }).select('_id');
        values.accounts.push({
          account: a._id,
          access: 'administrator',
          status: 'enabled',
          places: allAccountPlaces.map((p: any) => {
            return { place: p._id };
          })
        });
      }
    }

    // Define result
    const result: any = {};
    result._id = values._id;
    result.name = values.name;
    result.group = values.group;
    result.image = values.image;
    result.phone = values.phone;
    result.email = values.email;
    result.address = values.address;
    result.website = values.website;
    result.person = values.person;
    result.locale = values.locale;
    result.security = values.security;

    result.accounts = [];
    result.account = undefined;
    result.places = [];
    result.place = undefined;
    result.access = 'user';
    result.status = 'enabled';

    if (body.account) {
      auth.account = body.account;
    }
    if (body.place) {
      auth.place = body.place;
    }

    for (const a of values.accounts || []) {
      if (a.account && a.status == 'enabled' && ['administrator', 'supervisor', 'operator'].includes(a.access) && a.places?.length > 0) {
        result.accounts.push(a.account.toString());

        if (values.accounts.length == 1 || (auth.account && auth.account == a.account.toString())) {
          result.account = a.account.toString();

          for (const p of a.places || []) {
            result.places.push(p.place.toString());
            if (a.places.length == 1 || (auth.place && auth.place == p.place.toString())) {
              result.place = p.place.toString();
              result.access = p.access || a.access || result.access;
              result.status = p.status || a.status || result.status;
            }
          }
        }
      }
    }
    return result;
  }
}
