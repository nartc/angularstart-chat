import { type ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import {
	connectFirestoreEmulator,
	getFirestore,
	initializeFirestore,
	type Firestore,
} from 'firebase/firestore';
import { createInjectionToken } from 'ngxtension/create-injection-token';
import { environment } from '../environments/environment';

import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

const [injectEnvironment] = createInjectionToken(() => environment);

const [injectFirebaseApp, , , provideFirebaseAppInitializer] =
	createInjectionToken(() => initializeApp(injectEnvironment().firebase));

export const [injectFirebaseAuth] = createInjectionToken(() => {
	const environment = injectEnvironment();
	const auth = getAuth();

	if (environment.useEmulators) {
		connectAuthEmulator(auth, 'http://localhost:9099', {
			disableWarnings: true,
		});
	}

	return auth;
});

export const [injectFirestore] = createInjectionToken(() => {
	const [app, environment] = [injectFirebaseApp(), injectEnvironment()];

	let firestore: Firestore;
	if (environment.useEmulators) {
		firestore = initializeFirestore(app, {});
		connectFirestoreEmulator(firestore, 'localhost', 8080);
	} else {
		firestore = getFirestore();
	}
	return firestore;
});

export const appConfig: ApplicationConfig = {
	providers: [
		provideFirebaseAppInitializer(),
		provideRouter(routes),
		provideAnimations(),
	],
};
