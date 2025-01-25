import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(private primengConfig: PrimeNGConfig) {}

    ngOnInit() {
        this.primengConfig.ripple = true;

        if (this.isElectronApp()) {
            this.clearStorage();
        }
    }

    isElectronApp(): boolean {
        return !!(window && (window as any).electron);
    }

    clearStorage() {
        (window as any)?.electron.onClearStorage((progress: any) => {
            localStorage.clear();
            console.log('LocalStorage cleared on app close');
        });
    }
}
