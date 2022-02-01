import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRequestNotificationComponent } from './new-request-notification.component';

describe('NewRequestNotificationComponent', () => {
  let component: NewRequestNotificationComponent;
  let fixture: ComponentFixture<NewRequestNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRequestNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRequestNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
