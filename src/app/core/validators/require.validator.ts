import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const requireNotEmptyValidator: ValidatorFn = ({ value }: AbstractControl): ValidationErrors | null => {
  return value.toString().trim().length ? null : { requireNotEmpty: true };
};

export const requireNumberValidator: ValidatorFn = ({ value }: AbstractControl): ValidationErrors | null => {
  return typeof +value === 'number' && !Number.isNaN(+value) ? null : { requireNumber: true };
};
