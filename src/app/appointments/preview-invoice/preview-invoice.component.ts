import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as print from 'print-js';
import html2pdf from 'html2pdf.js';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { HttpService } from 'src/app/services/http.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-preview-invoice',
    providers:[MessageService],
    templateUrl: './preview-invoice.component.html',
    styleUrl: './preview-invoice.component.scss',
})
export class PreviewInvoiceComponent implements OnInit {
    id = '';
    invoiceDetails;

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

    download() {
        let element = document.getElementById('invoice');
        html2canvas(element, { scale: 3 }).then((canvas) => {
            const imgWidth = 208;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const heightLeft = imgHeight;

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            pdf.save('invoice.pdf');
        });
    }

    download2() {
        const element = document.getElementById('invoice'); // Replace with your element's ID

        // Define PDF options
        const options = {
            margin: 10,
            filename: 'invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                logging: true,
                dpi: 192,
                letterRendering: true,
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        // Generate PDF
        html2pdf().set(options).from(element).save();
    }

    back() {
        this.router.navigate([
            'appointments',
            'generate-invoice',
            this.invoiceDetails?.appointment,
        ]);
    }

    whatsapp() {
        const element = document.getElementById('invoice'); // Replace with your element's ID

        html2pdf()
            .from(element)
            .toPdf()
            .get('pdf')
            .then((pdfObj) => {
                const formData = new FormData();
                const pdfFile = new File([pdfObj], 'test.pdf', {
                    type: 'application/pdf',
                });

                formData.append('files', pdfFile);

                this.httpService
                    .postWithFormData('send-invoice-on-whatsapp', formData)
                    .subscribe({
                        next: (res) => {
                            this.toast.add({
                                key: 'tst',
                                severity: 'success',
                                summary: 'Success Message',
                                detail: 'Appointment created successfully',
                            });
                        },
                    });

                    this.toast.add({
                        key: 'tst',
                        severity: 'success',
                        summary: 'Success Message',
                        detail: 'Invoice Sent successfully',
                    });

                // You have access to the jsPDF object and can use it as desired.
                // console.log(pdfObj);
            });
    }

    printFile() {
        let element = document.getElementById('invoice');

        html2canvas(element, { scale: 3 })
            .then((canvas) => {
                const imgWidth = 208; // Width of A4 in mm
                const pageHeight = 295; // Height of A4 in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                const pdf = new jsPDF('p', 'mm', 'a4');

                // Add the captured canvas as an image to the PDF
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

                // Convert the PDF to a Blob
                const pdfBlob = pdf.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);

                // Use printJS to print the generated PDF
                print({
                    printable: pdfUrl,
                    type: 'pdf',
                    showModal: true,
                    onPrintDialogClose: () => {
                        URL.revokeObjectURL(pdfUrl); // Free memory after printing
                    },
                });
            })
            .catch((error) => {
                console.error('Error generating PDF:', error);
            });
    }
}
