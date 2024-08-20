import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetCardComponent } from './widget-card.component';
import { CardModule } from 'primeng/card';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

describe('WidgetCardComponent', () => {
  let component: WidgetCardComponent;
  let fixture: ComponentFixture<WidgetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardModule, WidgetCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render header icon, card number, and card header correctly', () => {
    component.header_icon = 'fa-solid fa-users';
    component.card_number = 452;
    component.card_header = 'Total Employees';
    
    fixture.detectChanges(); // Update the view with the new inputs

    const iconElement = fixture.debugElement.query(By.css('.icon i')).nativeElement;
    const cardNumberElement = fixture.debugElement.query(By.css('.card-number')).nativeElement;
    const cardHeaderElement = fixture.debugElement.query(By.css('.card-header')).nativeElement;

    expect(iconElement.classList).toContain('fa-solid');
    expect(iconElement.classList).toContain('fa-users');
    expect(cardNumberElement.textContent).toContain('452');
    expect(cardHeaderElement.textContent).toContain('Total Employees');
  });

  it('should emit event with correct payload when card is clicked', () => {
    spyOn(component.onBtnClick, 'emit');

    component.header_icon = 'fa-solid fa-user-check';
    component.card_number = 360;
    component.card_header = 'On Time';
    
    fixture.detectChanges(); // Update the view with the new inputs

    const cardContainerElement = fixture.debugElement.query(By.css('.card-container')).nativeElement;
    cardContainerElement.click(); // Simulate the card click

    expect(component.onBtnClick.emit).toHaveBeenCalledWith({ isClicked: true, header: 'On Time' });
  });

  it('should integrate correctly with the parent component', () => {
    // Create a mock parent component to test interaction
    @Component({
      template: `
        <app-widget-card 
          (onBtnClick)="handleWidgetClick($event)"
          [card_number]="card_number"
          card_header="Test Header"
          header_icon="fa-solid fa-test">
        </app-widget-card>
      `
    })
    class MockParentComponent {
      card_number = 100;
      selectedHeader = '';

      handleWidgetClick(event: { isClicked: boolean, header: string }) {
        this.selectedHeader = event.header;
      }
    }

    const parentFixture = TestBed.createComponent(MockParentComponent);
    parentFixture.detectChanges();

    const parentComponent = parentFixture.componentInstance;
    const cardContainerElement = parentFixture.debugElement.query(By.css('.card-container')).nativeElement;
    cardContainerElement.click(); // Simulate the card click

    expect(parentComponent.selectedHeader).toBe('Test Header');
  });
});
