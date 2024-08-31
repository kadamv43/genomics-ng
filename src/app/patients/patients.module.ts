import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { TableModule } from 'primeng/table';
import { PatientCreateComponent } from './patient-create/patient-create.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ChipsModule } from 'primeng/chips';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';


@NgModule({
    declarations: [
        PatientCreateComponent,
        PatientEditComponent,
        PatientListComponent,
    ],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToolbarModule,
        FileUploadModule,
        ReactiveFormsModule,
        PatientsRoutingModule,
        PanelModule,
        DropdownModule,
        CalendarModule,
        RippleModule,
        MultiSelectModule,
        ToastModule,
        MessageModule,
        MessagesModule,
        ChipsModule,
        DialogModule
    ],
})
export class PatientsModule {}
