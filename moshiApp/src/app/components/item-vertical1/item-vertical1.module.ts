import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemVertical1PageRoutingModule } from './item-vertical1-routing.module';

import { ItemVertical1Page } from './item-vertical1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemVertical1PageRoutingModule
  ],
  declarations: [ItemVertical1Page],
  exports: [ItemVertical1Page]
})
export class ItemVertical1PageModule { }
