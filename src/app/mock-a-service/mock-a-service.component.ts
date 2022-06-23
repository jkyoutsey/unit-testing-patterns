import { Component } from '@angular/core';
import { StarWarsService } from '../services/star-wars/star-wars.service';

@Component({
	selector: 'app-mock-a-service',
	templateUrl: './mock-a-service.component.html',
	styleUrls: ['./mock-a-service.component.css'],
})
export class MockAServiceComponent {
	constructor(private starWarsService: StarWarsService) {}

	onCallServiceButtonClicked() {
		// http call auto-unsubscribes
		this.starWarsService.getStarWarsFilm$(1).subscribe();
	}
}
