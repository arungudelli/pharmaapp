import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvoiceStaticComponent } from './edit-invoice-static.component';

describe('EditInvoiceStaticComponent', () => {
  let component: EditInvoiceStaticComponent;
  let fixture: ComponentFixture<EditInvoiceStaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInvoiceStaticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInvoiceStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
