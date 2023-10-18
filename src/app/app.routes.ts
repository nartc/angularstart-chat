import type { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.routes'),
	},
	{
		path: 'home',
		canActivate: [isAuthenticatedGuard()],
		loadComponent: () => import('./home/home.component'),
	},
	{
		path: '',
		redirectTo: 'auth',
		pathMatch: 'full',
	},
];
