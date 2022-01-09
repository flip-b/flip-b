import { NgModule } from '@angular/core';
import { FlipBModule } from '@flip-b/web';
import { UserPageRoutingModule } from './user-routing.module';
import { UserPage } from './user.page';

@NgModule({
  declarations: [UserPage],
  entryComponents: [UserPage],
  imports: [FlipBModule, UserPageRoutingModule]
})
export class UserPageModule {}
