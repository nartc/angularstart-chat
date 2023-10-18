import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { injectAuthService } from 'src/app/shared/data-access/auth.service';
import {
	injectRegisterService,
	provideRegisterService,
} from './data-access/register.service';
import { RegisterFormComponent } from './ui/register-form.component';

@Component({
	standalone: true,
	selector: 'app-register',
	template: `
		<div class="container gradient-bg">
			<app-register-form
				[status]="registerService.status()"
				(register)="registerService.createUser$.next($event)"
			/>
		</div>
	`,
	providers: [provideRegisterService()],
	imports: [RegisterFormComponent],
})
export default class RegisterComponent {
	public registerService = injectRegisterService();
	private authService = injectAuthService();
	private router = inject(Router);

	constructor() {
		effect(() => {
			if (this.authService.user()) {
				this.router.navigate(['home']);
			}
		});
	}
}
