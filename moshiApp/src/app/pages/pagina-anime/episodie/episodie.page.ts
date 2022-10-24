import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-episodie',
  templateUrl: './episodie.page.html',
  styleUrls: ['./episodie.page.scss'],
})
export class EpisodiePage implements OnInit {
  animeId: string;
  episodeId:string
  loadingVideo: boolean;
  video: any;
  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute, 
    private api:ApiService
  ) { }

  ngOnInit() {
    this.loadingVideo = true
    this.animeId= this.activatedRoute.snapshot.paramMap.get('id');
    this.episodeId= this.activatedRoute.snapshot.paramMap.get('episodeId')
    this.api.getAnimeVideo(this.animeId,this.episodeId)
    .subscribe(data=>{
      this.video = data['url']
      this.loadingVideo = false
    })


  }

}
