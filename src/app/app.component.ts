import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import toPairs from 'ramda/es/toPairs';
import { Observable } from 'rxjs';
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

    this.errors$ = this.myForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(() =>
        toPairs(this.myForm.controls).reduce(
          (errors, [key, value]) => ({ ...errors, [key]: value.errors }),
          {},
        ),
      ),
    );

    this.errors$.subscribe(console.log);
  }
}
