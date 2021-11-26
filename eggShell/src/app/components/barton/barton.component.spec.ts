import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BartonComponent } from './barton.component';

describe('BartonComponent', () => {
  let component: BartonComponent;
  let fixture: ComponentFixture<BartonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BartonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BartonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
