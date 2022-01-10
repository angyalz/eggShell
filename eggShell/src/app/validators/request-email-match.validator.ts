import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requestEmailMatchValidator(ownEmail: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        console.log('validator value: ', value, '\n', 'ownEmail: ', ownEmail);  //debug

        const emailValid = ownEmail?.toLowerCase() != value.toLowerCase();

        return !emailValid ? { emailMatch: true } : null;
    }
}