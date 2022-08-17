import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersProfileTweetPostComponent } from './users-profile-tweet-post.component';

describe('UsersProfileTweetPostComponent', () => {
  let component: UsersProfileTweetPostComponent;
  let fixture: ComponentFixture<UsersProfileTweetPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersProfileTweetPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersProfileTweetPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
