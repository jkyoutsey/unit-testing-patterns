import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, map, of, startWith, switchMap, tap } from 'rxjs';
import { StarWarsCharacter } from '../services/star-wars/star-wars-character';
import { StarWarsFilm } from '../services/star-wars/star-wars-film';
import { StarWarsService } from '../services/star-wars/star-wars.service';

@Component({
	selector: 'app-unit-test-view-model',
	templateUrl: './unit-test-view-model.component.html',
	styleUrls: ['./unit-test-view-model.component.css'],
})
export class UnitTestViewModelComponent {
	private films$ = this.starWarsService.getFilms$();

	protected form = new FormGroup({
		film: new FormControl<StarWarsFilm | null>(null),
		character: new FormControl<StarWarsCharacter | null>(null),
	});

	private characters$ = this.form.controls.film.valueChanges.pipe(
		startWith(null),
		switchMap(film => (!!film ? this.starWarsService.getCharactersInFilm$(film) : of(null)))
	);

	protected vm$ = combineLatest([this.films$, this.characters$]).pipe(
		tap(vm => console.dir(vm)),
		map(([films, characters]) => ({
			films,
			characters,
		}))
	);

	constructor(private starWarsService: StarWarsService) {}
}
