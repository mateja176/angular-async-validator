import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as R from 'ramda';
import { Observable, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { emailAvailabilityValidator } from './email-availability.validator/email-availability.validator';
import { emails$ } from './emails.service/emails.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  myForm: FormGroup;

  // errors$: Observable<ValidationErrors>; // ? does not accommodate for field names
  errors$: Observable<any>;

  // required: { [key: string]: boolean }; // ? issue with generic object
  required: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [Validators.required, Validators.email],
        emailAvailabilityValidator(emails$),
      ],
    });

    this.required = pipe(
      R.toPairs,
      R.map(([key, value]) => [key, (value.errors || {}).required]),
      R.map(([key, value]) => [key, value && '*']),
      R.fromPairs,
    )(this.myForm.controls);

    this.errors$ = this.myForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(() =>
        pipe(
          R.toPairs,
          R.map(([key, value]) => [key, value.errors]),
          R.fromPairs,
        )(this.myForm.controls),
      ),
    );

    this.errors$.subscribe(console.log);
  }
}
