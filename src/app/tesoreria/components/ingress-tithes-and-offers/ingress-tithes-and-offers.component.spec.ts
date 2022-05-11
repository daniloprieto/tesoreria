import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngressTithesAndOffersComponent } from './ingress-tithes-and-offers.component';

describe('IngressTithesAndOffersComponent', () => {
  let component: IngressTithesAndOffersComponent;
  let fixture: ComponentFixture<IngressTithesAndOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngressTithesAndOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngressTithesAndOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
