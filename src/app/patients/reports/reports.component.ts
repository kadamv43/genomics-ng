import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { environment } from 'src/environments/environment';
import { SafeUrlPipe } from 'src/app/safe-url.pipe';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth.service';
import { ShowFullDocumentsComponent } from 'src/app/appointments/show-full-documents/show-full-documents.component';
import { PatientService } from 'src/app/services/patient/patient.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss',
    providers: [MessageService, SafeUrlPipe, DialogService],
})
export class ReportsComponent {
    uploadPath = environment.uploadPath;
    pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
    ref: DynamicDialogRef | undefined;
    id!: string;
    documents = [];
    queryParams = {};
    patienId = '';
    role = '';
    backLink = '/patients';

    constructor(
        private route: ActivatedRoute,
        private patientService: PatientService,
        private toast: MessageService,
        private dialogService: DialogService,
        private authService: AuthService
    ) {}
    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.patientService.findById(this.id).subscribe((res: any) => {
                // this.patienId = res?.patient?._id;
                this.documents = res?.files;
                this.route.queryParams.subscribe((params) => {
                    this.queryParams = params;
                    if (params['from'] == 'patient') {
                        this.backLink = '/patients/profile/' + this.patienId;
                    }
                    console.log(params);
                });
            });
        });

        this.role = this.authService.getRole();
    }

    delete(id) {
        this.patientService.deleteReport(this.id, id).subscribe((res) => {
            this.documents = this.documents.filter((item: any) => {
                return item.id != id;
            });
            this.toast.add({
                key: 'tst',
                severity: 'error',
                summary: 'deleted ',
                detail: 'image deleted successfully',
            });
        });
    }

    openDialog(doc: string) {
        this.ref = this.dialogService.open(ShowFullDocumentsComponent, {
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
