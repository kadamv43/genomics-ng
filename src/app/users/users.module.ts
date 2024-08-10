import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

import { UsersRoutingModule } from './users-routing.module';
import { ToolbarModule } from 'primeng/toolbar';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { UserEditComponent } from './user-edit/user-edit.component';


@NgModule({
    declarations: [
      UserListComponent,
      UserCreateComponent,
      UserEditComponent
    ],
    imports: [
        CommonModule,
        CommonModule,
        FormsModule,
        TableModule,
        ToolbarModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        UsersRoutingModule,
        ReactiveFormsModule,
        MessageModule,
        MessagesModule,
        ConfirmPopupModule
    ],
})
export class UsersModule {}
