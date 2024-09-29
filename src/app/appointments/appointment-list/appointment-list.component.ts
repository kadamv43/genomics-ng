import { Component, ElementRef, ViewChild } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { serialize } from 'v8';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadFormComponent } from '../file-upload-form/file-upload-form.component';
import { DatePipe } from '@angular/common';

interface expandedRows {
    [key: string]: boolean;
}
@Component({
    selector: 'app-appointment-list',
    templateUrl: './appointment-list.component.html',
    styleUrl: './appointment-list.component.scss',
    providers: [ConfirmationService, MessageService, DialogService, DatePipe],
})
export class AppointmentListComponent {
    statusList = [
        { name: 'Created', code: 'Created' },
        { name: 'Ongoing', code: 'Ongoing' },
        { name: 'Completed', code: 'Completed' },
        { name: 'Cancelled', code: 'Cancelled' },
    ];

    display = false;
    selectedStatus = '';
    selectedDate = '';
    searchText = '';
    customers1: Customer[] = [];

    customers2: Customer[] = [];

    customers3: Customer[] = [];

    selectedCustomers1: Customer[] = [];

    selectedCustomer: Customer = {};

    representatives: Representative[] = [];

    statuses: any[] = [];

    products: Product[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = false;

    appointments: any = [];

    role = '';

    doctors = [];

    minDate;

    totalRecords = 0;

    ref: DynamicDialogRef | undefined;

    constructor(
        private appointmentService: AppointmentService,
        private router: Router,
        private authService: AuthService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private api: ApiService,
        private commonService: CommonService,
        private dialogService: DialogService,
        private datePipe: DatePipe
    ) {}

    ngOnInit() {
        this.api.getDoctors().subscribe((res: any) => {
            this.doctors = res.map((item) => {
                return { name: item.first_name, code: item._id };
            });
        });
        this.role = this.authService.getRole();
    }

    loadAppointments(event: any) {
        this.loading = true;

        const page = event.first / event.rows;
        const size = event.rows;

        let params = {};

        if (this.searchText != '') {
            params['q'] = this.searchText;
        }

        if (this.selectedStatus != '') {
            params['status'] = this.selectedStatus;
        }

        if (this.selectedDate != '') {
            params['from'] = this.datePipe.transform(
                this.selectedDate[0],
                'yyyy-MM-dd'
            );
            params['to'] = this.datePipe.transform(
                this.selectedDate[1],
                'yyyy-MM-dd'
            );
        }

        params['page'] = page;
        params['size'] = size;

        let queryParams = this.commonService.getHttpParamsByJson(params);
        this.appointmentService.getAll(queryParams).subscribe((data: any) => {
            this.appointments = data.data;
            this.totalRecords = data.total;
            this.loading = false;
        });
    }

    onSort() {
        this.updateRowGroupMetaData();
    }

  

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.customers3) {
            for (let i = 0; i < this.customers3.length; i++) {
                const rowData = this.customers3[i];
                const representativeName = rowData?.representative?.name || '';

                if (i === 0) {
                    this.rowGroupMetadata[representativeName] = {
                        index: 0,
                        size: 1,
                    };
                } else {
                    const previousRowData = this.customers3[i - 1];
                    const previousRowGroup =
                        previousRowData?.representative?.name;
                    if (representativeName === previousRowGroup) {
                        this.rowGroupMetadata[representativeName].size++;
                    } else {
                        this.rowGroupMetadata[representativeName] = {
                            index: i,
                            size: 1,
                        };
                    }
                }
            }
        }
    }

    expandAll() {
        if (!this.isExpanded) {
            this.products.forEach((product) =>
                product && product.name
                    ? (this.expandedRows[product.name] = true)
                    : ''
            );
        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    goTo(url) {
        this.router.navigateByUrl(url);
    }

    confirm2(event: Event, user) {
        this.confirmationService.confirm({
            key: 'confirm2',
            target: event.target || new EventTarget(),
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.appointmentService.delete(user._id).subscribe((res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'Appointments Deleted Successfully',
                    });
                    let removedItemIndex = this.appointments.findIndex(
                        (item) => item._id == user._id
                    );
                    this.appointments.splice(removedItemIndex, 1);
                });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'Unable to delete Appointments',
                });
            },
        });
    }

    async clear(event) {
        this.selectedStatus = '';
        this.selectedDate = '';
        this.searchText = '';
        this.loadAppointments(event);
    }

    filter() {
        let params = {};
        if (this.searchText != '') {
            params['q'] = this.searchText;
        }

        if (this.selectedStatus != '') {
            params['status'] = this.selectedStatus;
        }

        if (this.selectedDate != '') {
            params['from'] = this.datePipe.transform(
                this.selectedDate[0],
                'yyyy-MM-dd'
            );
            params['to'] = this.datePipe.transform(
                this.selectedDate[1],
                'yyyy-MM-dd'
            );
        }

        let queryParams = this.commonService.getHttpParamsByJson(params);
        this.appointmentService.getAll(queryParams).subscribe((res) => {
            this.appointments = res;
        });
    }
    async updateStatus(id, status) {
        this.appointmentService.update(id, { status }).subscribe((res) => {
            this.messageService.add({
                // key: 'tst',
                severity: 'success',
                summary: 'Success Message',
                detail: 'Status updated successfully',
            });
        });
    }

    openDialog(id: string) {
        this.ref = this.dialogService.open(FileUploadFormComponent, {
            data: {
                id,
                fileNameInput: false,
                fileTypes: '.png,.jpg,.jpeg,.JPEG,.pdf',
                fileUploadUrl: 'appointments/upload-files/' + id,
            },
            header: 'File Upload',
        });
    }
}
