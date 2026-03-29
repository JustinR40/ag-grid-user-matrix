import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCell } from './dropdown-cell';

describe('DropdownCell', () => {
  let component: DropdownCell;
  let fixture: ComponentFixture<DropdownCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownCell],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownCell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
