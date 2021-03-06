import { animate, Component, OnInit, state, style, transition, trigger } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AlertService } from '../../core/alert/alert.service';
import { Announcement } from '../../announcements/shared/announcement.model';
import { AnnouncementService } from '../../announcements/shared/announcement.service';
import { AuthService } from '../../auth/shared/auth.service';
import { Message } from '../../messages/shared/message.model';
import { MessagesService } from '../../messages/shared/messages.service';
import { User } from '../shared/user.model';
import { UserService } from '../shared/users.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  animations: [
    trigger('routerTransition', [
      state('void', style({ position: 'fixed' })),
      state('*', style({ position: 'fixed' })),
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ],
  host: { '[@routerTransition]': '' }
})

export class UserDetailComponent implements OnInit {
  myMessageForm: FormGroup;
  user$: Observable<User>;
  announcement$: Observable<Announcement>;
  userKey: string;
  adKey: string;
  userUID: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private announcementService: AnnouncementService,
    private messagesService: MessagesService,
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
    ) { }

  ngOnInit() {
    this.userKey = this.route.snapshot.params['id'];
    this.adKey = this.route.snapshot.params['adId'];
    this.announcement$ = this.announcementService.findAnnouncementByKey(this.adKey);
    this.user$ = this.userService.getUserByKey(this.userKey);

    this.myMessageForm = this.fb.group({
      announcementid: '',
      touserid: '',
      answered: '',
      fromuserid: '',
      read: '',
      sent: '',
      msgText: ''
    });
  }

  onSent() {
    this.userUID = this.authService.userId;
    let currentdate = new Date().toString();

    this.myMessageForm.patchValue({ fromuserid: this.userUID });
    this.myMessageForm.patchValue({ answered: false });
    this.myMessageForm.patchValue({ read: false });
    this.myMessageForm.patchValue({ sent: currentdate });

    this.messagesService.createNewMessage(this.myMessageForm.value)
      .then(() => this.alertService.success('Съобщението е изпратено', true))
      .catch(err => this.alertService.error(`Грешка при изпращане на съобщение ${err}`));
  }
}
