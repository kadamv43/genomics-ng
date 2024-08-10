import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    constructor() {}

    getHttpParamsByJson(obj: any): HttpParams {
        let params = new HttpParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                params = params.append(key, obj[key]);
            }
        }
        return params;
    }
}
