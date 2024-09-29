import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BannerService } from 'src/app/services/banner/banner.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-banner-edit',
    templateUrl: './banner-edit.component.html',
    styleUrl: './banner-edit.component.scss',
    providers: [MessageService],
})
export class BannerEditComponent {
    bannerForm: FormGroup;
    imageBasePath = environment.uploadPath;
    id;
    blog;
    existingImage = '';
    selectedFile: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;


    constructor(
        private bannerService: BannerService,
        private toast: MessageService,
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.bannerForm = this.fb.group({
            title: ['', Validators.required],
            image: [''],
            status: ['', Validators.required],
        });
    }

    statusList = [
        { name: 'Active', code: 'Active' },
        { name: 'Inactive', code: 'Inactive' },
    ];

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.bannerService.findById(this.id).subscribe((res: any) => {
                this.blog = res;
                this.existingImage = res?.image;
                this.bannerForm.patchValue({
                    title: res?.title,
                    status: res?.status,
                });
            });
        });
    }

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
            if (this.selectedFile) {
                formData.append(
                    'image',
                    this.selectedFile,
                    this.selectedFile.name
                );
            }

            formData.append('status', this.bannerForm.get('status')?.value);
            this.bannerService.update(this.id, formData).subscribe((res) => {
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Banner Updated successfully',
                });
                setTimeout(() => {
                    this.router.navigateByUrl('banners');
                }, 2000);
            });
        }
    }
}
