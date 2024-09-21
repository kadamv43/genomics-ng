import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BannerService } from 'src/app/services/banner/banner.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-banner-create',
    templateUrl: './banner-create.component.html',
    styleUrl: './banner-create.component.scss',
    providers: [MessageService],
})
export class BannerCreateComponent {
    bannerForm: FormGroup;
    imageBasePath = environment.uploadPath;
    selectedFile: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;

    constructor(
        private bannerService: BannerService,
        private toast: MessageService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.bannerForm = this.fb.group({
            title: ['', Validators.required],
            image: ['', Validators.required],
            status: ['', Validators.required],
        });
    }

    statusList = [
        { name: 'Active', code: 'Active' },
        { name: 'Inactive', code: 'Inactive' },
    ];

    get title() {
        return this.bannerForm.get('title');
    }
    get image() {
        return this.bannerForm.get('image');
    }

    get status() {
        return this.bannerForm.get('status');
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
        this.bannerForm.markAllAsTouched();
        if (this.bannerForm.valid) {
            const formData = new FormData();
            formData.append('title', this.bannerForm.get('title')?.value);
            formData.append('image', this.selectedFile, this.selectedFile.name);
            formData.append('status', this.bannerForm.get('status')?.value);
            this.bannerService.create(formData).subscribe((res) => {
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Banner created successfully',
                });
                setTimeout(() => {
                    this.router.navigateByUrl('banners');
                }, 2000);
            });
        }
    }
}
