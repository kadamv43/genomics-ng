import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { DoctorsService } from 'src/app/services/doctors/doctors.service';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-doctor-list',
    templateUrl: './doctor-list.component.html',
    styleUrl: './doctor-list.component.scss',
})
export class DoctorListComponent {
    doctors: any = [];
    loading = false;
    totalRecords = 0;
    searchText = '';
    exportColumns: any[];

    constructor(
        private doctorService: DoctorsService,
        private router: Router,
        private commonService: CommonService
    ) {}

    loadDoctors(event: any) {
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

        this.doctorService.getAll(queryParams).subscribe((data: any) => {
            this.doctors = data.data;
            this.totalRecords = data.total;
            this.loading = false;
        });
    }

    goTo(url) {
        this.router.navigateByUrl(url);
    }

    search(table, event) {
        this.searchText = event.target.value;
        this.loadDoctors(table);
    }

    exportExcel() {
        const doctors = this.doctors.map((item) => {
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
            this.saveAsExcelFile(excelBuffer, 'doctors');
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
}
