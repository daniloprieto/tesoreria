import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanzComponent } from './balanz.component';

describe('BalanzComponent', () => {
  let component: BalanzComponent;
  let fixture: ComponentFixture<BalanzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
