import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';



@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('mainSearchbar') searchBar: IonSearchbar;

  animes
  loading: boolean;
  animesFinal: any;

  constructor(
    private modal:ModalController,
    private api:ApiService,
    private navController:NavController,
    ) { }

  ngOnInit() {

  }
  ionViewDidEnter() {
    setTimeout(()=>{
        this.searchBar.setFocus();
    }, 150);
  }
  close(){
    this.navController.back()
  }
  search(ev){
    this.loading=true
    this.animesFinal=[]
    console.log(ev.detail.value)
    this.api.search(ev.detail.value)
    .subscribe(data=>{
      console.log(data)
      this.animes = data['data']
      for (let i = 0; i < this.animes.length; i++) {

        // console.log(this.animes[i].image_url.split('/')[5])
        if(this.animes[i].rated!='Rx'){
          this.animesFinal.push(this.animes[i])
        }
      }
      console.log(this.animes)
      this.loading=false
    })
  }
}
