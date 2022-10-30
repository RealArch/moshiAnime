import { Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.page.html',
  styleUrls: ['./seasons.page.scss'],
})
export class SeasonsPage implements OnInit {
  loading: boolean;
  subscriptions: Subscription[] = [];
  publicConfigs: import("@angular/fire/firestore").DocumentData;
  season
  year
  animes: any;
  pickerYears: any = [];
  constructor(
    private api: ApiService,
    private pickerController: PickerController
  ) { }

  ngOnInit() {
    this.loading = true
    this.publicConfigs = this.api.publicConfigs
    this.year = this.getYearSeasonFromId(this.publicConfigs.actualSeason).year
    this.season = this.getYearSeasonFromId(this.publicConfigs.actualSeason).season
    this.loadData(this.year, this.season, null)

  }
  loadData(year, season, ev) {
    this.loading = true
    this.year = year 
    this.season = this.translateSeason(season)
    this.animes = []
    console.log(year, season)
    this.api.getSeasonAnimes(season, year, null)
      .then(data => {
        this.animes = data.hits
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
  }
  translateSeason(season){
    if(season=='fall') return 'Otoño'
    if(season=='summer') return 'Verano'
    if(season=='winter') return 'Invierno'
    if(season=='spring') return 'Primavera'

  }
  getYearSeasonFromId(seasonId) {
    var splitted = seasonId.split('-')
    var data = {
      year: splitted[0],
      season: splitted[1]
    }
    return data
  }
  //Date picker
  formatDates(addedSeasons) {
    var options = []
    for (const season of addedSeasons) {
      var yearSeason = this.getYearSeasonFromId(season)
      options.push({
        text: yearSeason.year +' - '+ this.translateSeason(yearSeason.season),
        value: season
      })
    }
    return options
  }
  async openPicker() {
    var options = this.formatDates(this.publicConfigs.addedSeasons)
    const picker = await this.pickerController.create({
      columns: [{
        name: 'Seasons',
        options: options
      }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: (value) => {
            console.log(value.Seasons.value)
            var a = this.getYearSeasonFromId(value.Seasons.value)
            this.loadData(a.year, a.season, null)
          },
        },
      ],
    });

    await picker.present();
  }
}
