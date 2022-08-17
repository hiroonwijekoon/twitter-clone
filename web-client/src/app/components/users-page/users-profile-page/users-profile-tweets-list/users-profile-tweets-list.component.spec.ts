import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersProfileTweetsListComponent } from './users-profile-tweets-list.component';

describe('UsersProfileTweetsListComponent', () => {
  let component: UsersProfileTweetsListComponent;
  let fixture: ComponentFixture<UsersProfileTweetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersProfileTweetsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersProfileTweetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
