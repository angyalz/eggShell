import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEggComponent } from './add-egg.component';

describe('AddEggComponent', () => {
  let component: AddEggComponent;
  let fixture: ComponentFixture<AddEggComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEggComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEggComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
