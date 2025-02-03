import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditViagemModalComponent } from './edit-viagem-modal.component';

describe('EditViagemModalComponent', () => {
  let component: EditViagemModalComponent;
  let fixture: ComponentFixture<EditViagemModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EditViagemModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditViagemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
