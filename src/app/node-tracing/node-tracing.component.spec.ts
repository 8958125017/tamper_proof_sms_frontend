import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeTracingComponent } from './node-tracing.component';

describe('NodeTracingComponent', () => {
  let component: NodeTracingComponent;
  let fixture: ComponentFixture<NodeTracingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeTracingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeTracingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
