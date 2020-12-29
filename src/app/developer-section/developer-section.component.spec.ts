import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperSectionComponent } from './developer-section.component';

describe('DeveloperSectionComponent', () => {
  let component: DeveloperSectionComponent;
  let fixture: ComponentFixture<DeveloperSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
