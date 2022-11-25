import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    App.getInfo().then(data=>{
      console.log(data)
    })
  }
  closeModal() {
    this.modalController.dismiss()
  }
}
