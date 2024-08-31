import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductService } from 'src/app/demo/service/product.service';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { dialog, app } from '@electron/remote'; // Correct import
import * as fs from 'fs';
import * as path from 'path';
import { Buffer } from 'buffer'; // Import Buffer
import { ElectronService } from 'src/app/services/electron.service';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrl: './invoice.component.scss',
})
export class InvoiceComponent implements OnInit {
    id;
    patient_id;
    appointmenData: any = [];
    total = 0;
    invoiceForm: FormGroup;
    new_total = 0;
    role = '';

    paymentModes = [
        { name: 'Cash', code: 'Cash' },
        { name: 'Debit Card', code: 'Debit Card' },
        { name: 'Credit Card', code: 'Credit Card' },
        { name: 'UPI', code: 'UPI' },
    ];

    products = [
        {
            id: '1',
            name: 'Endoscopy',
            price: 4000,
        },
        {
            id: '2',
            name: 'Ultrasonography',
            price: 4000,
        },
    ];
    constructor(
        private route: ActivatedRoute,
        private appointmentService: AppointmentService,
        private fb: FormBuilder,
        private http: HttpClient,
        private electonService: ElectronService,
        private invoiceService: InvoicesService
    ) {
        this.invoiceForm = fb.group({
            paid: [0],
            balance: [0, Validators.required],
            received_by: ['', Validators.required],
            payment_mode: ['', Validators.required],
            discount: [0],
            extras: this.fb.array([this.createItem()]),
        });
        this.onChanges();
    }

    setMaxValidation(maxValue: number): void {
        this.invoiceForm
            .get('paid')
            ?.setValidators([
                Validators.required,
                Validators.pattern(/^\d+$/),
                Validators.max(maxValue),
            ]);
        this.invoiceForm.get('paid')?.updateValueAndValidity(); // Update the validation
    }
    onChanges(): void {
        this.invoiceForm.get('paid')?.valueChanges.subscribe((value) => {
            if (value && value > 0) {
                this.invoiceForm
                    .get('balance')
                    ?.setValue(this.new_total - Number(value));
            } else {
                this.invoiceForm.get('balance')?.setValue(0);
            }
        });

        this.invoiceForm.get('discount')?.valueChanges.subscribe((value) => {
            if (value && value > 0) {
                this.new_total = this.total - value;
            } else {
                this.new_total = this.total;
            }
            this.invoiceForm.get('balance')?.setValue(this.new_total);
        });
    }

    get balance() {
        return this.invoiceForm.get('balance');
    }

    get paid() {
        return this.invoiceForm.get('paid');
    }

    get payment_mode() {
        return this.invoiceForm.get('payment_mode');
    }

    get received_by() {
        return this.invoiceForm.get('received_by');
    }

    get discount() {
        return this.invoiceForm.get('discount');
    }

    get extras(): FormArray {
        return this.invoiceForm.get('extras') as FormArray;
    }

    ngOnInit(): void {
        this.role = localStorage.getItem('role') ?? '';

        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.appointmentService.findById(this.id).subscribe((res: any) => {
                let total = 0;
                let services = res?.services.map((element, i) => {
                    total = total + Number(element.price);
                    return { key: i + 1, ...element };
                });

                res.services = services;
                this.appointmenData = res;
                this.total = total;
                this.new_total = total;
                this.appointmenData.total = total;
                this.setMaxValidation(total);
                //this.balance =  total - this.paid
                console.log(this.appointmenData);
            });
        });

        // this.productService.getProducts().then((data) => {
        //     this.products = data;
        // });
    }

    addItem(): void {
        this.extras.push(this.createItem());
    }

    createItem(): FormGroup {
        return this.fb.group({
            name: [''],
            price: [''],
        });
    }

    removeItem(index: number): void {
        if (this.extras.length > 1) {
            this.extras.removeAt(index);
        }
    }

    downloadInvoice() {
        this.invoiceForm.markAllAsTouched();
        if (this.invoiceForm.valid) {
            let invoiceData = {
                appointment: this.appointmenData?._id,
                patient: this.appointmenData?.patient?._id,
                doctor: this.appointmenData?.doctor?._id,
                total_amount: this.appointmenData?.total,
                paid: this.paid.value,
                balance: this.balance.value,
                discount: this.discount.value,
                payment_mode: this.payment_mode.value,
                received_by: this.received_by.value,
                particulars: {},
            };

            invoiceData.particulars = this.appointmenData.services.map(
                (item) => {
                    return { name: item.name, price: item.price };
                }
            );

            this.invoiceService.create(invoiceData).subscribe((res) => {
                const url = `appointments/invoice-pdf/${this.id}`;
                let date = new DatePipe('en-US').transform(
                    Date(),
                    'dd-MM-YYYY'
                );

                let data = {
                    ...this.invoiceForm.value,
                    ...this.appointmenData,
                    date,
                };

                this.http
                    .post(environment.baseUrl + url, data, {
                        responseType: 'blob',
                    })
                    .subscribe(async (response: Blob) => {
                        // this.electonService.downloadPdf(response);
                        const blob = new Blob([response], {
                            type: 'application/pdf',
                        });
                        saveAs(blob, 'invoice.pdf');
                    });
            });
        }
    }
}
