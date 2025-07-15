import { TestBed } from '@angular/core/testing';

import { ResultSerivce } from './result.service';

describe('ResultSerivce', () => {
  let service: ResultSerivce;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultSerivce);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
