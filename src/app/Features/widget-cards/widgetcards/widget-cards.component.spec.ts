import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetCardsComponent } from './widget-cards.component';
import { WidgetCardComponent } from '../../../ui/widget-card/widget-card.component';
import { By } from '@angular/platform-browser';

describe('WidgetCardsComponent', () => {
  let component: WidgetCardsComponent;
  let fixture: ComponentFixture<WidgetCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetCardsComponent, WidgetCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the WidgetCardsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should emit widgetSelected event when a widget card is clicked', () => {
    spyOn(component.widgetSelected, 'emit');

    // Simulating the event emitted from the child widget card
    const mockData = { isClicked: true, header: 'On Time' };
    component.clickWidget(mockData);

    expect(component.widgetSelected.emit).toHaveBeenCalledWith(mockData);
  });

  it('should render multiple widget cards', () => {
    // Verify that there are multiple widget-card components rendered
    const widgetCards = fixture.debugElement.queryAll(By.css('app-widget-card'));
    expect(widgetCards.length).toBe(6); // There are 6 widget cards defined in the template
  });

  it('should pass correct inputs to each widget card', () => {
    // Check the inputs for one of the widget cards
    const widgetCard = fixture.debugElement.query(By.css('app-widget-card'));

    expect(widgetCard.properties['card_number']).toBe(452);
    expect(widgetCard.properties['card_header']).toBe('Total Employees');
    expect(widgetCard.properties['header_icon']).toBe('fa-solid fa-users icon');
  });
});
