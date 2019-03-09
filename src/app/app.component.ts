import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  myForm: FormGroup;
  formValid$: Observable<boolean>;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    const emails$ = this.http
      .get<{ email: string }[]>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        mergeMap(users => users),
        map(user => user.email),
        tap(console.log),
      );

    emails$.subscribe();

    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        // checkEmailAvailability(emails$),
      ],
    });

    this.formValid$ = this.myForm.statusChanges.pipe(
      map(status => status === 'VALID'),
    );
  }
}
