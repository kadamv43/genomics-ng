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
import { PatientService } from 'src/app/services/patient/patient.service';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'app-patient-create',
    templateUrl: './patient-create.component.html',
    styleUrl: './patient-create.component.scss',
    providers: [MessageService],
})
export class PatientCreateComponent {
    patientForm: FormGroup;
    selectedState: any = null;
    minDate;
    serviceList: any = [];
    selectedSevices!: City[];
    doctors: any = [];
    filteredItems: any = [];
    selectedPatient;
    selectedServicesObjects = [];

    loading = false;
    conditions = [
        { name: 'Hypertension', code: 'Hypertension' },
        { name: 'Diabetes', code: 'Diabetes' },
        { name: 'Thyroid', code: 'Thyroid' },
    ];

    conditionSince = [
        { name: '6 months', code: '6 months' },
        { name: '1 year', code: '1 year' },
        { name: 'more than 1 year', code: 'more than 1 year' },
    ];

    treatment = [
        { name: 'Diet', code: 'Diet' },
        { name: 'Medications', code: 'Medications' },
        { name: 'Diet and Medication', code: 'Diet and Medication' },
    ];

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
        private patientService: PatientService,
        private commonServie: CommonService,
        private appointmentService: AppointmentService,
        private toast: MessageService,
        private router: Router
    ) {
        this.patientForm = fb.group({
            patientInfo: this.fb.group({
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
                mobile: ['', [Validators.required, this.mobileNumberValidator]],
                email: ['', Validators.email],
                gender: ['', Validators.required],
                dob: [''],
                age: ['', Validators.pattern(/^\d{1,2}$/)],
                blood_group: [''],
                reference_by:[]
            }),
            medicalHistoryInfo: this.fb.group({
                allergies: [''],
                history: this.fb.array([this.createItem()]),
            }),
        });
    }
    ngOnInit(): void {
        this.minDate = new Date();
    }

    get first_name() {
        return this.patientForm.get('patientInfo.first_name');
    }
    get last_name() {
        return this.patientForm.get('patientInfo.last_name');
    }
    get mobile() {
        return this.patientForm.get('patientInfo.mobile');
    }

    get email() {
        return this.patientForm.get('patientInfo.email');
    }

    get gender() {
        return this.patientForm.get('patientInfo.gender');
    }

    get age() {
        return this.patientForm.get('patientInfo.age');
    }

    get medical_history_info() {
        return this.patientForm.get('medicalHistoryInfo');
    }

    get history(): FormArray {
        return this.patientForm.get('medicalHistoryInfo.history') as FormArray;
    }

    addItem(): void {
        this.history.push(this.createItem());
    }

    createItem(): FormGroup {
        return this.fb.group({
            condition: [''],
            since: [''],
            treatment: [''],
        });
    }

    removeItem(index: number): void {
        if (this.history.length > 1) {
            this.history.removeAt(index);
        }
    }

    mobileNumberValidator(control: AbstractControl): ValidationErrors | null {
        const mobilePattern = /^[0-9]{10}$/;
        return mobilePattern.test(control.value)
            ? null
            : { invalidMobile: true };
    }

    async submit() {
        this.patientForm.markAllAsTouched();
        if (this.patientForm.valid) {
            this.loading = true;
            const params = this.commonServie.getHttpParamsByJson({
                mobile: this.mobile.value,
            });
            this.patientService.searchBy(params).subscribe(async (res: any) => {
                if (res.length != 0) {
                    this.toast.add({
                        key: 'tst',
                        severity: 'error',
                        summary: 'Error Message',
                        detail: 'Patient already exist with given mobile number',
                    });

                    this.loading = false;
                    return;
                }

                let patient = {
                    ...this.patientForm.get('patientInfo').value,
                    medical_history_info: this.medical_history_info.value,
                };
                console.log(patient);
                this.patientService.create(patient).subscribe((res) => {
                    this.toast.add({
                        key: 'tst',
                        severity: 'success',
                        summary: 'Success Message',
                        detail: 'Patient created successfully',
                    });
                    this.loading = false;
                    setTimeout(() => {
                        this.router.navigateByUrl('patients');
                    }, 2000);
                });
            });
        }
    }
}
