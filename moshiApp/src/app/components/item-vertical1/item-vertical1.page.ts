import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-vertical1',
  templateUrl: './item-vertical1.page.html',
  styleUrls: ['./item-vertical1.page.scss'],
})
export class ItemVertical1Page implements OnInit {
  @Input('anime') anime;
  constructor() { }

  ngOnInit() {
  }

}
