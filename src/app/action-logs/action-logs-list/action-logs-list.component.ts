import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ActionLogsService } from 'src/app/services/action-logs/action-logs.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
    selector: 'app-action-logs-list',
    templateUrl: './action-logs-list.component.html',
    styleUrl: './action-logs-list.component.scss',
    providers: [DatePipe],
})
export class ActionLogsListComponent {
    private searchSubject: Subject<string> = new Subject();

    moduleList = [
        { name: 'All Modules', code: null },
        { name: 'Auth (Login)', code: 'auth' },
        { name: 'Appointments', code: 'appointments' },
        { name: 'Invoices', code: 'invoice' },
        { name: 'Patients', code: 'patients' },
        { name: 'Staff / Users', code: 'users' },
        { name: 'Doctors', code: 'doctors' },
        { name: 'Services', code: 'products' },
        { name: 'Blogs', code: 'blogs' },
        { name: 'Banners', code: 'banners' },
        { name: 'Gallery', code: 'gallery' },
        { name: 'Gallery Images', code: 'gallery-images' },
        { name: 'Contact Details', code: 'contact-details' },
        { name: 'App Config', code: 'app-config' },
    ];

    actionList = [
        { name: 'All Actions', code: null },
        { name: 'Created', code: 'CREATE' },
        { name: 'Updated', code: 'UPDATE' },
        { name: 'Deleted', code: 'DELETE' },
        { name: 'Login', code: 'LOGIN' },
        { name: 'Failed Login', code: 'LOGIN_FAILED' },
    ];

    roleList = [
        { name: 'All Roles', code: null },
        { name: 'Admin', code: 'admin' },
        { name: 'Staff', code: 'staff' },
        { name: 'Doctor', code: 'doctor' },
    ];

    searchText = '';
    selectedModule: string | null = null;
    selectedAction: string | null = null;
    selectedRole: string | null = null;
    selectedDate: Date[] = [];

    logs: any[] = [];
    totalRecords = 0;
    loading = false;
    lastEvent: any = { first: 0, rows: 10 };

    detailVisible = false;
    selectedLog: any = null;

    constructor(
        private actionLogsService: ActionLogsService,
        private commonService: CommonService,
        private datePipe: DatePipe
    ) {
        this.searchSubject
            .pipe(debounceTime(400), distinctUntilChanged())
            .subscribe((value) => {
                this.searchText = value;
                this.reload();
            });
    }

    onSearch(value: string) {
        this.searchSubject.next(value);
    }

    reload() {
        this.loadLogs({ first: 0, rows: this.lastEvent.rows ?? 10 });
    }

    clear() {
        this.searchText = '';
        this.selectedModule = null;
        this.selectedAction = null;
        this.selectedRole = null;
        this.selectedDate = [];
        this.reload();
    }

    loadLogs(event: any) {
        this.lastEvent = event;

        const params: any = {
            page: event.first / event.rows,
            size: event.rows,
        };
        if (this.searchText) params.q = this.searchText;
        if (this.selectedModule) params.module = this.selectedModule;
        if (this.selectedAction) params.action = this.selectedAction;
        if (this.selectedRole) params.role = this.selectedRole;
        if (this.selectedDate?.[0]) {
            params.from = this.datePipe.transform(
                this.selectedDate[0],
                'yyyy-MM-dd'
            );
            params.to = this.datePipe.transform(
                this.selectedDate[1] ?? this.selectedDate[0],
                'yyyy-MM-dd'
            );
        }

        this.loading = true;

        this.actionLogsService
            .getAll(this.commonService.getHttpParamsByJson(params))
            .subscribe({
                next: (res: any) => {
                    this.logs = res?.data ?? [];
                    this.totalRecords = res?.total ?? 0;
                    this.loading = false;
                },
                error: () => {
                    this.logs = [];
                    this.totalRecords = 0;
                    this.loading = false;
                },
            });
    }

    viewDetails(log: any) {
        this.selectedLog = log;
        this.detailVisible = true;
    }

    actionLabel(action: string) {
        return this.actionList.find((a) => a.code === action)?.name ?? action;
    }

    actionSeverity(action: string) {
        switch (action) {
            case 'CREATE':
                return 'success';
            case 'UPDATE':
                return 'info';
            case 'DELETE':
                return 'danger';
            case 'LOGIN_FAILED':
                return 'warning';
            default:
                return 'secondary';
        }
    }

    moduleLabel(code: string) {
        return this.moduleList.find((m) => m.code === code)?.name ?? code;
    }

    formatValue(value: any): string {
        if (value === null || value === undefined) return '—';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }
}
