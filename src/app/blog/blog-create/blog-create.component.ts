import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { BlogsService } from 'src/app/services/blogs/blogs.service';
import { environment } from 'src/environments/environment';

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
    imageBasePath = environment.uploadPath;
    selectedFile: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;

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

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0];
        if (this.selectedFile) {
            const reader = new FileReader();

            reader.onload = () => {
                this.imagePreview = reader.result;
            };

            // Read the image file as a data URL
            reader.readAsDataURL(this.selectedFile);
        }
    }

    async submit() {
        this.blogForm.markAllAsTouched();
        if (this.blogForm.valid) {
            const formData = new FormData();
            formData.append('title', this.blogForm.get('title')?.value);
            formData.append('image',this.selectedFile,this.selectedFile.name);
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
