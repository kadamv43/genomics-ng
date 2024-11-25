import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Component({
    selector: 'app-file-upload-form',
    templateUrl: './file-upload-form.component.html',
    styleUrl: './file-upload-form.component.scss',
    providers: [MessageService],
})
export class FileUploadFormComponent implements OnInit {
    // fileUploadUrl = environment.baseUrl + 'appointments/upload-files';
    fileUploadUrl = '';
    fileNameInput = false;
    acceptedFiles: string = '.pdf, .jpg, .png';
    constructor(
        private messageService: MessageService,
        private dialogConfig: DynamicDialogConfig,
        private dialogService: DialogService,
        private http: HttpService
    ) {}

    ngOnInit() {
        this.fileNameInput = this.dialogConfig.data.fileNameInput;;
        this.fileUploadUrl =
            this.fileUploadUrl + '/' + this.dialogConfig.data.id;
        this.acceptedFiles = this.dialogConfig.data.fileTypes;
        this.fileUploadUrl = this.dialogConfig.data?.fileUploadUrl;
    }

    file_name = '';

    uploadedFiles: any[] = [];

    onBeforeUpload(event) {
        if (this.file_name == '') {
            return;
        }
        event.formData.append('file_name', this.file_name);
    }

    async onUpload(event: any) {
        // Access the uploaded file from the event
        const uploadedFiles = event.files
        // Create form data for the uploaded file
        const formData = new FormData();
        uploadedFiles.forEach((file) => {
            formData.append('files', file);
        });

        await lastValueFrom(this.http.postWithFormData(this.fileUploadUrl, formData))


        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File Uploaded',
        })

        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy()
        });
        
        setTimeout(() => {
             location.reload();
        }, 2000);
        //
    }
}
