import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientCreateComponent } from './patient-create/patient-create.component';

const routes: Routes = [
    { path: '', component: PatientListComponent },
    { path: 'edit/:id', component: PatientEditComponent },
    { path: 'create', component: PatientCreateComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
