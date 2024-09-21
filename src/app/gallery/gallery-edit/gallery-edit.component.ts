import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GalleryService } from 'src/app/services/gallery/gallery.service';

@Component({
    selector: 'app-gallery-edit',
    templateUrl: './gallery-edit.component.html',
    styleUrl: './gallery-edit.component.scss',
    providers:[MessageService]
})
export class GalleryEditComponent {
    galleryForm: FormGroup;
    id;
    blog;

    statusList = [
        { name: 'Active', code: 'Active' },
        { name: 'Inactive', code: 'Inactive' },
    ];

    constructor(
        private galleryService: GalleryService,
        private toast: MessageService,
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.galleryForm = this.fb.group({
            name: ['', Validators.required],
            status: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.galleryService.findById(this.id).subscribe((res: any) => {
                this.blog = res;
                this.galleryForm.patchValue({
                    name: res?.name,
                    status:res?.status
                });
            });
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
            this.galleryService.update(this.id, this.galleryForm.value).subscribe((res) => {
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Gallery Updated successfully',
                });
                setTimeout(() => {
                    this.router.navigateByUrl('gallery');
                }, 2000);
            });
        }
    }
}
