import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { app } from 'electron';
import { it } from 'node:test';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';

@Component({
    selector: 'app-patient-profile',
    templateUrl: './patient-profile.component.html',
    styleUrl: './patient-profile.component.scss',
})
export class PatientProfileComponent implements OnInit {
    id = '';
    appointments = [];
    patientData= null

    constructor(
        private route: ActivatedRoute,
        private appointmentService: AppointmentService
    ) {}
    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id'); 
            this.appointmentService
                .getAppointmentsByPatientId(this.id)
                .subscribe({
                    next: (res: any) => {
                        this.appointments = res?.appointments.map((item)=>{
                          let services = item?.services?.map(
                              (serv) => serv.name
                          );
                          // console.log(services);
                          return { ...item, services };
                        });

                        console.log(this.appointments)
                        this.patientData = res?.patient;
                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
        });
    }
}
