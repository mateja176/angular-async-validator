import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { isEmailTaken } from './is-email-taken';

export const checkEmailAvailability = (emails$: Observable<string[]>) => (
  emailField: AbstractControl,
) => emails$.pipe(isEmailTaken(emailField.value));
