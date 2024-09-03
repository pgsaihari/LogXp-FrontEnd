import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimePopUpComponent } from './real-time-pop-up.component';

describe('RealTimePopUpComponent', () => {
  let component: RealTimePopUpComponent;
  let fixture: ComponentFixture<RealTimePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealTimePopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealTimePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
