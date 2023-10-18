import { Component, effect, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/shared/data-access/auth.service';
import { LoginService } from './data-access/login.service';
import { LoginFormComponent } from './ui/login-form.component';

@Component({
	standalone: true,
	selector: 'app-login',
	template: `
		<div class="container gradient-bg">
			@if(authService.user() !== undefined){ @defer (on timer(50)) {
			<app-login-form [loginStatus]="loginService.status()" (login)="loginService.login$.next($event)" />
			<a routerLink="/auth/register">Create account</a>
			} } @else {
			<mat-spinner diameter="50" />
			}
		</div>
	`,
	providers: [LoginService],
	imports: [RouterModule, LoginFormComponent, MatProgressSpinnerModule],
	styles: [
		`
			a {
				margin: 2rem;
				color: var(--accent-darker-color);
			}
		`,
	],
})
export default class LoginComponent {
	public loginService = inject(LoginService);
	public authService = inject(AuthService);
	private router = inject(Router);

	constructor() {
		effect(() => {
			if (this.authService.user()) {
				this.router.navigate(['home']);
			}
		});
	}
}
