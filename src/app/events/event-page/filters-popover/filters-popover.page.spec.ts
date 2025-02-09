import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersPopoverPage } from './filters-popover.page';

describe('FiltersPopoverPage', () => {
  let component: FiltersPopoverPage;
  let fixture: ComponentFixture<FiltersPopoverPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
