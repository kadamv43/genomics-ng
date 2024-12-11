
import { Component } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {  MessageService } from 'primeng/api';

import { ApiService } from 'src/app/services/api.service';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { CommonService } from 'src/app/services/common/common.service';
import { PatientService } from 'src/app/services/patient/patient.service';

@Component({
    selector: 'app-appointment-edit',
    templateUrl: './appointment-edit.component.html',
    styleUrl: './appointment-edit.component.scss',
    providers: [MessageService],
})
export class AppointmentEditComponent {
    appointmentForm: FormGroup;
    minDate;
    serviceList: any = [];
    doctors: any = [];
    filteredItems: any = [];
    selectedPatient;
    id: string;
    patient_id;
    queryParams;
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

    statusList = [
        { name: 'Ongoing', code: 'Ongoing' },
        { name: 'Complete', code: 'Completed' },
        { name: 'Cancel', code: 'Cancelled' },
    ];

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private patientService: PatientService,
        private appointmentService: AppointmentService,
        private toast: MessageService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.appointmentForm = fb.group({
            patientInfo: this.fb.group({
                first_name: ['', Validators.required],
                last_name: [''],
                husband_name: [''],
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
                doctor: [''],
                appointment_date: [new Date(), Validators.required],
                appointment_time: [new Date(), Validators.required],
                reason: [''],
                status: [''],
                remark: [''],
            }),
        });
    }
    ngOnInit(): void {
        this.queryParams = this.route.snapshot.queryParams;
        this.minDate = new Date();

        this.api.getProducts().subscribe((res) => {
            this.serviceList = res;
        });

        this.api.getDoctors().subscribe((res: any) => {
            this.doctors = res?.data?.map((item) => {
                return { name: item.first_name + item.last_name, ...item };
            });
        });

        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.appointmentService.findById(this.id).subscribe((res: any) => {
                this.patient_id = res.patient_id;

                this.appointmentForm.get('appointmentInfo').patchValue({
                    appointment_date: new Date(res.appointment_date),
                    appointment_time: new Date(res.appointment_time),
                    services: res?.services,
                    doctor: res?.doctor?._id,
                    reason: res?.reason,
                    status: res?.status,
                    remark: res?.remark,
                });

                this.appointmentForm.get('patientInfo').patchValue({
                    first_name: res?.patient?.first_name,
                    last_name: res?.patient?.last_name,
                    husband_name: res?.patient?.husband_name,
                    mobile: res?.patient?.mobile,
                    husband_mobile: res?.patient?.husband_mobile,
                    email: res?.patient?.email,
                    dob: res?.patient?.dob ? new Date(res?.patient?.dob) : '',
                    husband_dob: res?.patient?.husband_dob
                        ? new Date(res?.patient?.husband_dob)
                        : '',
                    blood_group: res?.patient?.blood_group,
                    reference_by: res?.patient?.reference_by,
                });

                if (res?.status == 'Completed' || res?.status == 'Cancelled') {
                    this.appointmentForm.disable();
                }
            });
        });
    }

    get first_name() {
        return this.appointmentForm.get('patientInfo.first_name');
    }

    get husband_name() {
        return this.appointmentForm.get('patientInfo.husband_name');
    }

    get husband_mobile() {
        return this.appointmentForm.get('patientInfo.husband_mobile');
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

    get services() {
        return this.appointmentForm.get('appointmentInfo.services');
    }

    get appointment_date() {
        return this.appointmentForm.get('appointmentInfo.appointment_date');
    }

    get appointment_time() {
        return this.appointmentForm.get('appointmentInfo.appointment_time');
    }

    get status() {
        return this.appointmentForm.get('appointmentInfo.status');
    }

    get remark() {
        return this.appointmentForm.get('appointmentInfo.remark');
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
                    fullname: `${item.first_name}  ${item.last_name}`,
                    ...item,
                };
            });
        });
    }

    onChangeStatus() {
        if (this.status.value == 'Ongoing') {
            this.remark.clearValidators();
            this.remark.updateValueAndValidity();
        } else {
            this.remark.setValidators([Validators.required]);
            this.remark.updateValueAndValidity();
        }
    }

    onItemSelected(event: any) {
        this.appointmentForm.get('patientInfo').patchValue({
            first_name: this.selectedPatient.first_name,
            last_name: this.selectedPatient.last_name,
            mobile: this.selectedPatient.mobile,
            email: this.selectedPatient.email,
            age: this.selectedPatient.age,
            blood_group: this.selectedPatient.blood_group,
            dob: new Date(this.selectedPatient.dob),
        });
        // Add your logic here, e.g., update other parts of the form, make additional API calls, etc.
    }

    async submitAppointment() {
        this.appointmentForm.markAllAsTouched();
        if (this.appointmentForm.valid) {
            let appointment: any = {};
            appointment = this.appointmentForm.get('appointmentInfo').value;
            appointment.appointment_date = this.setAppointmentTime(appointment);
            appointment.appointment_time = this.setAppointmentTime(appointment)
            appointment.patient_id = this.patient_id;
            appointment.doctor_id = appointment.doctor;
            //appointment.services = this.selectedServicesObjects.length > 0 ?? appointment.services
            this.appointmentService
                .update(this.id, appointment)
                .subscribe((res) => {
                    this.toast.add({
                        key: 'tst',
                        severity: 'success',
                        summary: 'Success Message',
                        detail: 'Appointment updated successfully',
                    });
                    setTimeout(() => {
                        this.router.navigate(['appointments'], {
                            queryParams: this.queryParams,
                        });
                    }, 2000);
                });
        }
    }

    onChange(e) {
        this.selectedServicesObjects = e.value;
    }

    onClickChips(text) {
        if (!this.appointmentForm.disabled) {
            this.remark.setValue(text);
        }
    }

     setAppointmentTime(appData) {
        let date = new Date(appData.appointment_date);
        let time = appData.appointment_time;
        time.setFullYear(date.getFullYear()); // Set year (optional, if not changing)
        time.setMonth(date.getMonth()); // Set month (0-based, so December is 11)
        time.setDate(date.getDate());
        console.log(time)
        return time;
    }

}
