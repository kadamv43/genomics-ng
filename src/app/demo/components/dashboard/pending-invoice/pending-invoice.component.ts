import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dA } from '@fullcalendar/core/internal-common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-pending-invoice',
    templateUrl: './pending-invoice.component.html',
    styleUrl: './pending-invoice.component.scss',
})
export class PendingInvoiceComponent implements OnInit {
    invoices = [];
    totalRecords = 0;
    constructor(
        public ref: DynamicDialogRef,
        public router: Router,
        public config: DynamicDialogConfig
    ) {
        this.invoices = config.data?.data;
        this.totalRecords = config.data?.length;
    }

    ngOnInit(): void {
        console.log(this.invoices);
    }

    goTo(product: any) {
        this.ref.close();
        this.router.navigate([
            'appointments',
            'balance-invoice',
            product?.appointment?._id,
        ]);
    }
}
