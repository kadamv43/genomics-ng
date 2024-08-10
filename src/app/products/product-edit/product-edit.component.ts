import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

interface Product{
  name:string,
  price:string
}

@Component({
    selector: 'app-product-edit',
    templateUrl: './product-edit.component.html',
    styleUrl: './product-edit.component.scss',
    providers: [MessageService],
})
export class ProductEditComponent implements OnInit {
    productForm: FormGroup;
    product: Product;
    id:string

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private toast: MessageService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.productForm = fb.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.api.getProductById(this.id).subscribe((res:any) => {
                console.log(res);
                this.productForm.patchValue({
                    name: res.name,
                    price:res.price
                });
            });
        });
    }

    get name() {
        return this.productForm.get('name');
    }
    get price() {
        return this.productForm.get('price');
    }

    submitProduct() {
        this.productForm.markAllAsTouched();
        let product = this.productForm.value;

        if (this.productForm.valid) {
            this.api.updateProduct(this.id, product).subscribe((res) => {
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Service updated successfully',
                });
                setTimeout(() => {
                    this.router.navigateByUrl('products');
                }, 2000);
            });
        }
    }
}
