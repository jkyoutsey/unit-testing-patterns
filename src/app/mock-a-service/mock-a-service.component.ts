import { Component } from '@angular/core';
import { JustAService } from '../services/just-a/just-a.service';

@Component({
	selector: 'app-mock-a-service',
	templateUrl: './mock-a-service.component.html',
	styleUrls: ['./mock-a-service.component.css'],
})
export class MockAServiceComponent {
	constructor(private justAService: JustAService) {}

	onCallServiceButtonClicked() {
		// http call auto-unsubscribes
		this.justAService.getStarWarsFilm$(1).subscribe();
	}
}
