import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductService } from 'src/app/demo/service/product.service';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrl: './invoice.component.scss',
})
export class InvoiceComponent implements OnInit {
    id;
    patient_id;
    appointmenData: any = [];
    paid = 0;
    total = 0;
    appointmentForm: FormGroup;
    selectedPaymentMode;

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
        private productService: ProductService
    ) {
        this.appointmentForm = fb.group({
            patientInfo: this.fb.group({
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
                email: ['', Validators.email],
                gender: ['', Validators.required],
                dob: [''],
                age: ['', Validators.pattern(/^\d{1,2}$/)],
                blood_group: [''],
            }),
            appointmentInfo: this.fb.group({
                services: ['', Validators.required],
                doctor: [''],
                appointment_date: [new Date(), Validators.required],
                appointment_time: [new Date(), Validators.required],
                reason: [''],
            }),
            medicalHistoryInfo: this.fb.group({
                allergies: [''],
            }),
        });
    }

    get balance() {
        return this.total - this.paid;
    }

    ngOnInit(): void {
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
                this.appointmenData.total = total;
                //this.balance =  total - this.paid
                console.log(this.appointmenData);
            });
        });

        // this.productService.getProducts().then((data) => {
        //     this.products = data;
        // });
    }

    downloadInvoice(){
        
    }
}
