import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GalleryService } from 'src/app/services/gallery/gallery.service';

@Component({
    selector: 'app-gallery-create',
    templateUrl: './gallery-create.component.html',
    styleUrl: './gallery-create.component.scss',
    providers: [MessageService],
})
export class GalleryCreateComponent {
    galleryForm: FormGroup;

    statusList = [
        { name: 'Active', code: 'Active' },
        { name: 'Inactive', code: 'Inactive' },
    ];

    constructor(
        private galleryService: GalleryService,
        private toast: MessageService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.galleryForm = this.fb.group({
            name: ['', Validators.required],
            status: ['', Validators.required],
        });
    }

    get name() {
        return this.galleryForm.get('name');
    }

    get status() {
        return this.galleryForm.get('status');
    }

    async submit() {
        this.galleryForm.markAllAsTouched();
        if (this.galleryForm.valid) {
            this.galleryService.create(this.galleryForm.value).subscribe((res) => {
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Gallery created successfully',
                });
                setTimeout(() => {
                    this.router.navigateByUrl('gallery');
                }, 2000);
            });
        }
    }
}
