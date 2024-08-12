import { Injectable } from '@angular/core';

let fs: typeof import('fs');
let path: typeof import('path');
let dialog: typeof import('@electron/remote').dialog;
let app: typeof import('@electron/remote').app;

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    constructor() {
        // Check if the environment is Electron (not a standard browser)
        if (this.isElectron()) {
            fs = window.require('fs');
            path = window.require('path');
            dialog = window.require('@electron/remote').dialog;
            app = window.require('@electron/remote').app;
        }
    }

    isElectron(): boolean {
        return !!(window && window.process && window.process.type);
    }

    async downloadPdf(data: Blob) {
        if (!this.isElectron()) {
            console.error('This function can only be used in Electron.');
            return;
        }

        const savePath = dialog.showSaveDialogSync({
            title: 'Save PDF',
            defaultPath: path.join(app.getPath('downloads'), 'generated.pdf'),
            filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
        });

        if (savePath) {
            const buffer = Buffer.from(await data.arrayBuffer());
            fs.writeFileSync(savePath, buffer);
        }
    }
}