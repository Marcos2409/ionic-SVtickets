import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonList, IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-filters-popover',
  templateUrl: './filters-popover.page.html',
  styleUrls: ['./filters-popover.page.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, IonItem, IonList, CommonModule, FormsModule],
})
export class FiltersPopoverPage {
  #popoverCtrl = inject(PopoverController);
  orderDate: () => void = input;
  orderDistance: () => void = input;
  orderPrice: () => void = input;

  constructor() {}

  closePopover() {
    this.#popoverCtrl.dismiss();
  }
}
