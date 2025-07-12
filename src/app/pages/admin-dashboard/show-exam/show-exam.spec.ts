import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowExam } from './show-exam';

describe('ShowExam', () => {
  let component: ShowExam;
  let fixture: ComponentFixture<ShowExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowExam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
