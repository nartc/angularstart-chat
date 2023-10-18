import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { Firestore, connectFirestoreEmulator, getFirestore, initializeFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment';

import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

const app = initializeApp(environment.firebase);

export const AUTH = new InjectionToken('Firebase auth', {
	providedIn: 'root',
	factory: () => {
		const auth = getAuth();
		if (environment.useEmulators) {
			connectAuthEmulator(auth, 'http://localhost:9099', {
				disableWarnings: true,
			});
		}
		return auth;
	},
});

export const FIRESTORE = new InjectionToken('Firebase firestore', {
	providedIn: 'root',
	factory: () => {
		let firestore: Firestore;
		if (environment.useEmulators) {
			firestore = initializeFirestore(app, {});
			connectFirestoreEmulator(firestore, 'localhost', 8080);
		} else {
			firestore = getFirestore();
		}
		return firestore;
	},
});

export const appConfig: ApplicationConfig = {
	providers: [provideRouter(routes), provideAnimations()],
};
