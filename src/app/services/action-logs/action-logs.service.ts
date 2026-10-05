import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root',
})
export class ActionLogsService {
    baseUrl = 'action-logs';
    constructor(private httpService: HttpService) {}

    getAll(params: HttpParams) {
        return this.httpService.get(this.baseUrl, params);
    }
}
