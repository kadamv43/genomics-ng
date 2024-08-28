import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorsService } from 'src/app/services/doctors/doctors.service';

@Component({
    selector: 'app-doctor-list',
    templateUrl: './doctor-list.component.html',
    styleUrl: './doctor-list.component.scss',
})
export class DoctorListComponent {
    doctors: any = [];
    loading = false;
    constructor(
      private doctorService: DoctorsService,
      private router:Router
    ) {}
    ngOnInit() {
        this.doctorService.getAll().subscribe((res) => {
            console.log(res);
            this.doctors = res;
        });
    }

    goTo(url) {
        this.router.navigateByUrl(url);
    }
}
