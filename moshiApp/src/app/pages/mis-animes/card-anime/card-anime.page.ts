import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-card-anime',
  templateUrl: './card-anime.page.html',
  styleUrls: ['./card-anime.page.scss'],
})
export class CardAnimePage implements OnInit {
  @Input('animeData') animeData
 
  constructor(
  ) { }

  ngOnInit() {
    console.log(this.animeData)
  }

}
