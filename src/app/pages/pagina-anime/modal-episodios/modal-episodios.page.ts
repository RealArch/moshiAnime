import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-episodios',
  templateUrl: './modal-episodios.page.html',
  styleUrls: ['./modal-episodios.page.scss'],
})
export class ModalEpisodiosPage implements OnInit {
  @Input() episodios: number
  @Input() episodioActual: number
  constructor(
    private modalController:ModalController
  ) {
  }

  ngOnInit() {
  }
  seleccionar(episodio){
    this.modalController.dismiss({
      episodio:episodio
    })
  }
  counter(i: number) {
    return new Array(i);
  }
  dismissOnly(){
    this.modalController.dismiss()
  }
}
