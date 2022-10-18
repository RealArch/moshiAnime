import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-card-anime',
  templateUrl: './card-anime.page.html',
  styleUrls: ['./card-anime.page.scss'],
})
export class CardAnimePage implements OnInit {
  @Input() malId:string
  @Input() vistos:number
  anime;
  loading: boolean;
  constructor(
    private api:ApiService
  ) { }

  ngOnInit() {
    this.loading=true
    this.api.getAnimeByMalId(this.malId)
    .subscribe((data:any)=>{
      console.log(data)
      this.anime=data.data
      this.loading=false

    },err=>{
      console.log(err)
      this.loading=false
      console.log('tuve un problema al cargar')
      this.ngOnInit()
      //toast error
    })
  }

}
