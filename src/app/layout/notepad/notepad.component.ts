import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
    selector: 'app-notepad',
    templateUrl: './notepad.component.html',
    styleUrl: './notepad.component.scss',
    providers: [MessageService],
})
export class NotepadComponent implements OnInit {
    note = '';

    constructor(
        private userService: UsersService,
        private api: ApiService,
        private toast: MessageService
    ) {}

    ngOnInit(): void {
        this.userService.getUserDetails().subscribe({
            next: (res: any) => {
                this.note = res?.note;
                console.log(res);
            },
        });
    }

    save() {
        this.userService.updateNote({ note: this.note }).subscribe({
            next: (res) => {
                this.toast.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Success Message',
                    detail: 'Data Saved successfully',
                });
                console.log(res);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
