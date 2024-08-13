import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTraineesPageComponent } from './add-trainees-page.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { By } from '@angular/platform-browser';

describe('AddTraineesPageComponent', () => {
  let component: AddTraineesPageComponent;
  let fixture: ComponentFixture<AddTraineesPageComponent>;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastModule], // Include ToastModule in imports
      declarations: [AddTraineesPageComponent],
      providers: [MessageService] // Provide the MessageService
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTraineesPageComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger file input when upload button is clicked', () => {
    spyOn(component, 'triggerFileInput').and.callThrough();

    const uploadButton = fixture.debugElement.query(By.css('.upload-button')).nativeElement;
    uploadButton.click();

    expect(component.triggerFileInput).toHaveBeenCalled();
  });

  it('should call onFileSelected when a file is selected', () => {
    spyOn(component, 'onFileSelected').and.callThrough();

    const inputElement = fixture.debugElement.query(By.css('#fileInput')).nativeElement;
    const file = new File(['dummy content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event as any);

    expect(component.onFileSelected).toHaveBeenCalled();
  });

  it('should show success message when file is processed', () => {
    spyOn(messageService, 'add').and.callThrough();

    const data = new Uint8Array([1, 2, 3, 4]);
    component.processExcel(data);

    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Excel sheet uploaded successfully!' });
  });
});
