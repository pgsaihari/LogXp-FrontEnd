import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { WidgetCardsComponent } from '../../Features/widget-cards/widgetcards/widget-cards.component';
import { WidgetTableComponent } from '../../ui/widget-table/widget-table.component';
import { GraphComponent } from '../../ui/graph/graph.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CurrentDateComponent } from '../../ui/current-date/current-date.component';
import { TopHeaderComponent } from '../../ui/top-header/top-header.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TopHeaderComponent,
        CurrentDateComponent,
        GraphComponent,
        WidgetCardsComponent,
        WidgetTableComponent,
        HomeComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the HomeComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display the graph by default', () => {
    const graphElement = fixture.debugElement.query(By.css('app-graph'));
    expect(graphElement).toBeTruthy();
    const widgetTableElement = fixture.debugElement.query(By.css('app-widget-table'));
    expect(widgetTableElement).toBeNull();
  });

  it('should display the widget table when a widget card is clicked', () => {
    component.handleWidgetClick({ isClicked: true, header: 'On Time' });
    fixture.detectChanges();

    const widgetTableElement = fixture.debugElement.query(By.css('app-widget-table'));
    expect(widgetTableElement).toBeTruthy();
    const graphElement = fixture.debugElement.query(By.css('app-graph'));
    expect(graphElement).toBeNull();
  });

  it('should update tableHeader and toggleField based on widget card click', () => {
    component.handleWidgetClick({ isClicked: true, header: 'On Time' });
    expect(component.tableHeader).toBe('On Time');
    expect(component.toggleField).toBe('Check-In');

    component.handleWidgetClick({ isClicked: true, header: 'Late Arrivals' });
    expect(component.tableHeader).toBe('Late Arrivals');
    expect(component.toggleField).toBe('Check-In');

    component.handleWidgetClick({ isClicked: true, header: 'Early Departures' });
    expect(component.tableHeader).toBe('Early Departures');
    expect(component.toggleField).toBe('Check-Out');
  });

  it('should call the filterTrainees method on the WidgetTableComponent when a widget is clicked', () => {
    spyOn(component.widgetTableComponent!, 'filterTrainees');

    component.handleWidgetClick({ isClicked: true, header: 'On Time' });

    expect(component.widgetTableComponent?.filterTrainees).toHaveBeenCalledWith('');
  });

  it('should update visibility when a widget card is clicked', () => {
    expect(component.isVisible).toBe(false);

    component.handleWidgetClick({ isClicked: true, header: 'On Time' });
    expect(component.isVisible).toBe(true);
  });
});
