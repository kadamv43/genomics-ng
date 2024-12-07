import { Component, NgZone } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
})
export class AppFooterComponent {
    statusMessage = 'Ready';
    progress: { percent: number; transferred: number; total: number } | null =
        null;
    updateReady = false;

    appVersion = '';

    ngOnInit(): void {
        this.getAppVersion();
    }

    constructor(private zone: NgZone, public layoutService: LayoutService) {
        this.listenForUpdates();
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
}
