import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PatientService {
    baseUrl = 'patients';
    constructor(private httpService: HttpService) {}

    create(user) {
        const url = this.baseUrl;
        return this.httpService.post(url, user);
    }

    importExcel(user) {
        const url = `${this.baseUrl}/import`;
        return this.httpService.post(url, user);
    }

    update(id: string, user) {
        const url = `${this.baseUrl}/${id}`;
        return this.httpService.patch(url, user);
    }

    getAll(params) {
        const url = this.baseUrl;
        return this.httpService.get(url, params);
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

    globalSearch(query) {
        const url = `${this.baseUrl}/global-search/?q=${query}`;
        return this.httpService.get(url);
    }

    deleteReport(id: string, image_id: number) {
        const url = `${this.baseUrl}/reports/${id}`;
        return this.httpService.patch(url, { image_id });
    }
}
