import { TestBed } from '@angular/core/testing';

import { PoultryHttpService } from './poultry-http.service';

describe('PoultryHttpService', () => {
  let service: PoultryHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoultryHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
