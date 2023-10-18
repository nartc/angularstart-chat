import { signal } from '@angular/core';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	type User,
} from 'firebase/auth';
import { connect } from 'ngxtension/connect';
import { createInjectionToken } from 'ngxtension/create-injection-token';
import { authState } from 'rxfire/auth';
import { defer } from 'rxjs';
import { injectFirebaseAuth } from 'src/app/app.config';
import { type Credentials } from '../interfaces/credentials';

export type AuthUser = User | null | undefined;

export const [injectAuthService] = createInjectionToken(() => {
	const auth = injectFirebaseAuth();

	// source$
	const user$ = authState(auth);

	// state
	const user = signal<AuthUser>(undefined);

	// reducer
	connect(user, user$);

	return {
		user: user.asReadonly(),
		login: (credentials: Credentials) => {
			return defer(() =>
				signInWithEmailAndPassword(
					auth,
					credentials.email,
					credentials.password,
				),
			);
		},
		logout: () => {
			signOut(auth);
		},
		createAccount: (credentials: Credentials) => {
			return defer(() =>
				createUserWithEmailAndPassword(
					auth,
					credentials.email,
					credentials.password,
				),
			);
		},
	};
});
