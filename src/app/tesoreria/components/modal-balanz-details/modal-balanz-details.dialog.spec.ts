import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBalanzDetailsDialog } from './modal-balanz-details.dialog';

describe('ModalDeleteTicketDialog', () => {
  let component: ModalBalanzDetailsDialog;
  let fixture: ComponentFixture<ModalBalanzDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalBalanzDetailsDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBalanzDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
