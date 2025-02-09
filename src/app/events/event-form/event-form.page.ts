import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonTextarea,
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  NavController,
  ToastController,
  IonButtons,
  IonImg, IonBackButton } from '@ionic/angular/standalone';
import { minDateValidator } from 'src/app/shared/directives/min-date.directive';
import { MyEvent, MyEventInsert } from 'src/app/shared/interfaces/my-event';
import { EventsService } from '../services/events.service';
import { SearchResult } from 'src/app/shared/interfaces/search-result';
import { OlMapDirective } from 'src/app/shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/directives/ol-maps/ol-marker.directive';
import { GaAutocompleteDirective } from 'src/app/shared/directives/ol-maps/ga-autocomplete.directive';
import { EncodeBase64Directive } from 'src/app/shared/directives/encode-base64.directive';
import { warning } from 'ionicons/icons';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.page.html',
  styleUrls: ['./event-form.page.scss'],
  standalone: true,
  imports: [IonBackButton, 
    IonTextarea,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonInput,
    IonLabel,
    IonItem,
    IonList,
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
    DatePipe,
    OlMapDirective,
    OlMarkerDirective,
    GaAutocompleteDirective,
    IonImg,
    IonButtons
  ],
})
export class EventFormPage {
  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #nav = inject(NavController);
  #changeDetector = inject(ChangeDetectorRef);

  event = input<MyEvent>();

  today: string = new Date().toISOString().split('T')[0];
  coordinates = signal<[number, number]>([-0.5, 38.5]);
  addEventErrorCode = signal<number | null>(null);

  saved = false;
  base64image = '';
  address = '';

  #fb = inject(NonNullableFormBuilder);
  eventForm = this.#fb.group({
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
      ],
    ],
    date: ['', [Validators.required, minDateValidator(this.today)]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0.1)]],
    image: ['', [Validators.required]],
  });

  constructor() {}

  addEvent(): void {
    const [lng, lat] = this.coordinates();
    const event: MyEventInsert = {
      ...this.eventForm.getRawValue(),
      image: this.base64image,
      address: this.address,
      lat: lat,
      lng: lng,
    };

    this.#eventsService
      .addEvent(event)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.saved = true;
          this.#nav.navigateRoot(['/events']);
        },
        error: (error) => {
          this.addEventErrorCode.set(error.status);
        },
      });
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 768,
      width: 1024,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });

    this.base64image = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    this.address = result.address;
  }

  
}
