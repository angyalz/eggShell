import { TestBed } from '@angular/core/testing';

import { BartonService } from './barton.service';

describe('BartonService', () => {
  let service: BartonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BartonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
