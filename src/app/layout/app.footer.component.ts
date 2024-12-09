import { Component, NgZone } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpdateModalComponent } from './update-modal/update-modal.component';

@Component({
    selector: 'app-footer',
    providers:[DialogService],
    templateUrl: './app.footer.component.html',
})
export class AppFooterComponent {
    statusMessage = 'Ready';
    progress: { percent: number; transferred: number; total: number } | null =
        null;
    updateReady = false;

    appVersion = '';

    ref: DynamicDialogRef | undefined;

    ngOnInit(): void {
        this.getAppVersion();
    }

    isElectronApp(): boolean {
        return !!(window && (window as any).electron);
    }

    constructor(
        private zone: NgZone,
        public layoutService: LayoutService,
        public dialogService: DialogService
    ) {
        if (this.isElectronApp()) {
            this.listenForUpdates();
        }
    }

    async getAppVersion() {
        this.appVersion = await (window as any).electron?.ipcRenderer.invoke(
            'get-app-version'
        );
    }

    checkForUpdates() {
        (window as any)?.electron.checkForUpdates();
    }

    installUpdate() {
        (window as any)?.electron.installUpdate();
    }

    listenForUpdates() {
        (window as any)?.electron.onUpdateStatus((message: string) => {
            this.zone.run(() => {
                this.statusMessage = message;
                console.log(message);
                this.updateReady = message.includes('Ready to install');
            });
        });

        (window as any)?.electron.onDownloadProgress((progress: any) => {
            this.zone.run(() => {
                this.progress = {
                    percent: progress.percent,
                    transferred: progress.transferred,
                    total: progress.total,
                };
            });
        });
    }

    openModal() {
        this.ref = this.dialogService.open(UpdateModalComponent, {
            header: 'Pending Balance',
            width: '50%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            data: {
                data: [],
            },
        });
    }
}
