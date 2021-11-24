import { TestBed } from '@angular/core/testing';
import { User } from '../models/user.model';

import { BaseHttpService } from './base-http.service';

describe('BaseHttpService', () => {
  let service: BaseHttpService<User>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
