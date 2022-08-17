import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightPaneUserItemComponent } from './right-pane-user-item.component';

describe('RightPaneUserItemComponent', () => {
  let component: RightPaneUserItemComponent;
  let fixture: ComponentFixture<RightPaneUserItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightPaneUserItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightPaneUserItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
