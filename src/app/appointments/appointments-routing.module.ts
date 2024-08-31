import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentCreateComponent } from './appointment-create/appointment-create.component';
import { AppointmentEditComponent } from './appointment-edit/appointment-edit.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
    { path: '', component: AppointmentListComponent },
    { path: 'create', component: AppointmentCreateComponent },
    { path: 'edit/:id', component: AppointmentEditComponent },
    { path: 'generate-invoice/:id', component: InvoiceComponent },
    { path: 'reports/:id', component: ReportsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppointmentsRoutingModule {}
