import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as R from 'ramda';
import { emailAvailabilityValidator } from './email-availability.validator/email-availability.validator';
import { emails$ } from './emails.service/emails.service';

export interface Required {
  name: boolean;
  email: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  myForm: FormGroup;

  // required: { [key: string]: boolean }; // ? issue with generic object
  required: Required;

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

    this.required = R.pipe(
      R.toPairs,
      R.map(([key, control]) => [key, (control.errors || {}).required]),
      R.map(([key, required]) => [key, required && '*']),
      R.fromPairs,
    )(this.myForm.controls) as any; // Type '{ [index: number]: {}; }' is missing the following properties from type 'Required': name, email
  }
}
