import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorEditComponent } from './doctor-edit/doctor-edit.component';
import { DoctorCreateComponent } from './doctor-create/doctor-create.component';


const routes: Routes = [
    { path: '', component: DoctorListComponent },
    { path: 'edit/:id', component: DoctorEditComponent },
    { path: 'create', component: DoctorCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsRoutingModule { }
