import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

import { injectAuthService } from '../shared/data-access/auth.service';
import { injectMessageService } from '../shared/data-access/message.service';
import { MessageInputComponent } from './ui/message-input.component';
import { MessageListComponent } from './ui/message-list.component';

@Component({
	standalone: true,
	selector: 'app-home',
	template: `
		<div class="container">
			<mat-toolbar color="primary">
				<span class="spacer"></span>
				<button mat-icon-button (click)="authService.logout()">
					<mat-icon>logout</mat-icon>
				</button>
			</mat-toolbar>
			<app-message-list
				[messages]="messageService.messages()"
				[activeUser]="authService.user()"
			/>
			<app-message-input (send)="messageService.add$.next($event)" />
		</div>
	`,
	imports: [
		MessageInputComponent,
		MessageListComponent,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
	],
	styles: [
		`
			.container {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 100%;
			}

			mat-toolbar {
				box-shadow: 0px -7px 11px 0px var(--accent-color);
			}

			app-message-list {
				height: 100%;
				width: 100%;
			}

			app-message-input {
				position: fixed;
				bottom: 0;
			}
		`,
	],
})
export default class HomeComponent {
	messageService = injectMessageService();
	authService = injectAuthService();
	private router = inject(Router);

	constructor() {
		effect(() => {
			if (!this.authService.user()) {
				this.router.navigate(['auth', 'login']);
			}
		});
	}
}
