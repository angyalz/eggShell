import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationErrorHandlerService {

  constructor() { }
  getErrorMessage(formName: FormGroup, field: string) {

    if (formName.get(field)?.hasError('required')) {
      return 'Kötelezően kitöltendő mező';
    }

    if (formName.get(field)?.hasError('pattern')) {
      switch (field) {
        case 'yearOfBirth':
          return 'csak számokat tartalmazhat';
        case 'firstName':
          return 'csak betűket tartalmazhat';
        case 'lastName':
          return 'csak betűket tartalmazhat';
        case 'nickName':
          return 'csak betűket tartalmazhat';
        case 'city':
          return 'csak betűket tartalmazhat';
        case 'avatarUrl':
          return 'valós URL megadása megadása szükséges';
        case 'password':
          return 'kisbetűt, nagybetűt és számot is kell tartalmaznia ';
        case '':
          return '';
      }
    }

    if (formName.get(field)?.hasError('minlength') || formName.get(field)?.hasError('maxlength')) {
      switch (field) {
        case 'nickName':
          return 'minimum 4 karaktert szükséges megadni';
        case 'firstName':
          return 'minimum 2 karaktert szükséges megadni';
        case 'lastName':
          return 'minimum 2 karaktert szükséges megadni';
        case 'city':
          return 'minimum 3 karaktert szükséges megadni';
        case 'password':
          return 'minimum 8, maximum 32 karaktert tartalmazhat';
        case '':
          return '';
      }
    }

    if (formName.get(field)?.hasError('min') || formName.get(field)?.hasError('max')) {
      switch (field) {
        case 'yearOfBirth':
          return 'valós születési év megadása szükséges';
      }
    }

    if (formName.get(field)?.hasError('email')) {
      return 'valós email cím megadása szükséges';
    }

    if (formName.get(field)?.hasError('match')) {
      return 'a megadott jelszavaknak egyezniük kell';
    }

    if (formName.get(field)?.hasError('passwordStrength')) {
      return 'kisbetűt, nagybetűt és számot kötelező tartalmaznia';
    }

    return 'egyéb validációs hiba';

  }

}
