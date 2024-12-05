import { Component } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { ElectronService } from '../services/electron.service';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
})
export class AppFooterComponent {
    constructor(
        private electornService: ElectronService,
        public layoutService: LayoutService
    ) {}

    downloadProgress = 0; // Track download progress

    appVersion = '';

    ngOnInit(): void {
        // Listen for progress updates from the main process
        let progress = (window as any).electron?.ipcRenderer.invoke('progress')
        console.log(progress)

         this.getAppVersion();
    }

    // Get app version from Electron main process
    async getAppVersion() {
        this.appVersion = await(window as any).electron?.ipcRenderer.invoke(
            'get-app-version'
        );
    }

    async checkForUpdates() {
        const updateStatus = await this.electornService.checkForUpdate();

        console.log('updateStatus', updateStatus);

        if (updateStatus.updateAvailable) {
            const confirmUpdate = (window as any).confirm(
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
