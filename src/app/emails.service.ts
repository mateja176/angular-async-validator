import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay, map, mergeMap, toArray } from 'rxjs/operators';

export const emails$ = of([{ email: 'a@b.c' }]).pipe(delay(1000));

@Injectable({
  providedIn: 'root',
})
export class EmailsService {
  constructor(private http: HttpClient) {}

  emails$ = this.http
    .get<{ email: string }[]>('https://jsonplaceholder.typicode.com/users')
    .pipe(
      mergeMap(users => users),
      map(user => user.email),
      toArray(),
    );
}
