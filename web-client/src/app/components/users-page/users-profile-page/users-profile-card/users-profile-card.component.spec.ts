import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersProfileCardComponent } from './users-profile-card.component';

describe('UsersProfileCardComponent', () => {
  let component: UsersProfileCardComponent;
  let fixture: ComponentFixture<UsersProfileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersProfileCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
