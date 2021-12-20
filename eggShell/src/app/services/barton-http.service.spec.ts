import { TestBed } from '@angular/core/testing';

import { BartonHttpService } from './barton-http.service';

describe('BartonHttpService', () => {
  let service: BartonHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BartonHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
