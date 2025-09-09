import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDialogEditComponent } from './client-dialog-edit.component';

describe('ClientDialogEditComponent', () => {
  let component: ClientDialogEditComponent;
  let fixture: ComponentFixture<ClientDialogEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDialogEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDialogEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
