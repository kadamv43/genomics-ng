import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AppointmentService {
    baseUrl = 'appointments';
    constructor(private httpService: HttpService) {}

    create(user) {
        const url = this.baseUrl;
        return this.httpService.post(url, user);
    }

    update(id: string, user) {
        const url = `${this.baseUrl}/${id}`;
        return this.httpService.patch(url, user);
    }

    getAll() {
        let headers = new HttpHeaders();
        const token = localStorage.getItem('token');
        if (token) {
            headers = headers.set('Authorization', 'Bearer ' + token);
        }

        const url = this.baseUrl;
        return this.httpService.get(url, undefined, headers);
    }

    findById(id: string) {
        const url = `${this.baseUrl}/${id}`;
        return this.httpService.get(url);
    }

    delete(id: string) {
        const url = `${this.baseUrl}/${id}`;
        return this.httpService.delete(url);
    }

    searchBy(params: HttpParams) {
        const url = `${this.baseUrl}/search`;
        return this.httpService.get(url, params);
    }
}
