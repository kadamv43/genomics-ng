import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { ElectronService } from 'src/app/services/electron.service';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { MessageService } from 'primeng/api';
import { it } from 'node:test';
import { ba } from '@fullcalendar/core/internal-common';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    providers: [MessageService],
    styleUrl: './invoice.component.scss',
})
export class InvoiceComponent implements OnInit {
    id;
    patient_id;
    appointmenData: any = [];
    total = 0;
    invoiceForm: FormGroup;
    extraForm: FormGroup;
    new_total = 0;
    role = '';
    serviceTotal = 0;
    extraSum = 0;
    paymentModes = [
        { name: 'Cash', code: 'Cash' },
        { name: 'Debit Card', code: 'Debit Card' },
        { name: 'Credit Card', code: 'Credit Card' },
        { name: 'UPI', code: 'UPI' },
    ];

    invoiceData = {
        total: 0,
        discountedTotal: 0,
        paid: 0,
        balance: 0,
        discount: 0,
        items: [],
        prepost: [],
        extras: [],
    };

    prePostCharges: any = [];

    constructor(
        private route: ActivatedRoute,
        private appointmentService: AppointmentService,
        private fb: FormBuilder,
        private http: HttpClient,
        private electonService: ElectronService,
        private toast: MessageService,
        private router: Router,
        private invoiceService: InvoicesService
    ) {
        this.invoiceForm = fb.group({
            paid: [0],
            balance: [0, Validators.required],
            payment_mode: ['', Validators.required],
            discount: [0],
        });

        this.extraForm = fb.group({
            extras: this.fb.array([]),
            prePostExtras: this.fb.array([]),
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
            this.calculateInvoice();
            this.invoiceForm.get('balance')?.setValue(this.invoiceData.balance);
        });

        this.invoiceForm.get('discount')?.valueChanges.subscribe((value) => {
            this.calculateInvoice();
            this.invoiceForm.get('balance')?.setValue(this.invoiceData.balance);
        });
    }

    get balance() {
        return this.invoiceForm.get('balance');
    }

    get totalma() {
        console.log(this.extras.value);
        return this.extras.value;
    }
    get paid() {
        return this.invoiceForm.get('paid');
    }

    get payment_mode() {
        return this.invoiceForm.get('payment_mode');
    }

    get discount() {
        return this.invoiceForm.get('discount');
    }

    get extras(): FormArray {
        return this.extraForm.get('extras') as FormArray;
    }

    get prePostExtras(): FormArray {
        return this.extraForm.get('prePostExtras') as FormArray;
    }

    ngOnInit(): void {
        this.role = localStorage.getItem('role') ?? '';

        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.appointmentService.findById(this.id).subscribe((res: any) => {
                if (res?.invoice) {
                    this.invoiceForm
                        ?.get('discount')
                        .setValue(res?.invoice?.discount ?? 0);
                    this.invoiceForm
                        ?.get('paid')
                        .setValue(res?.invoice?.paid ?? 0);
                    // this.invoiceForm
                    //     ?.get('balance')
                    //     .setValue(res?.invoice?.balance ?? 0);

                    this.invoiceForm
                        ?.get('payment_mode')
                        .setValue(res?.invoice?.payment_mode ?? '');

                    res?.invoice?.particulars.forEach((item) => {
                        if (item.type == 'extra') {
                            this.addItem(item.name, item.price);
                        } else if (item.type == 'prepost') {
                            this.addPrePostItem(item.name, item.price);
                        }
                    });

                    let services = res?.services.map((element, i) => {
                        return { name: element.name, price: element.price,type:'service'};
                    });

                    this.invoiceData.items = services;
                    res.services = services;
                    this.appointmenData = res;
                    this.appointmenData.total = this.total;
                } else {
                    let services = res?.services.map((element, i) => {
                        return {
                            name: element.name,
                            price: element.price,
                            type: 'service',
                        };
                    });
                    this.invoiceData.items = services;
                    res.services = services;
                    this.appointmenData = res;
                }

                //this.balance =  total - this.paid
                this.calculateInvoice();
                console.log(this.appointmenData);
            });
        });

        this.invoiceService.getPrePostCharges().subscribe((data) => {
            this.prePostCharges = data;
        });

        console.log(this.invoiceData);
    }

    addPrePostItem(name = '', price = 0): void {
        const control = this.createItem(name, price);
        this.prePostExtras.push(control);
        this.invoiceData.prepost.push({ name, price, type: 'prepost' });
    }

    createPrePostItem(name, price): FormGroup {
        return this.fb.group({
            name: [name, [Validators.required]],
            price: [price, [Validators.required, Validators.pattern(/^\d+$/)]],
        });
    }

    removePrePostItem(index: number): void {
        this.prePostExtras.removeAt(index);
        this.invoiceData.prepost.splice(index, 1);
        this.calculateInvoice();
    }

    addItem(name = '', price = 0): void {
        const control = this.createItem(name, price);
        this.extras.push(control);
        this.invoiceData.extras.push({ name, price, type: 'extra' });
    }

    createItem(name, price): FormGroup {
        return this.fb.group({
            name: [name, [Validators.required]],
            price: [price, [Validators.required, Validators.pattern(/^\d+$/)]],
        });
    }

    removeItem(index: number): void {
        this.extras.removeAt(index);
        this.invoiceData.extras.splice(index, 1);
        this.calculateInvoice();
    }

    getUniqueElements(arr1, arr2) {
        const uniqueArr1 = arr1.filter((item) => !arr2.includes(item));
        const uniqueArr2 = arr2.filter((item) => !arr1.includes(item));
        return [...uniqueArr1, ...uniqueArr2];
    }

    addExtra() {
        let length = this.appointmenData.services.length;
        console.log(this.appointmenData.services);
        this.appointmenData.services.push({
            key: length + 1,
            name: '',
            price: '',
        });
    }

    onExtraValueChange(i) {
        this.invoiceData.extras[i] = {
            type: 'extra',
            ...this.extras.at(i).value,
        };
        this.calculateInvoice();
    }

    onPrePostValueChange(i) {
        this.invoiceData.prepost[i] = {
            type: 'prepost',
            ...this.prePostExtras.at(i).value,
        };
        this.calculateInvoice();
    }

    calculateInvoice() {
        let itemSum = this.invoiceData.items.reduce(
            (sum, item) => (sum = sum + Number(item.price)),
            0
        );
        let extrasum = this.invoiceData.extras.reduce(
            (sum, item) => (sum = sum + Number(item.price)),
            0
        );
        let prePostSum = this.invoiceData.prepost.reduce(
            (sum, item) => (sum = sum + Number(item.price)),
            0
        );

        let total = itemSum + extrasum + prePostSum;
        let discount = this.discount.value;
        let discountedTotal = 0;
        let paid = this.paid.value;

        let balance = 0;

        if (discount > 0) {
            discountedTotal = total - discount;
            balance = discountedTotal - paid;
            this.setMaxValidation(discountedTotal);
        } else {
            balance = total - paid;
            this.setMaxValidation(total);
        }

        this.invoiceData.balance = balance;
        this.invoiceData.paid = paid;
        this.invoiceData.discount = discount;
        this.invoiceData.total = total;
        this.invoiceData.balance = balance;
        this.invoiceData.discountedTotal = discountedTotal;
    }

    saveAndPreview() {
        this.extraForm.markAllAsTouched();
        this.invoiceForm.markAllAsTouched();

        if (this.invoiceForm.valid) {
            let invoiceDatum = {
                appointment: this.appointmenData?._id,
                patient: this.appointmenData?.patient?._id,
                doctor: this.appointmenData?.doctor?._id,
                total_amount: this.invoiceData.total,
                paid: this.paid.value,
                balance: this.balance.value,
                discount: this.discount.value,
                payment_mode: this.payment_mode.value,
                particulars: [],
            };

            invoiceDatum.particulars = [
                ...this.invoiceData.items,
                ...this.invoiceData.extras,
                ...this.invoiceData.prepost,
            ];

            this.invoiceService.create(invoiceDatum).subscribe((res: any) => {
                this.router.navigate([
                    'appointments',
                    'preview-invoice',
                    res?._id,
                ]);
            });
        }
    }
}
