import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaingCreateComponent } from './campaing-create.component';

describe('CampaingCreateComponent', () => {
  let component: CampaingCreateComponent;
  let fixture: ComponentFixture<CampaingCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaingCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
