import { NgModule } from '@angular/core';
import { FlipBModule } from '@flip-b/web';
import { AccountsPageRoutingModule } from './accounts-routing.module';
import { AccountsPage } from './accounts.page';

@NgModule({
  declarations: [AccountsPage],
  entryComponents: [AccountsPage],
  imports: [FlipBModule, AccountsPageRoutingModule]
})
export class AccountsPageModule {}
