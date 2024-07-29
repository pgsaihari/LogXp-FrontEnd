import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCallenderComponent } from './edit-callender.component';

describe('EditCallenderComponent', () => {
  let component: EditCallenderComponent;
  let fixture: ComponentFixture<EditCallenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCallenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCallenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
