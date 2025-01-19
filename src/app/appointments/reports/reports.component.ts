import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { environment } from 'src/environments/environment';
import { SafeUrlPipe } from 'src/app/safe-url.pipe';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ShowFullDocumentsComponent } from '../show-full-documents/show-full-documents.component';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss',
    providers: [MessageService, SafeUrlPipe, DialogService],
})
export class ReportsComponent implements OnInit {
    uploadPath = environment.uploadPath;
    pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
    ref: DynamicDialogRef | undefined;
    id!: string;
    documents = [];
    queryParams = {};
    constructor(
        private route: ActivatedRoute,
        private appointmentService: AppointmentService,
        private toast: MessageService,
        private dialogService: DialogService
    ) {}
    ngOnInit(): void {
        this.queryParams = this.route.snapshot.queryParams;
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.appointmentService.findById(this.id).subscribe((res: any) => {
                this.documents = res?.files;
            });
        });
    }

    delete(id) {
        this.appointmentService.deleteReport(this.id, id).subscribe((res) => {
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
