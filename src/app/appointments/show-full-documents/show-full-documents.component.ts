import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-show-full-documents',
    templateUrl: './show-full-documents.component.html',
    styleUrl: './show-full-documents.component.scss',
})
export class ShowFullDocumentsComponent implements OnInit {
    uploadPath = environment.uploadPath;
    constructor(private dialogConfig: DynamicDialogConfig) {}
    doc: any;
    ngOnInit() {
        this.doc = this.dialogConfig.data.doc;
        console.log(this.doc);
    }
}
