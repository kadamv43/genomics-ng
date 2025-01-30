import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
    selector: 'app-notepad',
    templateUrl: './notepad.component.html',
    styleUrl: './notepad.component.scss',
})
export class NotepadComponent {
    note = '';
    id;
    constructor(
        private appointmentService: AppointmentService,
        private api: ApiService,
        private dialogConfig: DynamicDialogConfig,
        private toast: MessageService,
        private ref: DynamicDialogRef
    ) {}

    ngOnInit(): void {
        this.id = this.dialogConfig.data.id;
        this.appointmentService.findById(this.id).subscribe({
            next: (res: any) => {
                this.note = res?.doctor_note;
            },
        });
    }

    save() {
        this.appointmentService
            .update(this.id, { doctor_note: this.note })
            .subscribe({
                next: (res) => {
                    this.toast.add({
                        key: 'tst',
                        severity: 'success',
                        summary: 'Success Message',
                        detail: 'Data Saved successfully',
                    });
                    this.ref.close();
                    console.log(res);
                },
                error: (err) => {
                    this.ref.close();
                    console.log(err);
                },
            });
    }
}
