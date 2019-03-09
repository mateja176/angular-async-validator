# Form Behavior

## Cons of adding an the `&& formControl.touched` conditional to a form field error messages

- does not work well with async validators

- does not inform the user of a field being required

## Cons of displaying a `{{ FieldName }} is required message` immediately

- It is pushy

## Cons of prefixing required fields with an "\*"

- It is less declarative

## Default form field errors

### Cons

- They do not have `debounceTime` or `distinctUntilChanged` and can appear pushy

## Pros

- The error message can help the user while they are typing
