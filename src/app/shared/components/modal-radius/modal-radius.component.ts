import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-radius',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './modal-radius.component.html',
  styleUrls: ['./modal-radius.component.scss'],
})
export class ModalRadiusComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit(): void {}

  dismiss() {
    this.modalController.dismiss();
  }
}
