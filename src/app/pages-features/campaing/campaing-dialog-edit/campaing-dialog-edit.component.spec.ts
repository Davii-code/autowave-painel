import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaingDialogEditComponent } from './campaing-dialog-edit.component';

describe('CampaingDialogEditComponent', () => {
  let component: CampaingDialogEditComponent;
  let fixture: ComponentFixture<CampaingDialogEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaingDialogEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaingDialogEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
