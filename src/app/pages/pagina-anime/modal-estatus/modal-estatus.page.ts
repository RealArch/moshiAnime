import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-estatus',
  templateUrl: './modal-estatus.page.html',
  styleUrls: ['./modal-estatus.page.scss'],
})
export class ModalEstatusPage implements OnInit {

  constructor(
    private modalController:ModalController
  ) { }

  ngOnInit() {
  }
  dismissOnly(){
    this.modalController.dismiss()
  }
  dismiss(estatus){
    this.modalController.dismiss({
      'estatus':estatus
    })
  }

}
