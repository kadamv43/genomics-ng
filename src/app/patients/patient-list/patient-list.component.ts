import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common/common.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import * as FileSaver from 'file-saver';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadReportsComponent } from 'src/app/appointments/upload-reports/upload-reports.component';

@Component({
    selector: 'app-patient-list',
    templateUrl: './patient-list.component.html',
    styleUrl: './patient-list.component.scss',
    providers: [MessageService, DialogService],
})
export class PatientListComponent implements OnInit {
    patients: any = [];
    loading = false;
    ref: DynamicDialogRef;
    totalRecords = 0;
    searchText = '';
    showImportDialog = false;
    role = '';

    constructor(
        private patientService: PatientService,
        private router: Router,
        private dialogService: DialogService,
        private commonService: CommonService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.role = this.authService.getRole();
    }

    loadPatients(event: any) {
        this.loading = true;
        const page = event.first / event.rows;
        const size = event.rows;

        let params = {};
        if (this.searchText != '') {
            params['q'] = this.searchText;
        }

        params['page'] = page;
        params['size'] = size;

        let queryParams = this.commonService.getHttpParamsByJson(params);

        this.patientService.getAll(queryParams).subscribe((data: any) => {
            this.patients = data.data;
            this.totalRecords = data.total;
            this.loading = false;
        });
    }

    goTo(url) {
        this.router.navigateByUrl(url);
    }

    search(table, event) {
        this.searchText = event.target.value;
        this.loadPatients(table);
    }

    exportExcel() {
        let params = {};
        if (this.searchText != '') {
            params['q'] = this.searchText;
        }

        params['page'] = 0;
        params['size'] = 20;
        params['export'] = 1;

        let queryParams = this.commonService.getHttpParamsByJson(params);

        this.patientService.getAll(queryParams).subscribe({
            next: (res: any) => {
                const doctors = res.data.map((item) => {
                    return {
                        opd_number: item.patient_number,
                        first_name: item.first_name,
                        last_name: item.last_name,
                        mobile: item.mobile,
                        email: item.email,
                        // created_at: item.created_at,
                    };
                });
                import('xlsx').then((xlsx) => {
                    const worksheet = xlsx.utils.json_to_sheet(doctors);
                    const workbook = {
                        Sheets: { data: worksheet },
                        SheetNames: ['data'],
                    };
                    const excelBuffer: any = xlsx.write(workbook, {
                        bookType: 'xlsx',
                        type: 'array',
                    });
                    this.saveAsExcelFile(excelBuffer, 'patients');
                });
            },
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
    }

    myUploader(event) {
        const file = event.files[0];
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        this.patientService.importExcel(formData).subscribe((res) => {
            console.log(res);
        });
    }

    openDialog(id: string) {
        this.ref = this.dialogService.open(UploadReportsComponent, {
            data: {
                id,
                fileNameInput: false,
                fileTypes: '.png,.jpg,.jpeg,.JPEG,.pdf',
                fileUploadUrl: 'patients/upload-files/' + id,
            },
            header: 'File Upload',
        });
    }
}
