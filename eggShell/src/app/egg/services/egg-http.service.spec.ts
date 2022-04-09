import { TestBed } from '@angular/core/testing';

import { EggHttpService } from './egg-http.service';

describe('EggHttpService', () => {
  let service: EggHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EggHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
