import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

export const isEmailTaken = (email: string) =>
  pipe(
    map((emails: string[]) => emails.includes(email)),
    map(isTaken => (isTaken ? { emailTaken: true } : null)),
  );
