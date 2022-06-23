import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StarWarsService } from '../services/star-wars/star-wars.service';
import { MockAServiceComponent } from './mock-a-service.component';

describe('MockAServiceComponent Preferred Way To Mock A Service', () => {
	let component: MockAServiceComponent;
	let fixture: ComponentFixture<MockAServiceComponent>;
	let mockService: jasmine.SpyObj<StarWarsService>;

	beforeEach(async () => {
		mockService = jasmine.createSpyObj(['getStarWarsFilm$']);
		await TestBed.configureTestingModule({
			declarations: [MockAServiceComponent],
			providers: [{ provide: StarWarsService, useValue: mockService }],
		}).compileComponents();

		fixture = TestBed.createComponent(MockAServiceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call service', () => {
		mockService.getStarWarsFilm$.and.returnValue(of('Star Wars'));
		component.onCallServiceButtonClicked();
		expect(mockService.getStarWarsFilm$).toHaveBeenCalledOnceWith(1);
	});
});

describe('MockAServiceComponent Another Way To Mock A Service', () => {
	let component: MockAServiceComponent;
	let fixture: ComponentFixture<MockAServiceComponent>;
	let service: StarWarsService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MockAServiceComponent],
			// If the service has a lot of dependencies this can get much more complex:
			imports: [HttpClientTestingModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MockAServiceComponent);
		component = fixture.componentInstance;
		service = TestBed.inject(StarWarsService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call service', () => {
		spyOn(service, 'getStarWarsFilm$').and.returnValue(of('Star Wars'));
		component.onCallServiceButtonClicked();
		expect(service.getStarWarsFilm$).toHaveBeenCalledOnceWith(1);
	});
});
