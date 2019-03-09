import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, pipe } from 'rxjs';
import { delay, map, mergeMap, toArray } from 'rxjs/operators';

export const usersToEmails = pipe(
  mergeMap((users: { email: string }[]) => users),
  map((user: { email: string }) => user.email),
  toArray(),
);

export const emails$ = of([{ email: 'a@b.c' }]).pipe(
  delay(1000),
  usersToEmails,
);

@Injectable({
  providedIn: 'root',
})
export class EmailsService {
  constructor(private http: HttpClient) {}

  emails$ = this.http
    .get<{ email: string }[]>('https://jsonplaceholder.typicode.com/users')
    .pipe(usersToEmails);
}
