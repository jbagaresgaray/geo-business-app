import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-radius',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './modal-radius.component.html',
  styleUrls: ['./modal-radius.component.scss'],
})
export class ModalRadiusComponent implements OnInit {
  radiusMeters = 1000;
  isInMeters = true;
  metricLabel = 'm';
  distanceLabel = '1000';

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {}

  dismiss() {
    this.modalController.dismiss({
      distance: this.radiusMeters,
    });
  }

  onRangeChange() {
    this.calculate();
  }

  onMetricChange() {
    if (this.isInMeters) {
      this.metricLabel = 'm';
    } else {
      this.metricLabel = 'km';
    }
  }

  private calculate() {
    if (this.isInMeters) {
      const distance = this.radiusMeters;
      this.distanceLabel = distance.toFixed(1);
    } else {
      const distance = this.radiusMeters / 1000;
      this.distanceLabel = distance.toFixed(1);
    }
  }
}
