import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '../services/auth.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotepadComponent } from './notepad/notepad.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers:[DialogService]
})
export class AppTopBarComponent {
    items!: MenuItem[];

    ref: DynamicDialogRef | undefined;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        public dialogService: DialogService
    ) {}

    logout() {
        this.authService.logout();
    }

    openNotepad() {
        this.ref = this.dialogService.open(NotepadComponent, {
            header: 'Notepad',
            width: '70%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
        });
    }
}
