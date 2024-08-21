import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUserTableComponent } from './single-user-table.component';

describe('SingleUserTableComponent', () => {
  let component: SingleUserTableComponent;
  let fixture: ComponentFixture<SingleUserTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleUserTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
