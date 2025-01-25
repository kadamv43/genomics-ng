import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    private ipcRenderer = (window as any).electron?.ipcRenderer;

    on(channel: string, listener: (event: any, ...args: any[]) => void): void {
        if (!this.ipcRenderer) {
            console.warn('Electron IPC Renderer is not available.');
            return;
        }
        this.ipcRenderer.on(channel, listener);
    }

    checkForUpdate(): Promise<any> {
        if (!this.ipcRenderer) {
            console.error('Electron IPC Renderer is not available.');
            return Promise.reject('Electron IPC Renderer is not available.');
        }
        return this.ipcRenderer?.checkForUpdate;
    }

    downloadUpdate(updateInfo: any): Promise<any> {
        if (!this.ipcRenderer) {
            console.error('Electron IPC Renderer is not available.');
            return Promise.reject('Electron IPC Renderer is not available.');
        }
        return this.ipcRenderer.invoke('download-update', updateInfo);
    }

    relaunchApp() {
        if (!this.ipcRenderer) {
            console.error('Electron IPC Renderer is not available.');
            return;
        }
        (window as any).electron.app.relaunch();
    }

    startUpdate() {
        (window as any).electron?.startUpdate();
    }

    installUpdate() {
        (window as any).electron?.installUpdate();
    }

    onUpdateStatus(callback: (status: string) => void) {
        (window as any).electron?.onUpdateStatus(callback);
    }

    onDownloadProgress(callback: (progress: any) => void) {
        (window as any).electron?.onDownloadProgress(callback);
    }

    downloadInvoice(url) {
        (window as any).electron?.generatePdf(url, 'download');
    }

    printInvoice(url) {
        (window as any).electron?.generatePdf(url, 'print');
    }

    getInvoicePdf(url) {
        (window as any).electron?.generatePdf(url, 'pdfblob');
    }
}
