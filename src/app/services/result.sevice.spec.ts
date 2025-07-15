import { TestBed } from '@angular/core/testing';

import { ResultSevice } from './result.sevice';

describe('ResultSevice', () => {
  let service: ResultSevice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultSevice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
