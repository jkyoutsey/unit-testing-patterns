import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, take } from 'rxjs';
import { StarWarsCharacter } from '../services/star-wars/star-wars-character';
import { StarWarsFilm } from '../services/star-wars/star-wars-film';
import { StarWarsService } from '../services/star-wars/star-wars.service';
import { UnitTestViewModelComponent } from './unit-test-view-model.component';

describe('UnitTestViewModelComponent', () => {
	let component: UnitTestViewModelComponent;
	let fixture: ComponentFixture<UnitTestViewModelComponent>;
	let mockStarWarsService: jasmine.SpyObj<StarWarsService>;
	let filmsSubject$: BehaviorSubject<StarWarsFilm[]>;
	let charactersSubject$: BehaviorSubject<StarWarsCharacter[]>;
	let loadingSubject$: BehaviorSubject<boolean>;

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

	const initialState: { films: StarWarsFilm[]; characters: StarWarsCharacter[]; loading: boolean } = {
		films: [],
		characters: [],
		loading: false,
	};

	beforeEach(async () => {
		filmsSubject$ = new BehaviorSubject<StarWarsFilm[]>(initialState.films);
		charactersSubject$ = new BehaviorSubject<StarWarsCharacter[]>(initialState.characters);
		loadingSubject$ = new BehaviorSubject<boolean>(initialState.loading);
		mockStarWarsService = jasmine.createSpyObj<StarWarsService>(
			['getStarWarsFilm$', 'loadFilms', 'loadCharactersInFilm'],
			{
				loading$: loadingSubject$,
				films$: filmsSubject$,
				characters$: charactersSubject$,
			}
		);

		await TestBed.configureTestingModule({
			imports: [
				ReactiveFormsModule,
				NoopAnimationsModule,
				MatSelectModule,
				MatFormFieldModule,
				MatProgressSpinnerModule,
			],
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

	const validateVm$Value = (expected = { ...initialState }) => {
		component['vm$'].pipe(take(1)).subscribe({
			next: vm =>
				expect(vm).toEqual({
					...initialState,
					...expected,
				}),
		});
	};

	it('should load films', () => {
		expect(mockStarWarsService.loadFilms).toHaveBeenCalledTimes(1);
		filmsSubject$.next(mockFilms);
		validateVm$Value({ ...initialState, films: mockFilms });
	});

	it('should get characters when selected film changes', () => {
		filmsSubject$.next(mockFilms);
		component['form'].controls.film.setValue(mockFilms[0]);
		expect(mockStarWarsService.loadCharactersInFilm).toHaveBeenCalledOnceWith(mockFilms[0]);
		charactersSubject$.next(mockCharacters);
		validateVm$Value({ ...initialState, films: mockFilms, characters: mockCharacters });
	});

	it('should have vm connected to loading state', () => {
		loadingSubject$.next(true);
		validateVm$Value({ ...initialState, loading: true });
	});
});
