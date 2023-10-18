import { signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { createInjectionToken } from 'ngxtension/create-injection-token';
import { EMPTY, Subject, catchError, map, switchMap } from 'rxjs';
import { injectAuthService } from 'src/app/shared/data-access/auth.service';
import type { Credentials } from 'src/app/shared/interfaces/credentials';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

export const [injectRegisterService, provideRegisterService] =
	createInjectionToken(
		() => {
			const authService = injectAuthService();

			// sources$
			const error$ = new Subject<any>();
			const createUser$ = new Subject<Credentials>();

			const userCreated$ = createUser$.pipe(
				switchMap((credentials) =>
					authService.createAccount(credentials).pipe(
						catchError((err) => {
							error$.next(err);
							return EMPTY;
						}),
					),
				),
			);

			const status = signal<RegisterStatus>('pending');

			connect(status, userCreated$.pipe(map(() => 'success')));
			connect(status, createUser$.pipe(map(() => 'creating')));
			connect(status, error$.pipe(map(() => 'error')));

			return {
				status: status.asReadonly(),
				createUser$,
			};
		},
		{ isRoot: false },
	);
