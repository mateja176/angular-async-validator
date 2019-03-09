import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fromPairs } from 'ramda';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs/operators';
import { emailAvailabilityValidator } from './email-availability.validator/email-availability.validator';
import { emails$ } from './emails.service/emails.service';

export const signupFormGroup = {
  name: ['', [Validators.required, Validators.minLength(2)]],
  email: [
    '',
    [Validators.required, Validators.email],
    emailAvailabilityValidator(emails$),
  ],
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  myForm: FormGroup;

  required = {
    name: '*',
    email: '*',
  };

  // errors$: Observable<ValidationErrors>;
  errors$: Observable<any>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.myForm = this.fb.group(signupFormGroup);

    this.required = Object.entries(this.myForm.controls)
      .map(([key, control]) => [key, control.errors])
      .filter(([, errors]) => !errors)
      .map(([key]) => [key as string, ''])
      .reduce(
        (required, [key, isRequired]) => ({ ...required, [key]: isRequired }),
        this.required,
      );

    this.errors$ = this.myForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(() => Object.entries(this.myForm.controls)),
      map(controls =>
        controls.map(([key, control]) => [key, control.errors || {}]),
      ),
      map(errors => fromPairs(errors as any)),
      startWith({
        name: {},
        email: {},
      }),
    );

    this.errors$.subscribe(console.log);
  }

  submit() {
    console.log(this.myForm.value);
  }

  getName() {
    return this.myForm.get('name');
  }

  getEmail() {
    return this.myForm.get('email');
  }
}
