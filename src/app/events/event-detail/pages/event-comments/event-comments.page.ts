import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { EventDetailPage } from '../../event-detail.page';
import { EventsService } from 'src/app/events/services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SingleCommentResponse } from 'src/app/shared/interfaces/responses';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonAvatar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-event-comments',
  templateUrl: './event-comments.page.html',
  styleUrls: ['./event-comments.page.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonLabel,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonAvatar,
    IonToolbar,
    IonContent,
    IonHeader,
    IonItem,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class EventCommentsPage {
  event = inject(EventDetailPage).event;
  #eventService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #fb = inject(NonNullableFormBuilder);

  comments = signal<SingleCommentResponse[]>([]);

  commentForm = this.#fb.group({
    message: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      this.#eventService
        .getComments(this.event()!.id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((result) => {
          this.comments.set(result.comments);
        });
    });
  }

  postComment(event: Event): void {
    event.preventDefault();
    const comment = this.commentForm.getRawValue();
    const commentBody = comment.message;
    this.#eventService
      .postComment(this.event()!.id, commentBody)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((response) => {
        this.comments.update((comments) => [...comments, response]);
      });

    this.commentForm.reset();
  }
}
