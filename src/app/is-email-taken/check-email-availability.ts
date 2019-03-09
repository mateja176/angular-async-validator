import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { isEmailTaken } from './is-email-taken';

export const checkEmailAvailability = (emails$: Observable<string[]>) => (
  emailField: AbstractControl,
) =>
  emails$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    isEmailTaken(emailField.value),
  );
