import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercalendarComponent } from './usercalendar.component';

describe('UsercalendarComponent', () => {
  let component: UsercalendarComponent;
  let fixture: ComponentFixture<UsercalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsercalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsercalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
