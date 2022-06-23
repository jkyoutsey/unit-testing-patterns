import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StarWarsService } from './star-wars.service';

describe('StarWarsService', () => {
	let service: StarWarsService;
	let controller: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
		service = TestBed.inject(StarWarsService);
		controller = TestBed.inject(HttpTestingController);
	});

	afterEach(() => controller.verify());

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call correct url', () => {
		service.getStarWarsFilm$(1).subscribe({
			next: film => expect(film).toBeDefined,
			error: fail,
		});
		controller.expectOne('https://swapi.dev/api/films/1/').flush('');
	});

	it('should handle api error', () => {
		service.getStarWarsFilm$(1).subscribe({
			next: fail,
			error: e => expect(e).toBeDefined(),
		});
		controller.expectOne('https://swapi.dev/api/films/1/').error(new ProgressEvent('error'));
	});
});
