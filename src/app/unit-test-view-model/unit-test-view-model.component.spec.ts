import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitTestViewModelComponent } from './unit-test-view-model.component';

describe('UnitTestViewModelComponent', () => {
	let component: UnitTestViewModelComponent;
	let fixture: ComponentFixture<UnitTestViewModelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UnitTestViewModelComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(UnitTestViewModelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
