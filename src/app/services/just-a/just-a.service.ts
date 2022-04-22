import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JustAService {

  constructor(private http: HttpClient) { }

  getStarWarsFilm$(filmNumber: number): Observable<unknown> {
    return this.http.get<unknown>(`https://swapi.dev/api/films/${filmNumber}/`).pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(() => e.message);
      })
    );
  }
}
