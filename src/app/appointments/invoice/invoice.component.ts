import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { ElectronService } from 'src/app/services/electron.service';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { send } from 'process';
import { it } from 'node:test';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    providers: [MessageService, DialogService],
    styleUrl: './invoice.component.scss',
})
export class InvoiceComponent implements OnInit {
    visible: boolean = false;

    ref: DynamicDialogRef | undefined;
    message = '';
    id;
    patient_id;
    appointmenData: any = [];
    total = 0;
    invoiceForm: FormGroup;
    otpForm: FormGroup;
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
        services: [],
    };

    queryParams = {};
    config: any = {};
    otpVisible = false;
    prePostCharges: any = [];
    serviceList: any = [];

    constructor(
        private route: ActivatedRoute,
        private appointmentService: AppointmentService,
        private fb: FormBuilder,
        private router: Router,
        private invoiceService: InvoicesService,
        private toast: MessageService,
        private api: ApiService,
        private dialogService: DialogService
    ) {
        this.invoiceForm = fb.group({
            paid: [0],
            balance: [0, Validators.required],
            payment_mode1: fb.group({
                mode: ['', Validators.required],
                price: [0, Validators.required],
            }),
            payment_mode2: fb.group({
                mode: [''],
                price: [0],
            }),
            discount: [0],
        });

        this.extraForm = fb.group({
            extras: this.fb.array([]),
            prePostExtras: this.fb.array([]),
            services: this.fb.array([]),
        });

        this.otpForm = fb.group({
            otp: ['', Validators.required],
        });

        this.api.getProducts().subscribe((res) => {
            this.serviceList = res;
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
            this.invoiceForm.get('payment_mode1').patchValue({
                price: value,
            });
            this.invoiceForm.get('balance')?.setValue(this.invoiceData.balance);
        });

        this.invoiceForm
            .get('payment_mode1')
            .get('price')
            ?.valueChanges.subscribe((value) => {
                this.calculateInvoice();
                let pm2 = this.paid.value - value;
                this.invoiceForm.get('payment_mode2').patchValue({
                    price: pm2 >= 0 ? pm2 : 0,
                });

                if (pm2 > 0) {
                    this.invoiceForm
                        .get('payment_mode2')
                        .get('mode')
                        ?.setValidators([Validators.required]);

                    this.invoiceForm
                        .get('payment_mode2')
                        .get('mode')
                        ?.updateValueAndValidity();
                } else {
                    this.invoiceForm
                        .get('payment_mode2')
                        .get('mode')
                        ?.removeValidators(Validators.required);
                    this.invoiceForm
                        .get('payment_mode2')
                        .get('mode')
                        ?.updateValueAndValidity();
                }

                this.invoiceForm
                    .get('balance')
                    ?.setValue(this.invoiceData.balance);
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

    get payment_mode1() {
        return this.invoiceForm.get('payment_mode1');
    }

    get payment_mode2() {
        return this.invoiceForm.get('payment_mode2');
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

    get services(): FormArray {
        return this.extraForm.get('services') as FormArray;
    }

    ngOnInit(): void {
        this.role = localStorage.getItem('role') ?? '';

        this.queryParams = this.route.snapshot.queryParams;

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
                    this.invoiceForm
                        ?.get('balance')
                        .setValue(res?.invoice?.balance ?? 0);

                    // this.invoiceForm
                    //     ?.get('payment_mode')
                    //     .setValue(res?.invoice?.payment_mode ?? '');

                    res?.invoice?.particulars.forEach((item) => {
                        if (item.type == 'extra') {
                            this.addItem(item.name, item.price);
                        } else if (item.type == 'prepost') {
                            this.addPrePostItem(item.name, item.price);
                        } else if (item.type == 'service') {
                            this.addService(item.name, item.price);
                        }
                    });

                    let services = res?.services.map((element, i) => {
                        return {
                            name: element.name,
                            price: element.price,
                            type: 'service',
                        };
                    });

                    // this.invoiceData = res?.invoice;
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

        this.api.getProducts().subscribe((res) => {
            this.serviceList = res;
        });

        this.config = JSON.parse(localStorage.getItem('config') as string);
    }

    addPrePostItem(name = '', price = ''): void {
        const control = this.createItem(name, price);
        this.prePostExtras.push(control);
        this.invoiceData.prepost.push({ name, price, type: 'prepost' });
    }

    addService(name = '', price = ''): void {
        const control = this.createItem(name, price);
        this.services.push(control);
        this.invoiceData.services.push({ name, price, type: 'services' });
    }

    removeExtraServiceItem(index: number): void {
        this.services.removeAt(index);
        this.invoiceData.services.splice(index, 1);
        this.calculateInvoice();
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
        console.log(i);
        this.invoiceData.prepost[i] = {
            type: 'prepost',
            ...this.prePostExtras.at(i).value,
        };
        this.calculateInvoice();
    }

    onExtraServicesChange(i) {
        let value = this.serviceList.find((item) => {
            return item.name === this.services.at(i).value.name;
        });

        this.services.at(i).patchValue({
            price: value.price,
        });
        this.invoiceData.services[i] = {
            type: 'service',
            ...this.services.at(i).value,
        };
        this.calculateInvoice();
    }

    onExtraServicesValueChange(i) {
        let value = this.services.controls.at(i).value.price;

        this.services.controls.at(i).patchValue({
            price: value,
        });
        this.invoiceData.services[i] = {
            type: 'service',
            ...this.services.at(i).value,
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

        let extraServicesSum = this.invoiceData.services.reduce(
            (sum, item) => (sum = sum + Number(item.price)),
            0
        );

        let total = itemSum + extrasum + prePostSum + extraServicesSum;
        let discount = this.discount.value;
        let discountedTotal = 0;
        let paid = this.paid.value;

        let balance = 0;

        if (discount > 0) {
            discountedTotal = total - discount;
            balance = discountedTotal - paid;
            // this.setMaxValidation(discountedTotal);
        } else {
            balance = total - paid;
            // this.setMaxValidation(total);
        }

        this.invoiceData.balance = balance;
        this.invoiceData.paid = paid;
        this.invoiceData.discount = discount;
        this.invoiceData.total = total;
        this.invoiceData.balance = balance;
        this.invoiceData.discountedTotal = discountedTotal;
    }

    saveAndPreview() {
        console.log(this.invoiceData);
        this.extraForm.markAllAsTouched();
        this.invoiceForm.markAllAsTouched();

        if (this.invoiceForm.valid && this.extraForm.valid) {
            if (
                this.role == 'staff' &&
                this.discount.value > this.config[0]?.discount_limit
            ) {
                this.message =
                    'Discount limit is ' + this.config[0]?.discount_limit;
                this.visible = true;

                return;
            }

            if (this.config[0]?.invoice_generate_otp) {
                this.sendOTP().subscribe({
                    next: () => {
                        this.openOtpDialog();
                    },
                });
            } else {
                this.saveInvoice();
            }
        }
    }

    saveInvoice() {
        let invoiceDatum = {
            appointment: this.appointmenData?._id,
            patient: this.appointmenData?.patient?._id,
            doctor: this.appointmenData?.doctor?._id,
            total_amount: this.invoiceData.total,
            paid: this.paid.value,
            balance: this.balance.value,
            discount: this.discount.value,
            payment_mode1: this.payment_mode1.value,
            payment_mode2: this.payment_mode2.value,
            particulars: [],
        };

        invoiceDatum.particulars = [
            ...this.invoiceData.items,
            ...this.invoiceData.extras,
            ...this.invoiceData.prepost,
            ...this.invoiceData.services,
        ];

        if (this.appointmenData?.invoice) {
            this.invoiceService
                .update(this.appointmenData?.invoice._id, invoiceDatum)
                .subscribe((res: any) => {
                    this.router.navigate([
                        'appointments',
                        'preview-invoice',
                        res?._id,
                    ]);
                });
        } else {
            this.invoiceService.create(invoiceDatum).subscribe((res: any) => {
                this.router.navigate([
                    'appointments',
                    'preview-invoice',
                    res?._id,
                ]);
            });
        }
    }

    openOtpDialog() {
        this.otpVisible = true;
    }

    sendOTP() {
        const mobile = localStorage.getItem('mobile');
        return this.api.sendOTP({ mobile });
    }

    get otp() {
        return this.otpForm.get('otp');
    }

    verifyOTP() {
        if (this.otpForm.valid) {
            const mobile = localStorage.getItem('mobile');
            this.api
                .verifyOTp({ mobile: mobile, otp: this.otp.value })
                .subscribe({
                    next: (res) => {
                        this.otpForm.reset();
                        this.otpVisible = false;
                        this.saveInvoice();
                    },
                    error: (err) => {
                        this.message = err.error.message;
                        this.visible = true;
                    },
                });
        }
    }
}
