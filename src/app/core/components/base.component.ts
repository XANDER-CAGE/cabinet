import { FormGroup } from '@angular/forms';

export abstract class BaseComponent {
  protected checkValidate(form: FormGroup): boolean {
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
      return false;
    }
    return true;
  }
}
