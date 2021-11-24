import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchValidator(name1: string, name2: string): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

        if (!control.value) {
            return null;
        }

        return (<FormGroup>control.parent).get(name1)?.value !== (<FormGroup>control.parent).get(name2)?.value ? { match: true } : null;

    }
}