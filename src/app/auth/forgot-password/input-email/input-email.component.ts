import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-input-email',
    providers: [MessageService],
    templateUrl: './input-email.component.html',
    styleUrl: './input-email.component.scss',
})
export class InputEmailComponent {
    valCheck: string[] = ['remember'];

    display = false;

    loading = false;

    loginForm: FormGroup;

    constructor(
        public layoutService: LayoutService,
        private fb: FormBuilder,
        private apiService: ApiService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.loginForm = fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    get email() {
        return this.loginForm.get('email');
    }

    checkEmail() {
        this.loginForm.markAllAsTouched();
        if (this.loginForm.valid) {
            this.loading = true;
            this.apiService.userSearchByEmail(this.loginForm.value).subscribe(
                (res: any) => {
                    if (res.length > 0) {
                        let user = res[0];
                        this.apiService
                            .forgotPassword(user._id)
                            .subscribe(() => {
                                this.loading = false;
                                this.router.navigateByUrl(
                                    '/auth/forgot-password/new-password/' +
                                        user._id
                                );
                            });
                    } else {
                        this.loading = false;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'invalid',
                            detail: 'email does not exist!',
                        });

                        setTimeout(() => {
                            this.messageService.clear();
                        }, 3000);
                    }

                    // let token = res.token;
                    // this.apiService
                    //     .getAuthUserDetails(token)
                    //     .subscribe((res: any) => {
                    //         this.router.navigateByUrl('/auth/forgot-password/new-password');
                    //     });
                },
                (err) => {}
            );
        }
    }
    goTo(url) {
        this.router.navigateByUrl(url);
    }
}
