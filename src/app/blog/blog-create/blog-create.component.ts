import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { BlogsService } from 'src/app/services/blogs/blogs.service';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'app-blog-create',
    templateUrl: './blog-create.component.html',
    styleUrl: './blog-create.component.scss',
    providers: [MessageService],
})
export class BlogCreateComponent {
    blogForm: FormGroup;

    constructor(
        private blogService: BlogsService,
        private toast: MessageService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.blogForm = this.fb.group({
            title: ['', Validators.required],
            image: ['', Validators.required],
            status: ['', Validators.required],
            description: ['', [Validators.required]],
        });
    }

    statusList = [
        { name: 'Active', code: 'Active' },
        { name: 'Inactive', code: 'Inactive' },
    ];

    get title() {
        return this.blogForm.get('title');
    }
    get image() {
        return this.blogForm.get('image');
    }

    get status() {
        return this.blogForm.get('status');
    }
    get description() {
        return this.blogForm.get('description');
    }

    async submit() {
        this.blogForm.markAllAsTouched();
        if (this.blogForm.valid) {
            const formData = new FormData();
            formData.append('title', this.blogForm.get('title')?.value);
            formData.append('image', this.blogForm.get('image')?.value);
            formData.append(
                'description',
                this.blogForm.get('description')?.value
            );
            formData.append('status', this.blogForm.get('status')?.value);
            this.blogService.create(formData).subscribe((res) => {
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Blog created successfully',
                });
                setTimeout(() => {
                    this.router.navigateByUrl('blogs');
                }, 2000);
            });
        }
    }
}
