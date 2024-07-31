import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTraineesPageComponent } from './add-trainees-page.component';

describe('AddTraineesPageComponent', () => {
  let component: AddTraineesPageComponent;
  let fixture: ComponentFixture<AddTraineesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTraineesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTraineesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
