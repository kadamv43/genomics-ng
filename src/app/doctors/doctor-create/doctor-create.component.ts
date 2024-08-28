import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DoctorsService } from 'src/app/services/doctors/doctors.service';
import { PatientService } from 'src/app/services/patient/patient.service';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'app-doctor-create',
    templateUrl: './doctor-create.component.html',
    styleUrl: './doctor-create.component.scss',
    providers: [MessageService],
})
export class DoctorCreateComponent {
    doctorForm: FormGroup;
    selectedState: any = null;
    minDate;
    serviceList: any = [];
    selectedSevices!: City[];
    doctors: any = [];
    filteredItems: any = [];
    selectedPatient;
    selectedServicesObjects = [];

    cities = [
        { name: 'Mumbai', code: 'Mumbai' },
        { name: 'Navi Mumbai', code: 'Navi Mumbai' },
        { name: 'Pune', code: 'Pune' },
    ];

    states = [{ name: 'Maharashta', code: 'Maharashta' }];

    genders = [
        { name: 'Male', code: 'Male' },
        { name: 'Female', code: 'Female' },
    ];

    bloodGroups = [
        { name: 'A+', code: 'A+' },
        { name: 'O+', code: 'O+' },
        { name: 'B+', code: 'B+' },
        { name: 'AB+', code: 'AB+' },
        { name: 'A-', code: 'A-' },
        { name: 'O-', code: 'O-' },
        { name: 'B-', code: 'B-' },
        { name: 'AB-', code: 'AB-' },
    ];

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private doctorService: DoctorsService,
        private commonServie: CommonService,
        private appointmentService: AppointmentService,
        private toast: MessageService,
        private router: Router
    ) {
        this.doctorForm = fb.group({
            doctorInfo: this.fb.group({
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
                mobile: ['', [Validators.required, this.mobileNumberValidator]],
                email: ['', [Validators.required,Validators.email]],
                gender: ['', Validators.required],
                dob: [''],
                specialization: [''],
                year_of_experience: [''],
            }),
            address: this.fb.group({
                address1: [''],
                address2: [''],
                city: [''],
                state: [''],
                pincode: [''],
            }),
        });
    }
    ngOnInit(): void {
        this.minDate = new Date();

        this.api.getProducts().subscribe((res) => {
            console.log(res);
            this.serviceList = res;
        });

        this.api.getDoctors().subscribe((res: any) => {
            this.doctors = res.map((item) => {
                return { name: item.first_name, code: item._id };
            });
        });
    }

    get first_name() {
        return this.doctorForm.get('doctorInfo.first_name');
    }
    get last_name() {
        return this.doctorForm.get('doctorInfo.last_name');
    }
    get mobile() {
        return this.doctorForm.get('doctorInfo.mobile');
    }

    get email() {
        return this.doctorForm.get('doctorInfo.email');
    }

    get gender() {
        return this.doctorForm.get('doctorInfo.gender');
    }

    get address() {
        return this.doctorForm.get('address');
    }

    get specialization() {
        return this.doctorForm.get('doctorInfo.specialization');
    }

    get year_of_experience() {
        return this.doctorForm.get('doctorInfo.year_of_experience');
    }
    mobileNumberValidator(control: AbstractControl): ValidationErrors | null {
        const mobilePattern = /^[0-9]{10}$/;
        return mobilePattern.test(control.value)
            ? null
            : { invalidMobile: true };
    }

    async submit() {
        this.doctorForm.markAllAsTouched();
        if (this.doctorForm.valid) {
            console.log(this.doctorForm.value);
            const params = this.commonServie.getHttpParamsByJson({
                mobile: this.mobile.value,
            });
            this.doctorService.searchBy(params).subscribe(async (res: any) => {
                if (res.length != 0) {
                    this.toast.add({
                        key: 'tst',
                        severity: 'error',
                        summary: 'Error Message',
                        detail: 'Doctor already exist with given mobile number',
                    });

                    return;
                }

                let user: any = await lastValueFrom(
                    this.api.createUser({
                        first_name:this.first_name.value,
                        last_name:this.last_name.value,
                        email:this.email.value,
                        role: 'doctor',
                        password: 'pass',
                    })
                );

                let doctor = {
                    ...this.doctorForm.get('doctorInfo').value,
                    user_id: user._id,
                    address: this.address.value,
                };
                console.log(doctor);
                this.doctorService.create(doctor).subscribe((res) => {
                    this.toast.add({
                        key: 'tst',
                        severity: 'success',
                        summary: 'Success Message',
                        detail: 'Doctor created successfully',
                    });
                    setTimeout(() => {
                        this.router.navigateByUrl('doctors');
                    }, 2000);
                });
            });
        }
    }
}
