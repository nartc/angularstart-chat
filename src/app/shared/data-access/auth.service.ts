import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { defer, from } from 'rxjs';
import { AUTH } from 'src/app/app.config';
import { Credentials } from '../interfaces/credentials';

export type AuthUser = User | null | undefined;

interface AuthState {
	user: AuthUser;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private auth = inject(AUTH);

	// sources
	private user$ = authState(this.auth);

	// state
	private state = signal<AuthState>({
		user: undefined,
	});

	// selectors
	user = computed(() => this.state().user);

	constructor() {
		this.user$.pipe(takeUntilDestroyed()).subscribe((user) =>
			this.state.update((state) => ({
				...state,
				user,
			})),
		);
	}

	login(credentials: Credentials) {
		return from(defer(() => signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)));
	}

	logout() {
		signOut(this.auth);
	}

	createAccount(credentials: Credentials) {
		return from(defer(() => createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password)));
	}
}
