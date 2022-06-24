import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {LetModule} from '@ngrx/component';
import { firstValueFrom, of } from 'rxjs';
import { StarWarsCharacter } from '../services/star-wars/star-wars-character';
import { StarWarsFilm } from '../services/star-wars/star-wars-film';
import { StarWarsService } from '../services/star-wars/star-wars.service';
import { UnitTestViewModelComponent } from './unit-test-view-model.component';

describe('UnitTestViewModelComponent', () => {
	let component: UnitTestViewModelComponent;
	let fixture: ComponentFixture<UnitTestViewModelComponent>;
	let mockStarWarsService: jasmine.SpyObj<StarWarsService>;

	const mockFilms = [
		{
			title: 'A New Hope',
			url: '0',
		},
		{
			title: 'The Empire Strikes Back',
			url: '1',
		},
	] as StarWarsFilm[];

	const mockCharacters = [
		{
			name: 'Scruffy-looking Nerf Herder',
			films: ['0', '1'],
		},
	] as StarWarsCharacter[];

	beforeEach(async () => {
		mockStarWarsService = jasmine.createSpyObj<StarWarsService>([
			'getStarWarsFilm$',
			'getFilms$',
			'getCharactersInFilm$',
		]);

		mockStarWarsService.getFilms$.and.returnValue(of(mockFilms));

		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, MatSelectModule, MatFormFieldModule, NoopAnimationsModule, LetModule],
			declarations: [UnitTestViewModelComponent],
			providers: [{ provide: StarWarsService, useValue: mockStarWarsService }],
		}).compileComponents();

		fixture = TestBed.createComponent(UnitTestViewModelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load films', async () => {
		expect(mockStarWarsService.getFilms$).toHaveBeenCalledTimes(1);
		expect(await firstValueFrom(component['vm$'])).toEqual({ films: mockFilms, characters: null });
	});

	fit('should get characters when selected film changes', () => {
		console.log('START');
		const characterState = { films: mockFilms, characters: mockCharacters };
		mockStarWarsService.getCharactersInFilm$.and.returnValue(of(mockCharacters));
		component['form'].controls.film.setValue(mockFilms[0]);

		component['vm$']
			// .pipe(
			// 	filter(state => !!state.characters),
			// 	take(1)
			// )
			.subscribe({
				next: vm => expect(vm).toEqual(characterState),
			});

		expect(mockStarWarsService.getCharactersInFilm$).toHaveBeenCalledOnceWith(mockFilms[0]);
		console.log('END');
	});
});
