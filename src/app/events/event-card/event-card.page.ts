import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
  NavController,
  ToastController,
  IonIcon,
  IonButton,
  IonItem
} from '@ionic/angular/standalone';
import { MyEvent } from 'src/app/shared/interfaces/my-event';
import { EventsService } from '../services/events.service';
import { IntlCurrencyPipe } from 'src/app/shared/pipes/intl-currency.pipe';
import { DistanceKmPipe } from 'src/app/shared/pipes/distance-km.pipe';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.page.html',
  styleUrls: ['./event-card.page.scss'],
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    IonRow,
    IonGrid,
    IonCardTitle,
    IonCardContent,
    IonCol,
    IonCard,
    CommonModule,
    FormsModule,
    IonIcon,
    IntlCurrencyPipe,
    DistanceKmPipe,
    IonButton,
  ],
})
export class EventCardPage {
  private destroyRef = inject(DestroyRef);
  private eventsService = inject(EventsService);
  private actionSheetCtrl = inject(ActionSheetController);
  private nav = inject(NavController);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  event = input.required<MyEvent>();
  deleted = output<number>();
  attend = output<boolean>();

  error = signal<boolean>(false);

  async showAction() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash-bin-sharp',
          handler: () => this.confirmDelete(),
        },
        // {
        //   text: 'Edit',
        //   icon: 'trash',
        //   handler: () =>
        //     this.nav.navigateRoot(['/events', 'edit', this.event().id]),
        // },
        {
          text: 'View',
          icon: 'eye-sharp',
          handler: () => this.nav.navigateRoot(['/events', this.event().id]),
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.deleteEvent(),
        },
      ],
    });

    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
    });
    await toast.present();
  }

  deleteEvent() {
    this.eventsService
      .deleteEvent(this.event().id!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.presentToast('Event deleted successfully.');
        this.deleted.emit(this.event().id!);
      });
  }

}
