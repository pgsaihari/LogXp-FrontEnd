import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWidgetCardsComponent } from './user-widget-cards.component';

describe('UserWidgetCardsComponent', () => {
  let component: UserWidgetCardsComponent;
  let fixture: ComponentFixture<UserWidgetCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWidgetCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWidgetCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
