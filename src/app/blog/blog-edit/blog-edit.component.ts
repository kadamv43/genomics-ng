import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BlogsService } from 'src/app/services/blogs/blogs.service';


@Component({
    selector: 'app-blog-edit',
    templateUrl: './blog-edit.component.html',
    styleUrl: './blog-edit.component.scss',
    providers: [MessageService],
})
export class BlogEditComponent implements OnInit {
    blogForm: FormGroup;
    id;
    blog;

    constructor(
        private blogService: BlogsService,
        private toast: MessageService,
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.blogForm = this.fb.group({
            title: ['', Validators.required],
            image: [''],
            status: ['', Validators.required],
            description: ['', [Validators.required]],
        });
    }

    statusList = [
        { name: 'Active', code: 'Active' },
        { name: 'Inactive', code: 'Inactive' },
    ];

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.blogService.findById(this.id).subscribe((res: any) => {
                this.blog = res;
                this.blogForm.patchValue({
                    title: res?.title,
                    status: res?.status,
                    description: res?.description,
                });
            });
        });
    }

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
            this.blogService.update(this.id,formData).subscribe((res) => {
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Blog Updated successfully',
                });
                setTimeout(() => {
                    this.router.navigateByUrl('blogs');
                }, 2000);
            });
        }
    }
}
