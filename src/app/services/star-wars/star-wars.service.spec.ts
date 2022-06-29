import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { take, tap } from 'rxjs';
import { StarWarsCharacter } from './star-wars-character';
import { StarWarsFilm } from './star-wars-film';
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

	it('should handle getStarWarsFilm$ success', () => {
		service.getStarWarsFilm$(1).subscribe({
			next: film => expect(film).toBeDefined(),
			error: fail,
		});
		controller.expectOne('https://swapi.dev/api/films/1/').flush('');
	});

	it('should handle getStarWarsFilm$ failure', () => {
		service.getStarWarsFilm$(1).subscribe({
			next: fail,
			error: e => expect(e).toBeDefined(),
		});
		controller.expectOne('https://swapi.dev/api/films/1/').error(new ProgressEvent('error'));
	});

	const expectLoading$ToBe = (loading: boolean) => {
		service.loading$
			.pipe(
				take(1),
				tap(l => expect(l).toEqual(loading))
			)
			.subscribe();
	};

	it('should cycle loading$ when films load', () => {
		service.loadFilms();
		expectLoading$ToBe(true);
		controller.expectOne('https://swapi.dev/api/films').flush('');
		expectLoading$ToBe(false);
	});

	it('should cycle loading$ when characters load', fakeAsync(() => {
		const filmUrlMatch = 'match';
		service.loadCharactersInFilm({ url: filmUrlMatch } as StarWarsFilm);
		expectLoading$ToBe(true);
		controller.expectOne('https://swapi.dev/api/people').flush({
			next: null,
			results: [{ films: [''] }, { films: ['', filmUrlMatch, ''] }],
		});
		flush();
		expectLoading$ToBe(false);
	}));

	const expectFilms$ToBe = (films: Partial<StarWarsFilm>[]) => {
		expect(service.films$).toBeObservable(cold('a', { a: films }));
	};

	it('should emit films$ on loadFilms success', () => {
		expectFilms$ToBe([]);
		const expectedFilms = [{ title: 'Star Wars' }, { title: 'Empire' }] as StarWarsFilm[];
		service.loadFilms();
		controller.expectOne('https://swapi.dev/api/films').flush({ results: expectedFilms });
		expectFilms$ToBe(expectedFilms);

		// or (but the marbles seem cleaner to me, and they allow us to test at multiple points easier)
		service.films$.pipe(take(1)).subscribe({
			next: films => expect(films).toEqual(expectedFilms),
			error: fail,
		});
	});
});
