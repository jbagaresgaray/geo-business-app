import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-info-error-card',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './info-error-card.component.html',
  styleUrls: ['./info-error-card.component.scss'],
})
export class InfoErrorCardComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;

  constructor() {}

  ngOnInit(): void {}
}
