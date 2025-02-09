import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonIcon,
  IonFab,
  IonFabButton,
  ToastController,
} from '@ionic/angular/standalone';
import { OlMapDirective } from 'src/app/shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/directives/ol-maps/ol-marker.directive';
import { EventDetailPage } from '../../event-detail.page';
import { LaunchNavigator } from '@awesome-cordova-plugins/launch-navigator';

@Component({
  selector: 'app-event-location',
  templateUrl: './event-location.page.html',
  styleUrls: ['./event-location.page.scss'],
  standalone: true,
  imports: [
    IonFabButton,
    IonFab,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLabel,
    CommonModule,
    FormsModule,
    OlMapDirective,
    OlMarkerDirective,
  ],
})
export class EventLocationPage {
  coordinates = signal<[number, number]>([-0.5, 38.5]);
  event = inject(EventDetailPage).event;

  eventAddress: string = this.event()!.address;
  shortAddress = '';
  showFullAddress: boolean = false;

  // #toastCtrl = inject(ToastController);

  constructor() {
    this.coordinates.set([this.event()!.lng, this.event()!.lat]);
    this.shortAddress = this.eventAddress.split(',')[0];
  }

  async startNavigation() {
    LaunchNavigator.navigate(this.coordinates().reverse());

    // const toast = await this.#toastCtrl.create({
    //   message: "No",
    //   duration: 2000, // 5 seconds
    //   position: 'top',
    //   color: 'danger',
    //   buttons: [
    //     {
    //       icon: 'close-circle',
    //       role: 'cancel',
    //     },
    //   ],
    // });
    // await toast.present();
  }

  toggleAddress() {
    this.showFullAddress = !this.showFullAddress;
  }
}
