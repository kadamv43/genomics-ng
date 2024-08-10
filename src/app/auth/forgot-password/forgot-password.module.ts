import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { NewPasswordComponent } from './new-password/new-password.component';
import { InputEmailComponent } from './input-email/input-email.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';



@NgModule({
    declarations: [NewPasswordComponent, InputEmailComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MessageModule,
        MessagesModule,
        PasswordModule,
        ButtonModule,
        ForgotPasswordRoutingModule,
        InputTextModule,
    ],
})
export class ForgotPasswordModule {}
