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
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { CommonService } from 'src/app/services/common/common.service';
import { PatientService } from 'src/app/services/patient/patient.service';

@Component({
    selector: 'app-patient-edit',
    templateUrl: './patient-edit.component.html',
    styleUrl: './patient-edit.component.scss',
    providers: [MessageService],
})
export class PatientEditComponent {
    patientForm: FormGroup;
    minDate;
    serviceList: any = [];
    doctors: any = [];
    filteredItems: any = [];
    selectedPatient;
    id: string;
    patient_id;
    selectedServicesObjects = [];

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
        private router: Router,
        private route: ActivatedRoute
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
                reference_by:['']
            }),
            medicalHistoryInfo: this.fb.group({
                allergies: [''],
                history: this.fb.array([this.createItem()]),
            }),
        });
    }
    ngOnInit(): void {
        this.minDate = new Date();

        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.patientService.findById(this.id).subscribe((res: any) => {
                this.patient_id = res._id;
                this.patientForm.get('patientInfo').patchValue({
                    first_name: res?.first_name,
                    last_name: res?.last_name,
                    mobile: res?.mobile,
                    email: res?.email,
                    gender: res?.gender,
                    dob: res?.dob ? new Date(res?.dob) : '',
                    age: res?.age,
                    blood_group: res?.blood_group,
                    reference_by: res?.reference_by,
                });

                this.patientForm.get('medicalHistoryInfo').patchValue({
                    allergies: res?.medical_history_info?.allergies,
                });

                const formArray = this.history;

                while (formArray.length) {
                    formArray.removeAt(0);
                }

                res?.medical_history_info?.history?.forEach((item) => {
                    formArray.push(this.createItem(item));
                });
            });
        });
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

    get history(): FormArray {
        return this.patientForm.get('medicalHistoryInfo.history') as FormArray;
    }

    get medical_history_info() {
        return this.patientForm.get('medicalHistoryInfo');
    }

    addItem(): void {
        this.history.push(this.createItem());
    }

    createItem(data: any = {}): FormGroup {
        return this.fb.group({
            condition: [data.condition],
            since: [data.since],
            treatment: [data.treatment],
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
            let patient = {
                ...this.patientForm.get('patientInfo').value,
                medical_history_info: this.medical_history_info.value,
            };
            console.log(patient);

            this.patientService.update(this.id, patient).subscribe((res) => {
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Patient updated successfully',
                });
                setTimeout(() => {
                    this.router.navigateByUrl('patients');
                }, 2000);
            });
        }
    }
}
