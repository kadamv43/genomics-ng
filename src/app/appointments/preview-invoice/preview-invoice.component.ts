import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { HttpService } from 'src/app/services/http.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-preview-invoice',
    providers: [MessageService],
    templateUrl: './preview-invoice.component.html',
    styleUrl: './preview-invoice.component.scss',
})
export class PreviewInvoiceComponent implements OnInit {
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

    constructor(
        private invoiceService: InvoicesService,
        private route: ActivatedRoute,
        private router: Router,
        private httpService: HttpService,
        private toast: MessageService
    ) {}
    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.invoiceService.findById(this.id).subscribe((res) => {
                this.invoiceDetails = res;
            });
        });
    }

    // download() {
    //     let element = document.getElementById('invoice');
    //     html2canvas(element, { scale: 3 }).then((canvas) => {
    //         const imgWidth = 208;
    //         const pageHeight = 295;
    //         const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //         const heightLeft = imgHeight;

    //         const pdf = new jsPDF('p', 'mm', 'a4');
    //         const imgData = canvas.toDataURL('image/png');
    //         let position = 0;

    //         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //         pdf.save('invoice.pdf');
    //     });
    // }

    download() {
        const element = document.getElementById('invoice'); // Replace with your element's ID

        html2pdf()
            .set(this.pdfOptions)
            .from(element)
            .toPdf()
            .get('pdf')
            .then((pdfObj) => {
                let url = `invoice/${this.id}`;
                this.savePdfOnServer(url, pdfObj).subscribe({});
            })
            .save();
        // html2pdf().set(this.pdfOptions).from(element).save();
    }

    back() {
        this.router.navigate([
            'appointments',
            'generate-invoice',
            this.invoiceDetails?.appointment?._id,
        ]);
    }

    whatsapp() {
        const element = document.getElementById('invoice'); // Replace with your element's ID

        html2pdf()
            .set(this.pdfOptions)
            .from(element)
            .toPdf()
            .get('pdf')
            .then((pdfObj) => {
                let url = `invoice/${this.id}?send=whatsapp`;
                this.savePdfOnServer(url, pdfObj).subscribe({
                    next: (res: any) => {
                        this.toast.add({
                            key: 'tst',
                            severity: 'success',
                            summary: 'Success Message',
                            detail: 'Invoice Sent successfully',
                        });
                    },
                });
            });
    }

    savePdfOnServer(url, pdfObj) {
        const pdfBlob = pdfObj.output('blob'); // Get the PDF as a Blob

        const formData = new FormData();
        formData.append('file', pdfBlob, `${this.id}.pdf`);

        return this.httpService.patchWithFormData(url, formData);
    }

    async printFile() {
        let url = environment.baseUrl + 'web/invoice/' + this.id;
        console.log(url);
        try {
            const pdfPath = await (window as any).electron?.printUrl(url);
            console.log('PDF saved at:', pdfPath);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    }
}
