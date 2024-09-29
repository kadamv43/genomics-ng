import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadFormComponent } from 'src/app/appointments/file-upload-form/file-upload-form.component';
import { AuthService } from 'src/app/services/auth.service';
import { GalleryImageService } from 'src/app/services/gallery-image/gallery-image.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-gallery-images',
    templateUrl: './gallery-images.component.html',
    styleUrl: './gallery-images.component.scss',
    providers: [DialogService, MessageService],
})
export class GalleryImagesComponent implements OnInit {
    images: any = [];

    role = '';
    id: string;
    uploadPath = environment.uploadPath;

    ref: DynamicDialogRef | undefined;
    activeIndex: number = 0;
    displayCustom: boolean | undefined;

    constructor(
        private authService: AuthService,
        private dialogService: DialogService,
        private route: ActivatedRoute,
        private galleryImageService: GalleryImageService,
        private toast:MessageService
    ) {}

    ngOnInit() {
        this.role = this.authService.getRole();
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.getImages(this.id)
            this.galleryImageService.findById(this.id).subscribe((res) => {
                this.images = res;
            });
        });
    }

    getImages(id) {
        this.galleryImageService.findById(id).subscribe((res) => {
            this.images = res;
        });
    }

    openDialog(id: string) {
        this.ref = this.dialogService.open(FileUploadFormComponent, {
            data: {
                id,
                fileNameInput: false,
                fileTypes: '.png,.jpg,.jpeg,.JPEG',
                fileUploadUrl: 'gallery-images/' + id,
            },
            header: 'File Upload',
        });
    }

    imageClick(index: number) {
        this.activeIndex = index;
        this.displayCustom = true;
    }

    delete(id) {
        this.galleryImageService.delete(id).subscribe((res) => {
            this.toast.add({
                key: 'tst',
                severity: 'error',
                summary: 'deleted ',
                detail: 'image deleted successfully',
            });
            this.getImages(this.id)
            console.log(res);
        });
    }
}
