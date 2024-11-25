import { Injectable } from '@angular/core';

let fs: typeof import('fs');
let path: typeof import('path');
let dialog: typeof import('@electron/remote').dialog;
let app: typeof import('@electron/remote').app;

@Injectable({
    providedIn: 'root',
})
export class ElectronService {

    checkForUpdate(): Promise<any> {
        return (window as any).electron.ipcRenderer.invoke('check-for-update');
    }

    downloadUpdate(updateInfo: any): Promise<any> {
        return (window as any).electron.ipcRenderer.invoke(
            'download-update',
            updateInfo
        );
    }
}