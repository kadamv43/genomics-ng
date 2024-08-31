import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
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
    providers: [ConfirmationService, MessageService],
    selector: 'app-appointment-create',
    templateUrl: './appointment-create.component.html',
    styleUrl: './appointment-create.component.scss',
})
export class AppointmentCreateComponent implements OnInit {
    appointmentForm: FormGroup;
    selectedState: any = null;
    minDate;
    serviceList: any = [];
    selectedSevices!: City[];
    doctors: any = [];
    filteredItems: any = [];
    selectedPatient;
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
        private router: Router
    ) {
        this.appointmentForm = fb.group({
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
            appointmentInfo: this.fb.group({
                services: ['', Validators.required],
                doctor: ['', Validators.required],
                appointment_date: [new Date(), Validators.required],
                appointment_time: [new Date(), Validators.required],
                reason: [''],
            })
        });
    }
    ngOnInit(): void {
        this.minDate = new Date();

        this.api.getProducts().subscribe((res) => {
            console.log(res);
            this.serviceList = res;
        });

        this.api.getDoctors().subscribe((res: any) => {
            this.doctors = res?.data?.map((item) => {
                return { name: item.first_name, code: item._id };
            });
        });
    }

    get first_name() {
        return this.appointmentForm.get('patientInfo.first_name');
    }
    get last_name() {
        return this.appointmentForm.get('patientInfo.last_name');
    }
    get mobile() {
        return this.appointmentForm.get('patientInfo.mobile');
    }

    get email() {
        return this.appointmentForm.get('patientInfo.email');
    }

    get gender() {
        return this.appointmentForm.get('patientInfo.gender');
    }

    get services() {
        return this.appointmentForm.get('appointmentInfo.services');
    }

    get appointment_date() {
        return this.appointmentForm.get('appointmentInfo.appointment_date');
    }

    get appointment_time() {
        return this.appointmentForm.get('appointmentInfo.appointment_time');
    }

    get doctor() {
        return this.appointmentForm.get('appointmentInfo.doctor');
    }

    get age() {
        return this.appointmentForm.get('patientInfo.age');
    }

    mobileNumberValidator(control: AbstractControl): ValidationErrors | null {
        const mobilePattern = /^[0-9]{10}$/;
        return mobilePattern.test(control.value)
            ? null
            : { invalidMobile: true };
    }

    search(event: any) {
        const query = event.query;
        this.patientService.globalSearch(query).subscribe((data: []) => {
            this.filteredItems = data.map((item: any) => {
                return {
                    fullname: `${item.first_name}  ${item.last_name}`,
                    ...item,
                };
            });
        });
    }

    onItemSelected(event: any) {
        this.appointmentForm.get('patientInfo').patchValue({
            first_name: this.selectedPatient.first_name,
            last_name: this.selectedPatient.last_name,
            mobile: this.selectedPatient.mobile,
            gender: this.selectedPatient.gender,
            email: this.selectedPatient.email,
            age: this.selectedPatient.age,
            blood_group: this.selectedPatient.blood_group,
            reference_by: this.selectedPatient.reference_by,
            dob: this.selectedPatient.dob
                ? new Date(this.selectedPatient.dob)
                : '',
        });
        console.log('Selected item:', this.selectedPatient);
        // Add your logic here, e.g., update other parts of the form, make additional API calls, etc.
    }

    async submitAppointment() {
        this.appointmentForm.markAllAsTouched();
        if (this.appointmentForm.valid) {
            const params = this.commonServie.getHttpParamsByJson({
                mobile: this.mobile.value,
            });
            this.patientService.searchBy(params).subscribe(async (res: any) => {
                let patient_id;

                if (res.length == 0) {
                    let patient: any = await lastValueFrom(
                        this.patientService.create(
                            this.appointmentForm.get('patientInfo').value
                        )
                    );

                    patient_id = patient._id;
                } else {
                    patient_id = res[0]?._id;
                }

                let appointment: any = {};
                appointment = this.appointmentForm.get('appointmentInfo').value;
                appointment.patient_id = patient_id;
                appointment.services = this.selectedServicesObjects;
                appointment.patient = this.selectedPatient ?? patient_id
                this.appointmentService.create(appointment).subscribe((res) => {
                    this.toast.add({
                        key: 'tst',
                        severity: 'success',
                        summary: 'Success Message',
                        detail: 'Appointment created successfully',
                    });
                    setTimeout(() => {
                        this.router.navigateByUrl('appointments');
                    }, 2000);
                });
            });
        }
    }

    onChange(e) {
        this.selectedServicesObjects = e.value;
        console.log(e.value);
    }
}
