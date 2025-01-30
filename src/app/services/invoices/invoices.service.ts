import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class InvoicesService {
    baseUrl = 'invoice';
    constructor(private httpService: HttpService) {}

    create(user) {
        const url = this.baseUrl;
        return this.httpService.post(url, user);
    }

    createBalance(user) {
        const url = this.baseUrl + '/balance';
        return this.httpService.post(url, user);
    }

    update(id: string, user) {
        const url = `${this.baseUrl}/${id}`;
        return this.httpService.patch(url, user);
    }

    getAll(params: any) {
        const url = this.baseUrl;
        return this.httpService.get(url, params);
    }

    getPendingInvoices() {
        const url = this.baseUrl + '/pending-invoices';
        return this.httpService.get(url);
    }

    getPrePostCharges() {
        const url = this.baseUrl + '/pre-post-charges';
        return this.httpService.get(url);
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
