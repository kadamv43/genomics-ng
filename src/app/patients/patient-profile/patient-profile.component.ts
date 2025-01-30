import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { app } from 'electron';
import { it } from 'node:test';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ShowFullDocumentsComponent } from 'src/app/appointments/show-full-documents/show-full-documents.component';
import { InvoiceViewComponent } from 'src/app/invoices/invoice-view/invoice-view.component';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { environment } from 'src/environments/environment';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'app-patient-profile',
    templateUrl: './patient-profile.component.html',
    styleUrl: './patient-profile.component.scss',
    providers: [DialogService],
})
export class PatientProfileComponent implements OnInit {
    id = '';
    appointments = [];
    patientData = null;
    ref: DynamicDialogRef;
    visible: boolean = false;
    pageUrl = '';

    constructor(
        private route: ActivatedRoute,
        private appointmentService: AppointmentService,
        private dialogService: DialogService
    ) {}
    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.appointmentService
                .getAppointmentsByPatientId(this.id)
                .subscribe({
                    next: (res: any) => {
                        this.appointments = res?.appointments.map((item) => {
                            let services = item?.invoice?.particulars?.map(
                                (serv) => serv.name
                            );

                            // console.log(services);
                            return { ...item, services };
                        });

                        console.log(this.appointments);
                        this.patientData = res?.patient;
                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
        });
    }

    showDialog(id) {
        this.pageUrl = environment.baseUrl + 'web/invoice/' + id;
        this.visible = true;
    }

    openNote(note) {
        this.ref = this.dialogService.open(DialogComponent, {
            width: '70%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: {
                note,
            },
            // header: 'File Upload',
        });
    }

    openDialog(doc: string) {
        this.ref = this.dialogService.open(InvoiceViewComponent, {
            width: '70%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: {
                doc,
            },
            // header: 'File Upload',
        });
    }
}
