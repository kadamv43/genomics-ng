import { Component, Input, OnInit } from '@angular/core';
import { dA } from '@fullcalendar/core/internal-common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-pending-invoice',
    templateUrl: './pending-invoice.component.html',
    styleUrl: './pending-invoice.component.scss',
})
export class PendingInvoiceComponent implements OnInit {
    invoices = [];
    totalRecords = 0;
    constructor(public config: DynamicDialogConfig) {
        this.invoices = config.data?.data;
        this.totalRecords = config.data?.length
    }

    ngOnInit(): void {
        console.log(this.invoices);
    }
}
