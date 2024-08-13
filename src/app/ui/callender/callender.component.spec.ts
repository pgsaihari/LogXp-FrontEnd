import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallenderComponent } from './callender.component';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('CallenderComponent', () => {
  let component: CallenderComponent;
  let fixture: ComponentFixture<CallenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CalendarModule, DialogModule, ButtonModule],
      declarations: [CallenderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open the holiday dialog on date select', () => {
    const testDate = new Date('2024-08-06');
    component.onDateSelect(testDate);
    expect(component.selectedDate).toEqual(testDate);
    expect(component.displayHolidayDialog).toBeTrue();
  });

  it('should set a full holiday', () => {
    const testDate = new Date('2024-08-06');
    component.onDateSelect(testDate);
    component.setHoliday('full');
    expect(component.holidays[testDate.toDateString()]).toEqual('full');
    expect(component.displayHolidayDialog).toBeFalse();
  });

  it('should set a half holiday', () => {
    const testDate = new Date('2024-08-06');
    component.onDateSelect(testDate);
    component.setHoliday('half');
    expect(component.holidays[testDate.toDateString()]).toEqual('half');
    expect(component.displayHolidayDialog).toBeFalse();
  });

  it('should remove a holiday', () => {
    const testDate = new Date('2024-08-06');
    component.onDateSelect(testDate);
    component.setHoliday('full');
    component.removeHoliday();
    expect(component.holidays[testDate.toDateString()]).toBeUndefined();
    expect(component.displayHolidayDialog).toBeFalse();
  });

  it('should return the correct class for a full holiday', () => {
    const testDate = { year: 2024, month: 7, day: 6 }; // August 6, 2024
    const dateKey = new Date(2024, 7, 6).toDateString(); // Key for holidays object
    component.holidays[dateKey] = 'full';
    const holidayClass = component.getHolidayClass(testDate);
    expect(holidayClass).toBe('full-holiday');
  });

  it('should return the correct class for a half holiday', () => {
    const testDate = { year: 2024, month: 7, day: 6 }; // August 6, 2024
    const dateKey = new Date(2024, 7, 6).toDateString(); // Key for holidays object
    component.holidays[dateKey] = 'half';
    const holidayClass = component.getHolidayClass(testDate);
    expect(holidayClass).toBe('half-holiday');
  });

  it('should detect if a date is a Sunday', () => {
    const sundayDate = { year: 2024, month: 7, day: 4 }; // August 4, 2024 is a Sunday
    const isSunday = component.isSunday(sundayDate);
    expect(isSunday).toBeTrue();
  });

  it('should not detect a non-Sunday date as Sunday', () => {
    const nonSundayDate = { year: 2024, month: 7, day: 6 }; // August 6, 2024 is a Tuesday
    const isSunday = component.isSunday(nonSundayDate);
    expect(isSunday).toBeFalse();
  });

  it('should close the holiday dialog when cancel is clicked', () => {
    component.displayHolidayDialog = true;
    fixture.detectChanges();
    const cancelButton = fixture.debugElement.query(By.css('.cancel-btn'));
    cancelButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.displayHolidayDialog).toBeFalse();
  });
});
