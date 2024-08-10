import { Component } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { concatMap, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

interface Role {
    name: string;
    code: string;
}
@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    styleUrl: './user-create.component.scss',
    providers: [MessageService],
})
export class UserCreateComponent {
    userForm: FormGroup;

    roles: Role[] = [
        { name: 'Staff', code: 'staff' },
        { name: 'Doctor', code: 'doctor' },
    ];

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private toast: MessageService,
        private router: Router
    ) {
        this.userForm = fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', [Validators.email, Validators.required]],
            role: ['', Validators.required],
        });
    }

    get first_name() {
        return this.userForm.get('first_name');
    }
    get last_name() {
        return this.userForm.get('last_name');
    }
    get email() {
        return this.userForm.get('email');
    }
    get role() {
        return this.userForm.get('role');
    }

    async submitUser() {
        this.userForm.markAllAsTouched();
        let user = this.userForm.value;
        user.password = 'pass';
        user.phone = "";

        if (this.userForm.valid) {
            this.api.createUser(user).subscribe((res:any) => {
                if (user.role == 'doctor') {
                    user.user_id = res._id;
                    this.api.createDoctor(user).subscribe(() => {
                        this.toast.add({
                            key: 'tst',
                            severity: 'success',
                            summary: 'Success Message',
                            detail: 'User added successfully',
                        });
                        setTimeout(() => {
                            this.router.navigateByUrl('users');
                        }, 2000);
                    });
                }else{
                    this.toast.add({
                        key: 'tst',
                        severity: 'success',
                        summary: 'Success Message',
                        detail: 'User added successfully',
                    });
                    setTimeout(() => {
                        this.router.navigateByUrl('users');
                    }, 2000);
                }
            });
        }
    }
}
