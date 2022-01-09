import { NgModule } from '@angular/core';
import { FlipBModule } from '@flip-b/web';
import { UsersPageRoutingModule } from './users-routing.module';
import { UsersPage } from './users.page';

@NgModule({
  declarations: [UsersPage],
  entryComponents: [UsersPage],
  imports: [FlipBModule, UsersPageRoutingModule]
})
export class UsersPageModule {}
