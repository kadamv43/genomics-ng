import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientCreateComponent } from './patient-create/patient-create.component';
import { PatientProfileComponent } from './patient-profile/patient-profile.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
    { path: '', component: PatientListComponent },
    { path: 'edit/:id', component: PatientEditComponent },
    { path: 'create', component: PatientCreateComponent },
    { path: 'profile/:id', component: PatientProfileComponent },
    { path: 'reports/:id', component: ReportsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PatientsRoutingModule {}
