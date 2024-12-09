import { Component, NgZone } from '@angular/core';

@Component({
    selector: 'app-update-modal',
    templateUrl: './update-modal.component.html',
    styleUrl: './update-modal.component.scss',
})
export class UpdateModalComponent {
    statusMessage = 'Ready';
    progress: { percent: number; transferred: number; total: number } | null =
        null;
    updateReady = false;

    constructor(private zone: NgZone) {
        if (this.isElectronApp()) {
        this.listenForUpdates();
        }
    }

    checkForUpdates() {
        (window as any)?.electron.checkForUpdates();
    }

    installUpdate() {
        (window as any)?.electron.installUpdate();
    }

    isElectronApp(): boolean {
        return !!(window && (window as any).electron);
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
}
