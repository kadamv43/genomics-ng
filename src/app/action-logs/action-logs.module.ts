import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionLogsRoutingModule } from './action-logs-routing.module';
import { ActionLogsListComponent } from './action-logs-list/action-logs-list.component';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@NgModule({
    declarations: [ActionLogsListComponent],
    imports: [
        CommonModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        SliderModule,
        DialogModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        InputTextModule,
        PanelModule,
        ConfirmPopupModule,
        MessageModule,
        MessagesModule,
        DynamicDialogModule,
        ActionLogsRoutingModule,
    ],
})
export class ActionLogsModule {}
