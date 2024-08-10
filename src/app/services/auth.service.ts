import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private router: Router) {}

    // Mock function to check if the user is logged in
    isLoggedIn(): boolean {
       
        // Implement actual logic to check if the user is logged in
        // For example, check if there's a valid JWT token in local storage
        return !!localStorage.getItem('token');
    }

    login(token: string): void {
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
    }

    getRole(){
        return localStorage.getItem("role")
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigateByUrl('auth/login');
    }
}
