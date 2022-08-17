import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTweetsListComponent } from './profile-tweets-list.component';

describe('ProfileTweetsListComponent', () => {
  let component: ProfileTweetsListComponent;
  let fixture: ComponentFixture<ProfileTweetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileTweetsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTweetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
