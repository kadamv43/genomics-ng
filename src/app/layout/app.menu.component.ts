import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    role:string;

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {

        this.role = localStorage.getItem("role");

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

             // {
             //     label: '',
             //     items: [
             //         {
             //             label: 'Form Layout',
             //             icon: 'pi pi-fw pi-id-card',
             //             routerLink: ['/uikit/formlayout'],
             //         },
             //         {
             //             label: 'Input',
             //             icon: 'pi pi-fw pi-check-square',
             //             routerLink: ['/uikit/input'],
             //         },
             //         {
             //             label: 'Float Label',
             //             icon: 'pi pi-fw pi-bookmark',
             //             routerLink: ['/uikit/floatlabel'],
             //         },
             //         {
             //             label: 'Invalid State',
             //             icon: 'pi pi-fw pi-exclamation-circle',
             //             routerLink: ['/uikit/invalidstate'],
             //         },
             //         {
             //             label: 'Button',
             //             icon: 'pi pi-fw pi-box',
             //             routerLink: ['/uikit/button'],
             //         },
             //         {
             //             label: 'Table',
             //             icon: 'pi pi-fw pi-table',
             //             routerLink: ['/uikit/table'],
             //         },
             //         {
             //             label: 'List',
             //             icon: 'pi pi-fw pi-list',
             //             routerLink: ['/uikit/list'],
             //         },
             //         {
             //             label: 'Tree',
             //             icon: 'pi pi-fw pi-share-alt',
             //             routerLink: ['/uikit/tree'],
             //         },
             //         {
             //             label: 'Panel',
             //             icon: 'pi pi-fw pi-tablet',
             //             routerLink: ['/uikit/panel'],
             //         },
             //         {
             //             label: 'Overlay',
             //             icon: 'pi pi-fw pi-clone',
             //             routerLink: ['/uikit/overlay'],
             //         },
             //         {
             //             label: 'Media',
             //             icon: 'pi pi-fw pi-image',
             //             routerLink: ['/uikit/media'],
             //         },
             //         {
             //             label: 'Menu',
             //             icon: 'pi pi-fw pi-bars',
             //             routerLink: ['/uikit/menu'],
             //             routerLinkActiveOptions: {
             //                 paths: 'subset',
             //                 queryParams: 'ignored',
             //                 matrixParams: 'ignored',
             //                 fragment: 'ignored',
             //             },
             //         },
             //         {
             //             label: 'Message',
             //             icon: 'pi pi-fw pi-comment',
             //             routerLink: ['/uikit/message'],
             //         },
             //         {
             //             label: 'File',
             //             icon: 'pi pi-fw pi-file',
             //             routerLink: ['/uikit/file'],
             //         },
             //         {
             //             label: 'Chart',
             //             icon: 'pi pi-fw pi-chart-bar',
             //             routerLink: ['/uikit/charts'],
             //         },
             //         {
             //             label: 'Misc',
             //             icon: 'pi pi-fw pi-circle',
             //             routerLink: ['/uikit/misc'],
             //         },
             //     ],
             // },
             // {
             //     label: 'Prime Blocks',
             //     items: [
             //         {
             //             label: 'Free Blocks',
             //             icon: 'pi pi-fw pi-eye',
             //             routerLink: ['/blocks'],
             //             badge: 'NEW',
             //         },
             //         {
             //             label: 'All Blocks',
             //             icon: 'pi pi-fw pi-globe',
             //             url: ['https://www.primefaces.org/primeblocks-ng'],
             //             target: '_blank',
             //         },
             //     ],
             // },
             // {
             //     label: 'Utilities',
             //     items: [
             //         {
             //             label: 'PrimeIcons',
             //             icon: 'pi pi-fw pi-prime',
             //             routerLink: ['/utilities/icons'],
             //         },
             //         {
             //             label: 'PrimeFlex',
             //             icon: 'pi pi-fw pi-desktop',
             //             url: ['https://www.primefaces.org/primeflex/'],
             //             target: '_blank',
             //         },
             //     ],
             // },
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
                                 routerLink: ['/auth/login'],
                             },
                             {
                                 label: 'Gallery',
                                 icon: 'pi pi-fw pi-image',
                                 routerLink: ['/auth/error'],
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
             },
             // {
             //     label: 'Hierarchy',
             //     items: [
             //         {
             //             label: 'Submenu 1',
             //             icon: 'pi pi-fw pi-bookmark',
             //             items: [
             //                 {
             //                     label: 'Submenu 1.1',
             //                     icon: 'pi pi-fw pi-bookmark',
             //                     items: [
             //                         {
             //                             label: 'Submenu 1.1.1',
             //                             icon: 'pi pi-fw pi-bookmark',
             //                         },
             //                         {
             //                             label: 'Submenu 1.1.2',
             //                             icon: 'pi pi-fw pi-bookmark',
             //                         },
             //                         {
             //                             label: 'Submenu 1.1.3',
             //                             icon: 'pi pi-fw pi-bookmark',
             //                         },
             //                     ],
             //                 },
             //                 {
             //                     label: 'Submenu 1.2',
             //                     icon: 'pi pi-fw pi-bookmark',
             //                     items: [
             //                         {
             //                             label: 'Submenu 1.2.1',
             //                             icon: 'pi pi-fw pi-bookmark',
             //                         },
             //                     ],
             //                 },
             //             ],
             //         },
             //         {
             //             label: 'Submenu 2',
             //             icon: 'pi pi-fw pi-bookmark',
             //             items: [
             //                 {
             //                     label: 'Submenu 2.1',
             //                     icon: 'pi pi-fw pi-bookmark',
             //                     items: [
             //                         {
             //                             label: 'Submenu 2.1.1',
             //                             icon: 'pi pi-fw pi-bookmark',
             //                         },
             //                         {
             //                             label: 'Submenu 2.1.2',
             //                             icon: 'pi pi-fw pi-bookmark',
             //                         },
             //                     ],
             //                 },
             //                 {
             //                     label: 'Submenu 2.2',
             //                     icon: 'pi pi-fw pi-bookmark',
             //                     items: [
             //                         {
             //                             label: 'Submenu 2.2.1',
             //                             icon: 'pi pi-fw pi-bookmark',
             //                         },
             //                     ],
             //                 },
             //             ],
             //         },
             //     ],
             // },
             // {
             //     label: 'Get Started',
             //     items: [
             //         {
             //             label: 'Documentation',
             //             icon: 'pi pi-fw pi-question',
             //             routerLink: ['/documentation'],
             //         },
             //         {
             //             label: 'View Source',
             //             icon: 'pi pi-fw pi-search',
             //             url: ['https://github.com/primefaces/sakai-ng'],
             //             target: '_blank',
             //         },
             //     ],
             // },
         ];

        if(this.role == "admin"){
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
                }
            );
        }else if(this.role == "staff" || this.role =="doctor"){
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
