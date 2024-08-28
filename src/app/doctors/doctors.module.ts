import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorsRoutingModule } from './doctors-routing.module';
import { TableModule } from 'primeng/table';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorCreateComponent } from './doctor-create/doctor-create.component';
import { DoctorEditComponent } from './doctor-edit/doctor-edit.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';


@NgModule({
    declarations: [
        DoctorListComponent,
        DoctorCreateComponent,
        DoctorEditComponent,
    ],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ReactiveFormsModule,
        PanelModule,
        DropdownModule,
        CalendarModule,
        ToastModule,
        ToolbarModule,
        FileUploadModule,
        DoctorsRoutingModule,
    ],
})
export class DoctorsModule {}
