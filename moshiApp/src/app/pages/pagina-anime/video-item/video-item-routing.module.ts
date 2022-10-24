import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoItemPage } from './video-item.page';

const routes: Routes = [
  {
    path: '',
    component: VideoItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoItemPageRoutingModule {}
