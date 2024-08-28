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
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
    selector: 'app-doctor-edit',
    templateUrl: './doctor-edit.component.html',
    styleUrl: './doctor-edit.component.scss',
    providers: [MessageService],
})
export class DoctorEditComponent {
    doctorForm: FormGroup;
    selectedState: any = null;
    minDate;
    serviceList: any = [];
    selectedSevices!: City[];
    doctors: any = [];
    filteredItems: any = [];
    selectedPatient;
    id!: string;
    doctor!: any;
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
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.doctorForm = fb.group({
            doctorInfo: this.fb.group({
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
                mobile: [
                    { value: '', disabled: true },
                    [Validators.required, this.mobileNumberValidator],
                ],
                email: ['', Validators.email],
                gender: ['', Validators.required],
                dob: [''],
                blood_group: [''],
                specialization: [''],
                years_of_experience: [''],
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

        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.doctorService.findById(this.id).subscribe((res: any) => {
                this.doctor = res;
                this.doctorForm.get('doctorInfo').patchValue({
                    first_name: res?.first_name,
                    last_name: res?.last_name,
                    mobile: res?.mobile,
                    email: res?.email,
                    gender: res?.gender,
                    dob: res?.dob ? new Date(res?.dob) : '',
                    age: res?.age,
                    specialization: res?.specialization,
                    years_of_experience: res?.years_of_experience,
                    blood_group: res?.blood_group,
                });
                 this.doctorForm.get('address').patchValue({
                     address1: res?.address?.address1,
                     address2: res?.address?.address2,
                     city: res?.address?.city,
                     state: res?.address?.state,
                     pincode: res.address?.pincode,
                 });
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

    get years_of_experience() {
        return this.doctorForm.get('doctorInfo.years_of_experience');
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
            let doctor = {
                ...this.doctorForm.get('doctorInfo').value,
                address: this.address.value,
            };

            this.doctorService
                .update(this.doctor._id, doctor)
                .subscribe((res) => {
                    this.toast.add({
                        key: 'tst',
                        severity: 'success',
                        summary: 'Success Message',
                        detail: 'Doctor edited successfully',
                    });
                    setTimeout(() => {
                        this.router.navigateByUrl('doctors');
                    }, 2000);
                });
        }
    }
}
