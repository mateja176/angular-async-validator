import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, tap } from 'rxjs/operators';
import { checkEmailAvailability } from './is-email-taken/check-email-availability';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  myForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    const emails$ = this.http
      .get<any>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        map(users => users.emails),
        tap(console.log),
      );

    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        checkEmailAvailability(emails$),
      ],
    });
  }
}
