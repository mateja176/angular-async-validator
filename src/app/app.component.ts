import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fromPairs } from 'ramda';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { emailAvailabilityValidator } from './email-availability.validator/email-availability.validator';
import { emails$ } from './emails.service/emails.service';

export const getObservableFormFieldProperty = (form: FormGroup) => (
  property: keyof AbstractControl,
) =>
  form.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    map(() => Object.entries(form.controls)),
    map(controls =>
      controls.map(([key, control]) => [key, control[property] || {}]),
    ),
    map(prop => fromPairs(prop as any)),
  );

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

  dirty$: Observable<any>;

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

    this.myForm.valueChanges.subscribe(() => console.log(this.myForm));

    const observeProperty = getObservableFormFieldProperty(this.myForm);

    this.errors$ = observeProperty('errors');

    this.dirty$ = observeProperty('dirty');
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
