import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';

@Component({
    selector: 'app-preview-invoice',
    templateUrl: './preview-invoice.component.html',
    styleUrl: './preview-invoice.component.scss',
})
export class PreviewInvoiceComponent implements OnInit {
    id = '';
    invoiceDetails;

    constructor(
        private invoiceService: InvoicesService,
        private route: ActivatedRoute,
        private router:Router
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.invoiceService.findById(this.id).subscribe((res) => {
                this.invoiceDetails = res;
            });
        });
    }

    print() {
        let element = document.getElementById('invoice');
        html2canvas(element).then((canvas) => {
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

    back(){
      this.router.navigate(['appointments', 'generate-invoice',this.invoiceDetails?.appointment]);
    }
}
