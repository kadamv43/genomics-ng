import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-product-create',
    templateUrl: './product-create.component.html',
    styleUrl: './product-create.component.scss',
    providers: [MessageService],
})
export class ProductCreateComponent {
    productForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private toast: MessageService,
        private router: Router
    ) {
        this.productForm = fb.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
        });
    }

    get name() {
        return this.productForm.get('name');
    }
    get price() {
        return this.productForm.get('price');
    }

    submitUser() {
        this.productForm.markAllAsTouched();
        let product = this.productForm.value;

        if (this.productForm.valid) {
            this.api.createProduct(product).subscribe((res) => {
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Service added successfully',
                });
                setTimeout(() => {
                    this.router.navigateByUrl('products');
                }, 2000);
            });
        }
    }
}
