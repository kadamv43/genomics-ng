import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PendingInvoiceComponent } from './pending-invoice/pending-invoice.component';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [DialogService],
})
export class DashboardComponent implements OnInit {
    items!: MenuItem[];

    chartData: any;

    pendingInvoiceCount = 0;
    pendingInvoices = [];
    ref: DynamicDialogRef | undefined;
    chartOptions: any;
    role = '';
    subscription!: Subscription;

    constructor(
        public layoutService: LayoutService,
        private invoiceService: InvoicesService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.role = localStorage.getItem('role');
        this.invoiceService.getPendingInvoices().subscribe({
            next: (res: any) => {
                this.pendingInvoiceCount = res?.length;
                this.pendingInvoices = res;
                console.log(res);
            },
        });
    }

    openModal() {
        this.ref = this.dialogService.open(PendingInvoiceComponent, {
            header: 'Pending Balance',
            width: '70%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: {
                data: this.pendingInvoices,
            },
        });
    }
}
