import { signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { createInjectionToken } from 'ngxtension/create-injection-token';
import { EMPTY, Subject, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { injectAuthService } from 'src/app/shared/data-access/auth.service';
import type { Credentials } from 'src/app/shared/interfaces/credentials';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

export const [injectLoginService, provideLoginService] = createInjectionToken(
	() => {
		const authService = injectAuthService();

		const error$ = new Subject<any>();
		const login$ = new Subject<Credentials>();

		const userAuthenticated$ = login$.pipe(
			switchMap((credentials) =>
				authService.login(credentials).pipe(
					catchError((err) => {
						error$.next(err);
						return EMPTY;
					}),
				),
			),
		);

		const status = signal<LoginStatus>('pending');

		connect(status, userAuthenticated$.pipe(map(() => 'success')));
		connect(status, login$.pipe(map(() => 'authenticating')));
		connect(status, error$.pipe(map(() => 'error')));

		return { status: status.asReadonly(), login$ };
	},
	{ isRoot: false },
);
