import { AbstractControl, ValidatorFn } from '@angular/forms';

export function matchingFieldsValidation(
  firstControlName: string,
  secondControlName: string
): ValidatorFn {
  return (control: AbstractControl): { [p: string]: any } | null => {
    const firstControl = control.get(firstControlName);
    const secondControl = control.get(secondControlName);

    if (!firstControl || !secondControl) {
      return null;
    }

    if (!firstControl.value || !secondControl.value) {
      return null;
    }

    return firstControl.value == secondControl.value
      ? null
      : {
          matchingFields: true,
        };
  };
}
