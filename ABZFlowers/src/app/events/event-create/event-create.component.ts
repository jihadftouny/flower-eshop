import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { EventsService } from '../events.service';
import { Eventt } from '../event.model';

import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
})
export class EventCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  eventt: Eventt;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private eventtId: string;
  private authStatusSub: Subscription;

  constructor(
    public eventtsService: EventsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      index: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('eventtId')) {
        this.mode = 'edit';
        this.eventtId = paramMap.get('eventtId');
        this.isLoading = true;
        this.eventtsService
          .getEvent(this.eventtId)
          .subscribe((eventtData) => {
            this.isLoading = false;
            this.eventt = {
              id: eventtData._id,
              name: eventtData.name,
              index: eventtData.index,
              imagePath: eventtData.imagePath,
              creator: eventtData.creator,
            };
            this.form.setValue({
              name: this.eventt.name,
              index: this.eventt.index,
              image: this.eventt.imagePath,
            });
          });
      } else {
        this.mode = 'create';
        this.eventtId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file }); //allows you to reach a single control, unlike setValue
    this.form.get('image').updateValueAndValidity(); //this will run the validators on the image above
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveEvent() {
    if (this.form.invalid) {
      console.log('Form Invalid');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.eventtsService.addEvent(
        this.form.value.name,
        this.form.value.index,
        this.form.value.image,
      );
    } else {
      this.eventtsService.updateEvent(
        this.eventtId,
        this.form.value.name,
        this.form.value.index,
        this.form.value.image,
      );
    }
    this.form.reset();
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
