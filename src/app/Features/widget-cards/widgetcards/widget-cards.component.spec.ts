// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { WidgetCardsComponent } from './widget-cards.component';

// import { TraineeServiceService } from '../../../core/services/trainee-service.service';
// import { AttendanceLogsService } from '../../../core/services/attendance-logs.service';
// import { of, throwError } from 'rxjs';
// import { WidgetCardComponent } from '../../../ui/widget-card/widget-card.component';
// import { FormsModule } from '@angular/forms';
// import { MessageService } from 'primeng/api';


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetCardsComponent } from './widget-cards.component';
import { of, throwError } from 'rxjs';
import { TraineeServiceService } from '../../../core/services/trainee-service.service';
import { AttendanceLogsService } from '../../../core/services/attendance-logs.service';
import { MessageService } from 'primeng/api';

// describe('WidgetCardsComponent', () => {
//   let component: WidgetCardsComponent;
//   let fixture: ComponentFixture<WidgetCardsComponent>;
//   let traineeServiceMock: any;
//   let attendanceLogsServiceMock: any;
describe('WidgetCardsComponent', () => {
  let component: WidgetCardsComponent;
  let fixture: ComponentFixture<WidgetCardsComponent>;
  let mockTraineeService: jasmine.SpyObj<TraineeServiceService>;
  let mockAttendanceLogsService: jasmine.SpyObj<AttendanceLogsService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

//   beforeEach(async () => {
//     traineeServiceMock = {
//       getTraineesCount: jasmine.createSpy().and.returnValue(of(50)),
//     };

//     attendanceLogsServiceMock = {
//       getEarlyArrivalsCount: jasmine.createSpy().and.returnValue(of(10)),
//       getAbsenteesCount: jasmine.createSpy().and.returnValue(of(5)),
//       lateArrivalsCount: jasmine.createSpy().and.returnValue(of(8)),
//       earlyDeparturesCount: jasmine.createSpy().and.returnValue(of(3)),
//     };
  beforeEach(async () => {
    // Creating mock services
    mockTraineeService = jasmine.createSpyObj('TraineeServiceService', ['getTraineesCount']);
    mockAttendanceLogsService = jasmine.createSpyObj('AttendanceLogsService', [
      'getEarlyArrivalsCount',
      'getAbsenteesCount',
      'lateArrivalsCount',
      'earlyDeparturesCount'
    ]);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

//     await TestBed.configureTestingModule({

//       imports: [WidgetCardComponent, FormsModule],
//       declarations: [WidgetCardsComponent],
//       providers: [
//         { provide: TraineeServiceService, useValue: traineeServiceMock },
//         { provide: AttendanceLogsService, useValue: attendanceLogsServiceMock },
//         MessageService,
//       ],
//     }).compileComponents();

//       imports: [WidgetCardsComponent]
//     })
//     .compileComponents();


//     fixture = TestBed.createComponent(WidgetCardsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

    await TestBed.configureTestingModule({
      declarations: [WidgetCardsComponent],
      providers: [
        { provide: TraineeServiceService, useValue: mockTraineeService },
        { provide: AttendanceLogsService, useValue: mockAttendanceLogsService },
        { provide: MessageService, useValue: mockMessageService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCardsComponent);
    component = fixture.componentInstance;

    // Mock service return values
    mockTraineeService.getTraineesCount.and.returnValue(of(100));
    mockAttendanceLogsService.getEarlyArrivalsCount.and.returnValue(of(50));
    mockAttendanceLogsService.getAbsenteesCount.and.returnValue(of(5));
    mockAttendanceLogsService.lateArrivalsCount.and.returnValue(of(20));
    mockAttendanceLogsService.earlyDeparturesCount.and.returnValue(of(10));

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

//   it('should load total trainees count on initialization', () => {
//     component.ngOnInit();
//     expect(traineeServiceMock.getTraineesCount).toHaveBeenCalled();
//     expect(component.totalTrainees).toBe(50);
//   });
  it('should fetch the total trainees count on init', () => {
    expect(component.totalTrainees).toBe(100);
  });

//   it('should load early arrivals count on initialization', () => {
//     component.ngOnInit();
//     expect(attendanceLogsServiceMock.getEarlyArrivalsCount).toHaveBeenCalled();
//     expect(component.onTimeNum).toBe(10);
//   });

//   it('should load absentees count on initialization', () => {
//     component.ngOnInit();
//     expect(attendanceLogsServiceMock.getAbsenteesCount).toHaveBeenCalled();
//     expect(component.absentees).toBe(5);
//   });

//   it('should load late arrivals count on initialization', () => {
//     component.ngOnInit();
//     expect(attendanceLogsServiceMock.lateArrivalsCount).toHaveBeenCalled();
//     expect(component.lateArrivals).toBe(8);
//   });

//   it('should load early departures count on initialization', () => {
//     component.ngOnInit();
//     expect(attendanceLogsServiceMock.earlyDeparturesCount).toHaveBeenCalled();
//     expect(component.earlyDepartures).toBe(3);
//   });
  it('should fetch the correct attendance logs on init', () => {
    expect(component.onTimeNum).toBe(50);
    expect(component.absentees).toBe(5);
    expect(component.lateArrivals).toBe(20);
    expect(component.earlyDepartures).toBe(10);
  });

//   it('should set the active card index when a widget is clicked', () => {
//     const event = { isClicked: true, header: 'On Time' };
//     component.clickWidget(event, 1);
//     expect(component.activeCardIndex).toBe(1);
//   });
  it('should set the correct active card when a card is clicked', () => {
    component.clickWidget({ isClicked: true, header: 'On Time' }, 1);
    expect(component.activeCardIndex).toBe(1);
  });

//   it('should correctly identify the active card using isCardActive', () => {
//     component.activeCardIndex = 2;
//     expect(component.isCardActive(2)).toBeTrue();
//     expect(component.isCardActive(0)).toBeFalse();
//   });
  it('should correctly determine if a card is active', () => {
    component.activeCardIndex = 2;
    expect(component.isCardActive(2)).toBeTrue();
    expect(component.isCardActive(1)).toBeFalse();
  });

//   it('should emit the widgetSelected event when a widget is clicked', () => {
//     spyOn(component.widgetSelected, 'emit');
//     const event = { isClicked: true, header: 'On Time' };
//     component.clickWidget(event, 1);
//     expect(component.widgetSelected.emit).toHaveBeenCalledWith(event);
//   });

//   it('should handle error when service call fails', () => {
//     traineeServiceMock.getTraineesCount.and.returnValue(throwError('Error'));
//     spyOn(console, 'error');
//     component.ngOnInit();
//     expect(console.error).toHaveBeenCalledWith('Error adding trainee', 'Error');
//   });
  it('should emit the correct event when a card is clicked', () => {
    spyOn(component.widgetSelected, 'emit');
    const eventData = { isClicked: true, header: 'Absent' };
    component.clickWidget(eventData, 1);
    expect(component.widgetSelected.emit).toHaveBeenCalledWith(eventData);
  });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

});
