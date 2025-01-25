import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { app } from 'electron';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
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
                husband_name: [''],
                last_name: [''],
                mobile: ['', [Validators.required, this.mobileNumberValidator]],
                husband_mobile: ['', [this.mobileNumberValidator]],
                email: ['', Validators.email],
                dob: [''],
                husband_dob: [''],
                age: ['', Validators.pattern(/^\d{1,2}$/)],
                blood_group: [''],
                reference_by: [''],
            }),
            appointmentInfo: this.fb.group({
                services: [''],
                doctor: ['', Validators.required],
                appointment_date: [new Date(), Validators.required],
                appointment_time: [new Date(), Validators.required],
                reason: [''],
            }),
        });
    }
    ngOnInit(): void {
        this.minDate = new Date();

        this.api.getProducts().subscribe((res) => {
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
    get husband_name() {
        return this.appointmentForm.get('patientInfo.husband_name');
    }
    get last_name() {
        return this.appointmentForm.get('patientInfo.last_name');
    }
    get mobile() {
        return this.appointmentForm.get('patientInfo.mobile');
    }
    get husband_mobile() {
        return this.appointmentForm.get('patientInfo.husband_mobile');
    }

    get email() {
        return this.appointmentForm.get('patientInfo.email');
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
        if (control.value == '') {
            return null;
        }
        return mobilePattern.test(control.value)
            ? null
            : { invalidMobile: true };
    }

    search(event: any) {
        const query = event.query;
        this.patientService.globalSearch(query).subscribe((data: []) => {
            this.filteredItems = data.map((item: any) => {
                return {
                    fullname: `${item.first_name}  ${item.last_name} (OPD - ${item?.patient_number})`,
                    ...item,
                };
            });
        });
    }

    onItemSelected(event: any) {
        this.appointmentForm.get('patientInfo').patchValue({
            first_name: this.selectedPatient.first_name,
            last_name: this.selectedPatient.last_name,
            husband_name: this.selectedPatient.husband_name,
            mobile: this.selectedPatient.mobile,
            husband_mobile: this.selectedPatient.husband_mobile,
            email: this.selectedPatient.email,
            blood_group: this.selectedPatient.blood_group,
            reference_by: this.selectedPatient.reference_by,
            dob: this.selectedPatient.dob
                ? new Date(this.selectedPatient.dob)
                : '',

            husband_dob: this.selectedPatient.husband_dob
                ? new Date(this.selectedPatient.husband_dob)
                : '',
        });
        // Add your logic here, e.g., update other parts of the form, make additional API calls, etc.
    }

    async submitAppointment() {
        console.log(this.appointmentForm.get('appointmentInfo').value);
        // return
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
                    await lastValueFrom(
                        this.patientService.update(
                            patient_id,
                            this.appointmentForm.get('patientInfo').value
                        )
                    );
                }

                let appointment: any = {};
                appointment = this.appointmentForm.get('appointmentInfo').value;
                console.log(appointment);
                appointment.appointment_date =
                    this.setAppointmentTime(appointment);
                appointment.appointment_time =
                    this.setAppointmentTime(appointment);
                appointment.patient_id = patient_id;
                appointment.services = this.selectedServicesObjects;
                appointment.patient = this.selectedPatient ?? patient_id;
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
    }

    setAppointmentTime(appData) {
        let date = new Date(appData.appointment_date);
        let time = appData.appointment_time;
        time.setFullYear(date.getFullYear()); // Set year (optional, if not changing)
        time.setMonth(date.getMonth()); // Set month (0-based, so December is 11)
        time.setDate(date.getDate());

        return time;
    }
}
