import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';


@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrl: './user-edit.component.scss',
    providers: [MessageService],
})
export class UserEditComponent implements OnInit {
    userForm: FormGroup;
    id: string;

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private toast: MessageService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.userForm = fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', [Validators.email, Validators.required]],
        });
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.api.getUserById(this.id).subscribe((res: any) => {
                console.log(res);
                this.userForm.patchValue({
                    first_name: res.first_name,
                    last_name: res.last_name,
                    email: res.email
                });
            });
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

    submitUser() {
        this.userForm.markAllAsTouched();
        let user = this.userForm.value;

        if (this.userForm.valid) {
            this.api.updateUser(this.id,user).subscribe((res) => {
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Staff updated successfully',
                });
                setTimeout(() => {
                    this.router.navigateByUrl('users');
                }, 2000);
            });
        }
    }
}
