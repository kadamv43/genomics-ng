import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditContactDetailsComponent } from './edit-contact-details/edit-contact-details.component';

const routes: Routes = [
  {path:'',component:EditContactDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactDetailsRoutingModule { }
