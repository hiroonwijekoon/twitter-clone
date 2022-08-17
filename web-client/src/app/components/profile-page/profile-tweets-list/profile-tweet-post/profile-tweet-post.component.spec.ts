import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTweetPostComponent } from './profile-tweet-post.component';

describe('ProfileTweetPostComponent', () => {
  let component: ProfileTweetPostComponent;
  let fixture: ComponentFixture<ProfileTweetPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileTweetPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTweetPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
