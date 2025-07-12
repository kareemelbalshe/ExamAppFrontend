import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExam } from './edit-exam';

describe('EditExam', () => {
  let component: EditExam;
  let fixture: ComponentFixture<EditExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
