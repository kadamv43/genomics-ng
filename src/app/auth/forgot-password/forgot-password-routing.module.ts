import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputEmailComponent } from './input-email/input-email.component';
import { NewPasswordComponent } from './new-password/new-password.component';

const routes: Routes = [
  {path:'input-email',component:InputEmailComponent},
  {path:'new-password/:id',component:NewPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
