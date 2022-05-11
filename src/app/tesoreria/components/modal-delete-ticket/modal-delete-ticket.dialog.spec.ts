import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteTicketDialog } from './modal-delete-ticket.dialog';

describe('ModalDeleteTicketDialog', () => {
  let component: ModalDeleteTicketDialog;
  let fixture: ComponentFixture<ModalDeleteTicketDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDeleteTicketDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteTicketDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
