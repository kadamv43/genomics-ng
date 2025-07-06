import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-invoices-list',
    templateUrl: './invoices-list.component.html',
    styleUrl: './invoices-list.component.scss',
    providers: [DatePipe],
})
export class InvoicesListComponent {
    invoices: any = [];
    loading = false;
    totalRecords = 0;
    searchText = '';

    constructor(
        private invoiceService: InvoicesService,
        private router: Router,
        private commonService: CommonService,
        private datePipe: DatePipe
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

        this.invoiceService.getAll(queryParams).subscribe((data: any) => {
            this.invoices = data.data;
            this.totalRecords = data.total;
            this.loading = false;
        });
    }

    goTo(url) {
        this.router.navigateByUrl(url);
    }

    exportExcel() {
        const invoices = this.invoices.map((item) => {
            return {
                invoice_number: item.invoice_number,
                apointment_number: item?.appointment?.appointment_number,
                patient_name:
                    item?.patient?.first_name + ' ' + item?.patient?.first_name,
                total: item.total_amount,
                paid: item.paid,
                discount: item.discount,
                balance: item.balance,
                received_by: item.received_by,
                date: this.datePipe.transform(item.created_at, 'yyyy-MM-dd'),
            };
        });
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(invoices);
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

    search(table, event) {
        this.searchText = event.target.value;
        this.loadPatients(table);
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
