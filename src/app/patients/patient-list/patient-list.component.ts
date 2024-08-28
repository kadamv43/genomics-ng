import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common/common.service';
import { PatientService } from 'src/app/services/patient/patient.service';

@Component({
    selector: 'app-patient-list',
    templateUrl: './patient-list.component.html',
    styleUrl: './patient-list.component.scss',
    providers: [MessageService],
})
export class PatientListComponent {
    patients: any = [];
    loading = false;
    totalRecords = 0;

    constructor(
        private patientService: PatientService,
        private router: Router,
        private commonService: CommonService
    ) {}

    loadPatients(event: any) {
        this.loading = true;
        const page = event.first / event.rows;
        const size = event.rows;

        let params = this.commonService.getHttpParamsByJson({
            page: page.toString(),
            size: size.toString(),
        });

        this.patientService.getAll(params).subscribe((data:any) => {
            this.patients = data.data
            this.totalRecords = data.total
            this.loading = false;
        });
    }

    goTo(url) {
        this.router.navigateByUrl(url);
    }
}
