import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { ElectronService } from 'src/app/services/electron.service';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { send } from 'process';
import { it } from 'node:test';
import { AuthService } from 'src/app/services/auth.service';
import { ChequeDetailsComponent } from '../cheque-details/cheque-details.component';

@Component({
    selector: 'app-balance-invoice',
    templateUrl: './balance-invoice.component.html',
    styleUrl: './balance-invoice.component.scss',
    providers: [MessageService, DialogService],
})
export class BalanceInvoiceComponent {
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
    showPayment2 = false;
    btnDisabled = false;
    showChequeButton = false;
    oldDiscount = 0;

    paymentModes = [
        { name: 'Cash', code: 'Cash' },
        { name: 'Debit Card', code: 'Debit Card' },
        { name: 'Cheque', code: 'Cheque' },
        { name: 'Credit Card', code: 'Credit Card' },
        { name: 'UPI', code: 'UPI' },
    ];

    invoiceRes: any;

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
        private authService: AuthService,
        private dialogService: DialogService
    ) {
        this.invoiceForm = fb.group({
            payment_mode1: fb.group({
                mode: ['', Validators.required],
                price: [0, Validators.required],
            }),
            payment_mode2: fb.group({
                mode: [''],
                price: [0],
            }),
            discount: [0],
            partial_payment: [0],
        });

        this.extraForm = fb.group({
            extras: this.fb.array([]),
            prePostExtras: this.fb.array([]),
            services: this.fb.array([]),
        });

        this.otpForm = fb.group({
            otp: ['', Validators.required],
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
            // this.calculateInvoice();
            this.invoiceForm.get('payment_mode1').patchValue({
                price: value,
            });
            // this.invoiceForm.get('balance')?.setValue(this.invoiceData.balance);
        });

        this.invoiceForm
            .get('payment_mode1')
            .get('price')
            ?.valueChanges.subscribe((value) => {
                this.calculateInvoice();
                let pm2 = this.invoiceData.total - value;
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

                // this.invoiceForm
                //     .get('balance')
                //     ?.setValue(this.invoiceData.balance);
            });

        this.invoiceForm.get('discount')?.valueChanges.subscribe((value) => {
            this.calculateInvoice();
            // this.invoiceForm.get('balance')?.setValue(this.invoiceData.balance);
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

    get partial_payment() {
        return this.invoiceForm.get('partial_payment');
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
                    if (this.authService.getRole() != 'admin') {
                        this.btnDisabled = true;
                        this.invoiceForm.get('');
                    }

                    this.invoiceRes = res?.invoice;
                    this.invoiceData.total = res?.invoice?.total_amount;
                    this.invoiceData.balance = res?.invoice?.balance;
                    this.invoiceData.paid = res?.invoice?.paid;
                    this.oldDiscount = res?.invoice?.discount;
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
                        this.addService(element.name, element.price);
                        return {
                            name: element.name,
                            price: element.price,
                            type: 'service',
                        };
                    });

                    // this.invoiceForm?.get('partial_payment').patchValue(1);

                    if (res?.invoice?.cheque_details) {
                        localStorage.setItem(
                            'cheque',
                            JSON.stringify(res?.invoice?.cheque_details)
                        );
                        this.showChequeButton = true;
                    }
                    // this.invoiceData = res?.invoice;
                    this.invoiceData.items = services;
                    res.services = services;
                    this.appointmenData = res;
                    this.appointmenData.total = this.total;
                    this.extraForm.get('extras')?.disable();
                    this.extraForm.get('prePostExtras')?.disable();
                    this.extraForm.get('services')?.disable();
                } else {
                    let services = res?.services.map((element, i) => {
                        this.addService(element.name, element.price);
                        return {
                            name: element.name,
                            price: element.price,
                            type: 'service',
                        };
                    });
                    // this.invoiceData.items = services;
                    res.services = services;
                    this.appointmenData = res;
                }

                //this.balance =  total - this.paid
                // this.calculateInvoice();
                console.log(this.appointmenData);
            });
        });

        this.invoiceService.getPrePostCharges().subscribe((data) => {
            this.prePostCharges = data;
        });

        this.api.getProducts().subscribe((res: any) => {
            this.serviceList = res?.map((item) => {
                console.log('vk', item);
                return {
                    name: item?.name,
                    name_show: `${item?.name}  (Rs.${item?.price})`,
                    price: item?.price,
                };
            });
            console.log(this.serviceList);
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
        this.invoiceData.services.push({ name, price, type: 'service' });
    }

    createPrePostItem(name, price): FormGroup {
        return this.fb.group({
            name: [name, [Validators.required]],
            price: [price, [Validators.required, Validators.pattern(/^\d+$/)]],
        });
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

    calculateInvoice() {
        let total = this.invoiceData.balance;
        let discount = this.discount.value;
        let discountedTotal = 0;

        if (discount > 0) {
            discountedTotal = total - discount;
            total = discountedTotal;
            // this.setMaxValidation(discountedTotal);
        }

        // this.invoiceData.balance = balance;
        // this.invoiceData.paid = paid;
        this.invoiceData.discount = discount;
        this.invoiceData.total = total;
        // this.invoiceData.balance = balance;
        this.invoiceData.discountedTotal = discountedTotal;
        // this.invoiceForm.get('balance')?.setValue(balance);
    }

    greaterThanZeroValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            return value > 0 ? null : { greaterThanZero: true };
        };
    }

    onChangePaymentMode(e) {
        if (e.value == 'Cheque') {
            this.showChequeButton = true;
            this.openChequeDialog();
        } else {
            this.showChequeButton = false;
        }
    }

    openChequeDialog() {
        this.ref = this.dialogService.open(ChequeDetailsComponent, {
            data: {
                fileNameInput: false,
                fileTypes: '.png,.jpg,.jpeg,.JPEG,.pdf',
                fileUploadUrl: 'appointments/upload-files/' + '',
            },
            header: 'Enter Cheque Details',
        });

        this.ref.onClose.subscribe(() => {
            let cheque = localStorage.getItem('cheque');
            if (cheque) {
                this.showChequeButton = true;
            }
        });
    }
    saveAndPreview() {
        console.log(this.invoiceForm);

        this.extraForm.markAllAsTouched();
        this.invoiceForm.markAllAsTouched();

        if (this.invoiceForm.valid) {
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
            old_invoice: this.appointmenData?.invoice,
            patient: this.appointmenData?.patient?._id,
            doctor: this.appointmenData?.doctor?._id,
            total_amount: this.invoiceData.balance,
            paid: this.invoiceData.total,
            balance: 0,
            discount: this.discount.value,
            payment_mode1: this.payment_mode1.value,
            payment_mode2: this.payment_mode2.value,
            partial_payment: this.partial_payment.value,
            particulars: [],
        };

        if (
            this.payment_mode1.value == 'Cheque' ||
            this.payment_mode2.value == 'Cheque'
        ) {
            invoiceDatum['cheque_details'] = JSON.parse(
                localStorage.getItem('cheque')
            );
        }

        if (this.appointmenData?.balance_invoice) {
            this.invoiceService
                .update(this.appointmenData?.invoice._id, invoiceDatum)
                .subscribe((res: any) => {
                    localStorage.removeItem('cheque');
                    this.router.navigate([
                        'appointments',
                        'preview-invoice',
                        res?._id,
                    ]);
                });
        } else {
            this.invoiceService
                .createBalance(invoiceDatum)
                .subscribe((res: any) => {
                    localStorage.removeItem('cheque');
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

    onPartialPaymentChecked(event) {
        this.showPayment2 = event?.target?.checked;
    }
}
