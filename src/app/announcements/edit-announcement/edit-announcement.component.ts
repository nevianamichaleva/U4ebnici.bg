import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { AlertService } from '../../core/alert/alert.service';
import { Announcement } from '../shared/announcement.model';
import { AnnouncementService } from '../shared/announcement.service';

@Component({
  selector: 'app-edit-announcement',
  templateUrl: './edit-announcement.component.html',
  styleUrls: ['./edit-announcement.component.css']
})
export class EditAnnouncementComponent implements OnInit {
  myDBForm: FormGroup;
  selectedFile: any;
  announcementKey: string;
  announcement$: Observable<Announcement>;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private announcementService: AnnouncementService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.announcementKey = this.route.snapshot.params['id'];
    this.announcement$ = this.announcementService.findAnnouncementByKey(this.announcementKey);
    this.myDBForm = this.fb.group({
      title: ['', Validators.required],
      discipline: ['', Validators.required],
      clas: ['', Validators.required],
      image: '',
      publisher: '',
      authors: ['', Validators.required],
      year: '',
      description: '',
      condition: '',
      price: [0, Validators.required]
    });
  }

  onUpdateAnnouncement() {
    this.announcementService.updateAnnouncement(this.announcement$, this.myDBForm.value, this.selectedFile)
      .then(() => this.alertService.success('Обявата е редактирана', true))
      .catch(err => this.alertService.error(`Грешка при редакция на обява ${err}`));
  }

  onConditionChange(e: any) {
    this.myDBForm.value.condition = e.target.value;
  }

  onImageSelected(e: any) {
    this.selectedFile = e.target.files[0];
  }
}
