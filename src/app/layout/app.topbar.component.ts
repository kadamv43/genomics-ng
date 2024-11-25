import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '../services/auth.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotepadComponent } from './notepad/notepad.component';
import { ElectronService } from '../services/electron.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [DialogService],
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
        public dialogService: DialogService,
        private electornService:ElectronService
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

    async checkForUpdates() {
        const updateStatus = await this.electornService.checkForUpdate();

        if (updateStatus.updateAvailable) {
            const confirmUpdate = confirm(
                `Update available (v${updateStatus.version}). Download now?`
            );
            if (confirmUpdate) {
                const result = await this.electornService.downloadUpdate(
                    updateStatus
                );
                if (result.success) {
                    alert('Update downloaded. Restarting...');
                    (window as any).electron.app.relaunch();
                } else {
                    alert(`Update failed: ${result.error}`);
                }
            }
        } else {
            alert('No updates available.');
        }
    }
}
