import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoultryDialogComponent } from './poultry-dialog.component';

describe('PoultryDialogComponent', () => {
  let component: PoultryDialogComponent;
  let fixture: ComponentFixture<PoultryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoultryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoultryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
