import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-file-upload-form',
    templateUrl: './file-upload-form.component.html',
    styleUrl: './file-upload-form.component.scss',
    providers: [MessageService],
})
export class FileUploadFormComponent implements OnInit {
    fileUploadUrl = environment.baseUrl + 'appointments/upload-files';
    constructor(
        private messageService: MessageService,
        private dialogConfig: DynamicDialogConfig
    ) {}

    ngOnInit() {
        console.log('~ this.dialogConfig.data:', this.dialogConfig.data);
        this.fileUploadUrl =
            this.fileUploadUrl + '/' + this.dialogConfig.data.id;
    }

    file_name = '';
    acceptedFiles: string = '.pdf, .jpg, .png';
    uploadedFiles: any[] = [];

    onBeforeUpload(event) {
        if(this.file_name==""){
            return
        }
        event.formData.append('file_name', this.file_name);
    }

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File Uploaded',
        });
    }
}
