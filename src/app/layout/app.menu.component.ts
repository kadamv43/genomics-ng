import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    role: string;

    constructor(public layoutService: LayoutService) {}

    ngOnInit() {
        this.role = localStorage.getItem('role');

        this.model = [
            {
                label: '',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/'],
                    },
                ],
            },
        ];

        if (this.role == 'admin') {
            this.model.push(
                {
                    label: '',
                    items: [
                        {
                            label: 'Appointments',
                            icon: 'pi pi-fw pi-book',
                            routerLink: ['appointments'],
                        },
                    ],
                },
                {
                    label: '',
                    items: [
                        {
                            label: 'Staff',
                            icon: 'pi pi-fw pi-users',
                            routerLink: ['users'],
                        },
                    ],
                },
                {
                    label: '',
                    items: [
                        {
                            label: 'Services',
                            icon: 'pi pi-fw pi-briefcase',
                            routerLink: ['products'],
                        },
                    ],
                },
                {
                    label: '',
                    items: [
                        {
                            label: 'Doctors',
                            icon: 'pi pi-fw pi-users',
                            routerLink: ['doctors'],
                        },
                    ],
                },
                {
                    label: '',
                    items: [
                        {
                            label: 'Patients',
                            icon: 'pi pi-fw pi-users',
                            routerLink: ['patients'],
                        },
                    ],
                },
                {
                    label: '',
                    items: [
                        {
                            label: 'Invoices',
                            icon: 'pi pi-fw pi-file',
                            routerLink: ['invoices'],
                        },
                    ],
                },
                {
                    label: '',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        {
                            label: 'Website',
                            icon: 'pi pi-fw pi-globe',
                            items: [
                                {
                                    label: 'Banners',
                                    icon: 'pi pi-fw pi-image',
                                    routerLink: ['banners'],
                                },
                                {
                                    label: 'Gallery',
                                    icon: 'pi pi-fw pi-image',
                                    routerLink: ['gallery'],
                                },
                                {
                                    label: 'Blog',
                                    icon: 'pi pi-fw pi-pencil',
                                    routerLink: ['blogs'],
                                },
                                {
                                    label: 'Contact Details',
                                    icon: 'pi pi-fw pi-phone',
                                    routerLink: ['contact-details'],
                                },
                            ],
                        },
                    ],
                }
            );
        } else if (this.role == 'staff') {
            this.model.push(
                {
                    label: '',
                    items: [
                        {
                            label: 'Appointments',
                            icon: 'pi pi-fw pi-book',
                            routerLink: ['appointments'],
                        },
                    ],
                },
                {
                    label: '',
                    items: [
                        {
                            label: 'Patients',
                            icon: 'pi pi-fw pi-users',
                            routerLink: ['patients'],
                        },
                    ],
                },
                {
                    label: '',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        {
                            label: 'Website',
                            icon: 'pi pi-fw pi-globe',
                            items: [
                                {
                                    label: 'Banners',
                                    icon: 'pi pi-fw pi-image',
                                    routerLink: ['banners'],
                                },
                                {
                                    label: 'Gallery',
                                    icon: 'pi pi-fw pi-image',
                                    routerLink: ['gallery'],
                                },
                                {
                                    label: 'Blog',
                                    icon: 'pi pi-fw pi-pencil',
                                    routerLink: ['blogs'],
                                },
                                {
                                    label: 'Contact Details',
                                    icon: 'pi pi-fw pi-phone',
                                    routerLink: ['contact-details'],
                                },
                            ],
                        },
                    ],
                }
            );
        } else if (this.role == 'doctor') {
            this.model.push({
                label: '',
                items: [
                    {
                        label: 'Appointments',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['appointments'],
                    },
                ],
            });
        }
    }
}
