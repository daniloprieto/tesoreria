import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLiveComponent } from './dashboard-live.component';

describe('DashboardLiveComponent', () => {
  let component: DashboardLiveComponent;
  let fixture: ComponentFixture<DashboardLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
