import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-cheque-details',
    templateUrl: './cheque-details.component.html',
    styleUrl: './cheque-details.component.scss',
})
export class ChequeDetailsComponent implements OnInit {
    form: FormGroup;

    constructor(private fb: FormBuilder, private ref: DynamicDialogRef) {
        this.form = fb.group({
            account_holder: ['', Validators.required],
            bank_name: ['', Validators.required],
            branch_name: ['', Validators.required],
            cheque_number: ['', Validators.required],
            cheque_amount: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        let cheque = localStorage.getItem('cheque')
            ? JSON.parse(localStorage.getItem('cheque'))
            : [];

        if (cheque) {
            this.form.patchValue({
                account_holder: cheque?.account_holder,
                bank_name: cheque?.bank_name,
                branch_name: cheque?.branch_name,
                cheque_number: cheque?.cheque_number,
                cheque_amount: cheque?.cheque_amount,
            });
        }
    }

    get account_holder() {
        return this.form.get('account_holder');
    }

    get bank_name() {
        return this.form.get('bank_name');
    }

    get branch_name() {
        return this.form.get('branch_name');
    }

    get cheque_number() {
        return this.form.get('cheque_number');
    }

    get cheque_amount() {
        return this.form.get('cheque_amount');
    }

    onSubmit() {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            localStorage.setItem('cheque', JSON.stringify(this.form.value));
            this.ref.close();
        }
    }
}
