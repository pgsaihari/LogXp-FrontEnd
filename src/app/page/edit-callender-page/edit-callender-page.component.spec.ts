import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCallenderPageComponent } from './edit-callender-page.component';

describe('EditCallenderPageComponent', () => {
  let component: EditCallenderPageComponent;
  let fixture: ComponentFixture<EditCallenderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCallenderPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCallenderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
