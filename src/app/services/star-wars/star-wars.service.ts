import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	BehaviorSubject,
	catchError,
	finalize,
	firstValueFrom,
	from,
	map,
	Observable,
	of,
	tap,
	throwError,
} from 'rxjs';
import { StarWarsCharacter } from './star-wars-character';
import { StarWarsFilm } from './star-wars-film';

@Injectable({
	providedIn: 'root',
})
export class StarWarsService {
	loading$: Observable<boolean>;
	films$: Observable<StarWarsFilm[]>;
	characters$: Observable<StarWarsCharacter[]>;

	private allCharactersCache: StarWarsCharacter[] = [];
	private loadingSubject$ = new BehaviorSubject<boolean>(false);
	private filmsSubject$ = new BehaviorSubject<StarWarsFilm[]>([]);
	private charactersSubject$ = new BehaviorSubject<StarWarsCharacter[]>([]);

	constructor(private http: HttpClient) {
		this.loading$ = this.loadingSubject$;
		this.films$ = this.filmsSubject$;
		this.characters$ = this.charactersSubject$;
	}

	loadFilms() {
		this.loadingSubject$.next(true);

		this.http
			.get<{ results: StarWarsFilm[] }>(`https://swapi.dev/api/films`)
			.pipe(
				tap(result => this.filmsSubject$.next(result.results)),
				catchError((e: HttpErrorResponse) => {
					return throwError(() => e.message);
				}),
				finalize(() => this.loadingSubject$.next(false))
			)
			.subscribe();
	}

	async loadCharactersInFilm(film: StarWarsFilm | null) {
		if (film == null) {
			return;
		}

		this.loadingSubject$.next(true);
		if (!this.allCharactersCache?.length) {
			await this.getAllPagesRecursively('https://swapi.dev/api/people');
		}

		const charactersInFilm = this.filterToCharactersInFilm(this.allCharactersCache, film);
		this.charactersSubject$.next(charactersInFilm);
		this.loadingSubject$.next(false);
	}

	getStarWarsFilm$(filmNumber: number): Observable<unknown> {
		return this.http.get<unknown>(`https://swapi.dev/api/films/${filmNumber}/`).pipe(
			catchError((e: HttpErrorResponse) => {
				return throwError(() => e.message);
			})
		);
	}

	private filterToCharactersInFilm(allCharacters: StarWarsCharacter[], film: StarWarsFilm): StarWarsCharacter[] {
		return allCharacters.filter(character => character.films.some(url => url === film.url));
	}

	private async getAllPagesRecursively(
		url: string,
		characters: StarWarsCharacter[] = []
	): Promise<StarWarsCharacter[]> {
		const { results, next } = await this.getPage(url);
		characters = [...characters, ...results];

		if (next !== null) {
			return this.getAllPagesRecursively(next, characters);
		}

		this.allCharactersCache = characters;
		return characters;
	}

	// Get a single page of data.
	private async getPage(url: string) {
		return firstValueFrom(this.http.get<{ next: string; results: StarWarsCharacter[] }>(url));
	}
}
