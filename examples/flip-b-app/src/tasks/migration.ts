import { Task } from '@flip-b/app';

export default class MigrationTask extends Task {
  accounts: any = {};

  /**
   * Run
   */
  async run(...args: any): Promise<any> {
    if (args.includes('delete-all') || args.includes('delete-accounts')) {
      console.info('- Delete accounts');
      await this.app.models.accounts.deleteMany({});
    }
    if (args.includes('delete-all') || args.includes('delete-places')) {
      console.info('- Delete places');
      await this.app.models.places.deleteMany({});
    }
    if (args.includes('delete-all') || args.includes('delete-users')) {
      console.info('- Delete users');
      await this.app.models.users.deleteMany({});
    }
    if (args.includes('update-all') || args.includes('update-accounts')) {
      console.info('- Import accounts');
      await this.importAccounts();
    }
    if (args.includes('update-all') || args.includes('update-places')) {
      console.info('- Import places');
      await this.importPlaces();
    }
    if (args.includes('update-all') || args.includes('update-users')) {
      console.info('- Import users');
      await this.importUsers();
    }
  }

  /**
   * Import accounts
   */
  private async importAccounts(): Promise<any> {
    const items = (await import(`${this.app.config.var}/datastore/accounts`)).default;
    let total = 0;
    for (const item of items) {
      if (item.name && item.name) {
        try {
          const record = (await this.app.models.accounts.findOne({ name: item.name })) || new this.app.models.accounts();
          record.name = item.name || record.name || undefined;
          record.group = item.group || record.group || undefined;
          record.image = item.image || record.image || undefined;
          record.notes = item.notes || record.notes || undefined;
          record.phone = item.phone || record.phone || undefined;
          record.email = item.email || record.email || undefined;
          record.address = item.address || record.address || undefined;
          record.website = item.website || record.website || undefined;
          await record.save();
          total++;
          this.accounts[item.name] = { account: record._id.toString(), places: {} };
        } catch (error) {
          console.error(`${error}`, item);
        }
      }
    }
    console.info(`- Accounts: ${total}`);
  }

  /**
   * Import places
   */
  private async importPlaces(): Promise<any> {
    const items = (await import(`${this.app.config.var}/datastore/places`)).default;
    let total = 0;
    for (const item of items) {
      if (item.account && this.accounts[item.account] && item.name) {
        try {
          const record = (await this.app.models.places.findOne({ name: item.name, account: this.accounts[item.account].account })) || new this.app.models.places();
          record.account = this.accounts[item.account].account;
          record.name = item.name || record.name || undefined;
          record.group = item.group || record.group || undefined;
          record.image = item.image || record.image || undefined;
          record.notes = item.notes || record.notes || undefined;
          record.phone = item.phone || record.phone || undefined;
          record.email = item.email || record.email || undefined;
          record.address = item.address || record.address || undefined;
          record.website = item.website || record.website || undefined;
          record.person = item.person || record.person || undefined;
          record.locale = item.locale || record.locale || undefined;
          record.config = item.config || record.config || undefined;
          await record.save();
          total++;
          this.accounts[item.account].places[item.name] = record._id.toString();
        } catch (error) {
          console.error(`${error}`, item);
        }
      }
    }
    console.info(`- Places: ${total}`);
  }

  /**
   * Import Users
   */
  private async importUsers(): Promise<any> {
    const items = (await import(`${this.app.config.var}/datastore/users`)).default;
    let total = 0;
    for (const item of items) {
      if (item.name && item.name) {
        try {
          const record = (await this.app.models.users.findOne({ email: item.email })) || new this.app.models.users();
          record.name = item.name || record.name || undefined;
          record.group = item.group || record.group || undefined;
          record.image = item.image || record.image || undefined;
          record.notes = item.notes || record.notes || undefined;
          record.phone = item.phone || record.phone || undefined;
          record.email = item.email || record.email || undefined;
          record.address = item.address || record.address || undefined;
          record.website = item.website || record.website || undefined;
          record.person = item.person || record.person || undefined;
          record.locale = item.locale || record.locale || undefined;
          record.recovery = item.recovery ? this.app.helper.bcryptjs.hashSync(item.recovery) : record.recovery || undefined;
          record.password = item.password ? this.app.helper.bcryptjs.hashSync(item.password) : record.password || undefined;
          record.security = item.security || record.security || undefined;
          record.is_admin = item.is_admin || undefined;
          if (item.accounts && item.accounts.length > 0) {
            record.accounts = [];
            for (const a of item.accounts) {
              if (a.account) {
                const r = await this.app.models.accounts.find({
                  name: { $regex: new RegExp('^' + a.account + '.*', 'i') }
                });
                for (const o of r) {
                  const places: any = [];
                  a.places = a.places && a.places.length > 0 ? a.places : [{ place: '' }];
                  for (const p of a.places) {
                    const t = await this.app.models.places.find({
                      account: { $eq: o._id },
                      name: { $regex: new RegExp('^' + p.place + '.*', 'i') }
                    });
                    t.forEach((x: any) => {
                      places.push({ place: x._id });
                    });
                  }
                  record.accounts.push({
                    account: o._id,
                    access: a.access || 'user',
                    status: a.status || 'disabled',
                    places: places
                  });
                }
              }
            }
          }
          await record.save();
          total++;
        } catch (error) {
          console.error(`${error}`, item);
        }
      }
    }
    console.info(`- Users: ${total}`);
  }
}
