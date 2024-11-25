import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
    providers:[ConfirmationService,MessageService]
})
export class ProductListComponent {
    loading = false;
    products: any = [];
    constructor(
        private api: ApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.api.getProducts().subscribe((res) => {
            this.products = res;
        });
    }

    goTo(url) {
      console.log(url)
        this.router.navigateByUrl(url);
    }

    confirm2(event: Event, product) {
      console.log("ss")
        this.confirmationService.confirm({
            key: 'confirm2',
            target: event.target || new EventTarget(),
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.api.deleteProduct(product._id).subscribe((res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'Service Deleted Successfully',
                    });
                    let removedItemIndex = this.products.findIndex(
                        (item) => item._id == product._id
                    );
                    this.products.splice(removedItemIndex, 1);
                });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'Unable to delete Service',
                });
            },
        });
    }
}
