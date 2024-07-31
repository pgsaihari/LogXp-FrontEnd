import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTraineePageComponent } from './search-trainee-page.component';

describe('SearchTraineePageComponent', () => {
  let component: SearchTraineePageComponent;
  let fixture: ComponentFixture<SearchTraineePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTraineePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchTraineePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
