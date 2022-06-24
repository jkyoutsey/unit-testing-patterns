import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MockAServiceComponent } from './mock-a-service/mock-a-service.component';
import { UnitTestViewModelComponent } from './unit-test-view-model/unit-test-view-model.component';
import {LetModule} from '@ngrx/component';

@NgModule({
	declarations: [AppComponent, MockAServiceComponent, UnitTestViewModelComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		MatSelectModule,
		MatFormFieldModule,
		MatProgressSpinnerModule,
    LetModule
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
