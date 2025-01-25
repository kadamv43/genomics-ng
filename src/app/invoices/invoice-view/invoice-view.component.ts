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
    providers: [SafeUrlPipe],
    styleUrl: './invoice-view.component.scss',
})
export class InvoiceViewComponent {
    private ipcRenderer = (window as any).electron?.ipcRenderer;

    id = '';
    invoiceDetails;

    logoUrl = '';

    uploadPath = environment.uploadPath;

    pdfOptions = {
        margin: 10,
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },

        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: true,
            dpi: 192,
            letterRendering: true,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    pageUrl = '';
    // 'http://localhost:3000/web/invoice/6791800909d05c7a3a7b30a6';

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
                console.log(data.message);
                if (data.pdfBlob) {
                    console.log('PDF Blob:', data.pdfBlob);
                    let url = `invoice/${this.id}?send=whatsapp`;
                    this.savePdfOnServer(url, data.pdfObj).subscribe({
                        next: (res: any) => {
                            this.toast.add({
                                key: 'tst',
                                severity: 'success',
                                summary: 'Success Message',
                                detail: 'Invoice Sent successfully',
                            });
                        },
                    });
                }
                if (data.filePath) {
                    console.log('Saved PDF Path:', data.filePath);
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
        this.electronService.getInvoicePdf(this.pageUrl);
        // const element = document.getElementById('invoice'); // Replace with your element's ID

        // html2pdf()
        //     .set(this.pdfOptions)
        //     .from(element)
        //     .toPdf()
        //     .get('pdf')
        //     .then((pdfObj) => {
        //         let url = `invoice/${this.id}?send=whatsapp`;
        //         this.savePdfOnServer(url, pdfObj).subscribe({
        //             next: (res: any) => {
        //                 this.toast.add({
        //                     key: 'tst',
        //                     severity: 'success',
        //                     summary: 'Success Message',
        //                     detail: 'Invoice Sent successfully',
        //                 });
        //             },
        //         });
        //     });
    }

    base64ToBlob(base64: string, mimeType: string): Blob {
        const byteCharacters = atob(base64); // Decode base64 string to byte characters
        const byteArrays = [];

        // Create a byte array from the base64 string
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: mimeType });
    }

    savePdfOnServer(url, pdfObj) {
        const pdfBlob = this.base64ToBlob(pdfObj, 'application/pdf');

        const formData = new FormData();
        formData.append('file', pdfBlob, `${this.id}.pdf`);

        return this.httpService.patchWithFormData(url, formData);
    }

    async printFile() {
        this.electronService.printInvoice(this.pageUrl);
    }
}
