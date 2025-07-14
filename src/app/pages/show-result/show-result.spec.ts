import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowResult } from './show-result';

describe('ShowResult', () => {
  let component: ShowResult;
  let fixture: ComponentFixture<ShowResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
