import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: [MessageService],
})
export class LoginComponent {
    valCheck: string[] = ['remember'];

    display = false;

    loginForm: FormGroup;

    constructor(
        public layoutService: LayoutService,
        private fb: FormBuilder,
        private apiService: ApiService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.loginForm = fb.group({
            username: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    get username() {
        return this.loginForm.get('username');
    }

    get password() {
        return this.loginForm.get('password');
    }

    login() {
        this.loginForm.markAllAsTouched();
        if (this.loginForm.valid) {
            this.apiService.login(this.loginForm.value).subscribe(
                (res: any) => {
                    let token = res.token;
                    this.apiService
                        .getAuthUserDetails(token)
                        .subscribe((res: any) => {
                            localStorage.setItem('token', token);
                            localStorage.setItem('role', res.role);
                            this.router.navigateByUrl('/');
                        });
                },
                (err) => {
                    if (err.status == 401) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Login failed',
                            detail: 'Invalid Credentials',
                        });

                        setTimeout(() => {
                            this.messageService.clear();
                        }, 3000);
                    }
                }
            );
        }
    }
    goTo(url){
        this.router.navigateByUrl(url)
    }
}
