import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { ToolbarModule } from 'primeng/toolbar';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { InvoicesCreateComponent } from './invoices-create/invoices-create.component';
import { InvoicesEditComponent } from './invoices-edit/invoices-edit.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    InvoicesListComponent,
    InvoicesCreateComponent,
    InvoicesEditComponent
  ],
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    InvoicesRoutingModule
  ]
})
export class InvoicesModule { }
