import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, tap, of, throwError } from 'rxjs';
import { User, UserWithoutPassword } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api/users';
    private currentUserSignal = signal<UserWithoutPassword | null>(null);
    private platformId = inject(PLATFORM_ID);
    private http = inject(HttpClient);

    constructor() {
        this.loadUserFromStorage();
    }

    get currentUser() {
        return this.currentUserSignal.asReadonly();
    }

    get isAuthenticated() {
        return !!this.currentUserSignal();
    }

    register(user: User): Observable<UserWithoutPassword> {
        return this.http.post<User>(this.apiUrl, user).pipe(
            map(u => this.stripPassword(u))
        );
    }

    login(email: string, password: string): Observable<UserWithoutPassword> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
            map(users => {
                if (users.length > 0) {
                    const user = this.stripPassword(users[0]);
                    this.setCurrentUser(user);
                    return user;
                }
                throw new Error('Identifiants invalides');
            })
        );
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('currentUser');
        }
        this.currentUserSignal.set(null);
    }

    updateProfile(user: User): Observable<UserWithoutPassword> {
        return this.http.patch<User>(`${this.apiUrl}/${user.id}`, user).pipe(
            map(u => {
                const updated = this.stripPassword(u);
                this.setCurrentUser(updated);
                return updated;
            })
        );
    }

    deleteAccount(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
            tap(() => this.logout())
        );
    }

    private setCurrentUser(user: UserWithoutPassword) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSignal.set(user);
    }

    private loadUserFromStorage() {
        if (isPlatformBrowser(this.platformId)) {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                try {
                    this.currentUserSignal.set(JSON.parse(storedUser));
                } catch (e) {
                    localStorage.removeItem('currentUser');
                }
            }
        }
    }

    private stripPassword(user: User): UserWithoutPassword {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
