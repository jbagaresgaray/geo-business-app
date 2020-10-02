import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-no-business',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './no-business.component.html',
  styleUrls: ['./no-business.component.scss'],
})
export class NoBusinessComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
