import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { HttpService } from 'src/app/services/http.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { ElectronService } from 'src/app/services/electron.service';
import { SafeUrlPipe } from 'src/app/safe-url.pipe';

@Component({
    selector: 'app-invoice-view',
    templateUrl: './invoice-view.component.html',
    providers: [SafeUrlPipe, MessageService],
    styleUrl: './invoice-view.component.scss',
})
export class InvoiceViewComponent {
    private ipcRenderer = (window as any).electron?.ipcRenderer;

    loading = false;
    id = '';
    invoiceDetails;

    pageUrl = '';

    constructor(
        private invoiceService: InvoicesService,
        private route: ActivatedRoute,
        private router: Router,
        private httpService: HttpService,
        private toast: MessageService,
        private electronService: ElectronService
    ) {}
    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.pageUrl = environment.baseUrl + 'web/invoice/' + this.id;
            this.invoiceService.findById(this.id).subscribe((res) => {
                this.invoiceDetails = res;
            });
        });

        if (this.ipcRenderer) {
            this.ipcRenderer.on('operation-done', (event, data) => {
                console.log('vinayak');
                if (data.pdfBlob) {
                    this.sendFileToWhatsapp(data);
                }
            });
        }
    }

    download() {
        this.electronService.downloadInvoice(this.pageUrl);
    }

    back() {
        this.router.navigate([
            'appointments',
            'generate-invoice',
            this.invoiceDetails?.appointment,
        ]);
    }

    whatsapp() {
        this.loading = true;
        setTimeout(() => {
            this.electronService.getInvoicePdf(this.pageUrl);
            this.loading = false;
        }, 2000);
    }

    async printFile() {
        this.electronService.printInvoice(this.pageUrl);
    }

    sendFileToWhatsapp(data) {
        const pdfBlob = data.pdfBlob; // Base64 PDF data
        const binary = atob(pdfBlob); // Decode base64

        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }

        // Create a Blob from the binary data
        const blob = new Blob([array], {
            type: 'application/pdf',
        });
        // Upload the file using base64 data or file path
        const formData = new FormData();
        formData.append('file', blob, 'invoice_' + this.id + '.pdf');

        let url = `invoice/${this.id}?send=whatsapp`;

        return this.httpService.patchWithFormData(url, formData).subscribe({
            next: (res: any) => {
                this.loading = false;
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Invoice Sent successfully',
                });
            },
            error: () => {
                this.loading = false;
            },
        });
    }
}
