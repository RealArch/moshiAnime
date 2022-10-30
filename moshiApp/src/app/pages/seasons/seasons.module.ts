import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeasonsPageRoutingModule } from './seasons-routing.module';

import { SeasonsPage } from './seasons.page';
import { ItemVertical1PageModule } from 'src/app/components/item-vertical1/item-vertical1.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeasonsPageRoutingModule,
    ItemVertical1PageModule
  ],
  declarations: [SeasonsPage],
  providers:[ItemVertical1PageModule]
})
export class SeasonsPageModule {}
