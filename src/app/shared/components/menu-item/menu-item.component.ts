import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import isEmpty from 'lodash-es/isEmpty';
@Component({
  selector: 'app-menu-item',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
  @Input() menuTitle: string;
  @Input() menuType: string;
  @Input() menuStoreStatus: string;
  @Input() menuStarRating: number;
  @Input() menuStoreLocation: string;
  @Input() menuImage: string;
  @Input() menuCategory: string;

  hasAvatar: boolean;

  constructor() {}

  ngOnInit(): void {
    this.hasAvatar = !isEmpty(this.menuImage);
  }
}
