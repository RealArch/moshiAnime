import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PopupsService {

  constructor(
    private toastController: ToastController
  ) { }

  async toast(color, text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 4000,
      color:color,
      translucent:false
    });
    toast.present();
  }

}
