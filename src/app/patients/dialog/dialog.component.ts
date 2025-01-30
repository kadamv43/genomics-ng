import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    providers: [MessageService],
})
export class DialogComponent {
    note = '';

    constructor(private dialogConfig: DynamicDialogConfig) {}

    ngOnInit(): void {
        console.log(this.dialogConfig.data);
        this.note = this.dialogConfig.data.note;
    }
}
