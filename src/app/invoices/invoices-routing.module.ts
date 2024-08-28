import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { InvoicesEditComponent } from './invoices-edit/invoices-edit.component';
import { InvoicesCreateComponent } from './invoices-create/invoices-create.component';

const routes: Routes = [
    { path: '', component: InvoicesListComponent },
    { path: 'edit', component: InvoicesEditComponent },
    { path: 'create', component: InvoicesCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
