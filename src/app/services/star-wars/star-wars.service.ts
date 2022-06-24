import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, firstValueFrom, from, map, Observable, of, throwError } from 'rxjs';
import { StarWarsCharacter } from './star-wars-character';
import { StarWarsFilm } from './star-wars-film';

@Injectable({
	providedIn: 'root',
})
export class StarWarsService {
	private allCharacters: StarWarsCharacter[] = [];

	constructor(private http: HttpClient) {}

	getFilms$(): Observable<StarWarsFilm[]> {
		return this.http.get<{ results: StarWarsFilm[] }>(`https://swapi.dev/api/films`).pipe(
			map(result => result.results),
			catchError((e: HttpErrorResponse) => {
				return throwError(() => e.message);
			})
		);
	}

	getCharactersInFilm$(film: StarWarsFilm): Observable<StarWarsCharacter[]> {
		if (this.allCharacters.length > 0) {
			return of(this.allCharacters);
		}

		// This is a terrible API for this since there is no way to query for all of the data at once.
		return from(
			this.getAllPagesRecursively('https://swapi.dev/api/people').then(results =>
				Promise.resolve(results.filter(r => r.films.some(url => url === film.url)))
			)
		);
	}

	getStarWarsFilm$(filmNumber: number): Observable<unknown> {
		return this.http.get<unknown>(`https://swapi.dev/api/films/${filmNumber}/`).pipe(
			catchError((e: HttpErrorResponse) => {
				return throwError(() => e.message);
			})
		);
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

		this.allCharacters = characters;
		return characters;
	}

	// Get a single page of data.
	private async getPage(url: string) {
		return firstValueFrom(this.http.get<{ next: string; results: StarWarsCharacter[] }>(url));
	}
}
