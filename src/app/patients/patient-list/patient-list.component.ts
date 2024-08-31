import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common/common.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-patient-list',
    templateUrl: './patient-list.component.html',
    styleUrl: './patient-list.component.scss',
    providers: [MessageService],
})
export class PatientListComponent {
    patients: any = [];
    loading = false;
    totalRecords = 0;
    searchText = '';
    showImportDialog = false;

    constructor(
        private patientService: PatientService,
        private router: Router,
        private commonService: CommonService
    ) {}

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
        const doctors = this.patients.map((item) => {
            return {
                first_name: item.first_name,
                last_name: item.last_name,
                email: item.email,
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

    myUploader(event){
        const file = event.files[0];
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        this.patientService.importExcel(formData).subscribe((res)=>{
            console.log(res)
        })
    }
}
