import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvoiceLoopComponent } from './edit-invoice-loop.component';

describe('EditInvoiceLoopComponent', () => {
  let component: EditInvoiceLoopComponent;
  let fixture: ComponentFixture<EditInvoiceLoopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInvoiceLoopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInvoiceLoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
