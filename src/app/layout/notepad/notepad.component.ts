import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
    selector: 'app-notepad',
    templateUrl: './notepad.component.html',
    styleUrl: './notepad.component.scss',
})
export class NotepadComponent implements OnInit {
    note = '';

    constructor(private userService: UsersService, private api: ApiService) {}

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
                console.log(res);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
