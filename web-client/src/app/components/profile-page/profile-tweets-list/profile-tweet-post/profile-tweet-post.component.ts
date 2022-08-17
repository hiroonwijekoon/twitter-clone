import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tweet } from 'src/app/models/tweet';
import { User } from 'src/app/models/user';
import { MessengerService } from 'src/app/services/messenger.service';
import { TweetService } from 'src/app/services/tweet.service';

@Component({
  selector: 'app-profile-tweet-post',
  templateUrl: './profile-tweet-post.component.html',
  styleUrls: ['./profile-tweet-post.component.css'],
})
export class ProfileTweetPostComponent implements OnInit {
  @Input() tweet!: Tweet;
  @Input() user!: User;
  editMode: boolean = false;
  tweetForm!: FormGroup;
  filePath = '';
  selectedFile: File = null;
  imageChanged = false;
  d: Date;
  created: string;

  constructor(private tweetService: TweetService, private msg: MessengerService, private builder: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.d = new Date(this.tweet.created);
    this.created = this.d.toLocaleString();
  }

  deleteTweet() {
    this.tweetService.deleteTweet(this.tweet.id).subscribe(() => {
      this.msg.sendTweetMsg(this.tweet);
    });
  }

  editModeToggle() {
    if (this.editMode) {
      this.editMode = false;
    } else {
      this.editMode = true;
    }
  }

  buildForm() {
    this.tweetForm = this.builder.group({
      content: [this.tweet.content, Validators.required],
      img: [null],
      file: [''],
    });
  }

  imagePreview(e) {
    this.imageChanged = true;

    const file = (e.target as HTMLInputElement).files[0];

    this.tweetForm.patchValue({
      img: file,
    });

    this.selectedFile = <File>e.target.files[0];

    this.tweetForm.get('img').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.filePath = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveTweet() {
    //Transforming data into multipart/form-data type
    const fd = new FormData();
    fd.append('id', this.tweet.id.toString());
    fd.append('user_id', this.user.id);
    fd.append('content', this.tweetForm.value.content);
    fd.append('created', this.tweet.created);
    if (this.selectedFile != null) {
      fd.append('file', this.selectedFile, this.selectedFile.name);
    } else {
      fd.append('file', '');
    }

    this.tweetService.updateTweet(this.tweet.id, fd).subscribe((result) => {
      this.msg.sendTweetMsg(result);
    });
  }
}
