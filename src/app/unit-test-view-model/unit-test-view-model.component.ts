import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, map, Subject, takeUntil, tap } from 'rxjs';
import { StarWarsCharacter } from '../services/star-wars/star-wars-character';
import { StarWarsFilm } from '../services/star-wars/star-wars-film';
import { StarWarsService } from '../services/star-wars/star-wars.service';

@Component({
	selector: 'app-unit-test-view-model',
	templateUrl: './unit-test-view-model.component.html',
	styleUrls: ['./unit-test-view-model.component.css'],
})
export class UnitTestViewModelComponent {
	protected form = new FormGroup({
		film: new FormControl<StarWarsFilm | null>(null),
		character: new FormControl<StarWarsCharacter | null>(null),
	});

	protected vm$ = combineLatest([
		this.starWarsService.films$,
		this.starWarsService.characters$,
		this.starWarsService.loading$,
	]).pipe(
		map(([films, characters, loading]) => ({
			films,
			characters,
			loading,
		}))
	);

	private destroyed$ = new Subject<boolean>();

	constructor(private starWarsService: StarWarsService) {}

	ngOnInit() {
		this.starWarsService.loadFilms();
		this.form.controls.film.valueChanges
			.pipe(
				takeUntil(this.destroyed$),
				tap(film => this.starWarsService.loadCharactersInFilm(film))
			)
			.subscribe();
	}

	ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
