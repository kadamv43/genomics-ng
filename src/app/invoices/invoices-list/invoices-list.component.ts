import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';

@Component({
    selector: 'app-invoices-list',
    templateUrl: './invoices-list.component.html',
    styleUrl: './invoices-list.component.scss',
})
export class InvoicesListComponent {
    invoices: any = [];
    loading = false;
    totalRecords = 0;

    constructor(
        private invoiceService: InvoicesService,
        private router: Router,
        private commonService: CommonService
    ) {}

    loadPatients(event: any) {
        this.loading = true;
        const page = event.first / event.rows;
        const size = event.rows;

        let params = this.commonService.getHttpParamsByJson({
            page: page.toString(),
            size: size.toString(),
        });

        this.invoiceService.getAll(params).subscribe((data: any) => {
            this.invoices = data.data;
            this.totalRecords = data.total;
            this.loading = false;
        });
    }

    goTo(url) {
        this.router.navigateByUrl(url);
    }
}
