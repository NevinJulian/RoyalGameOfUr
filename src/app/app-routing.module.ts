import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { EndscreenComponent } from './endscreen/endscreen.component';
import { GameComponent } from './game/game.component';
import { ManualComponent } from './manual/manual.component';

const routes: Routes = [
  { path: '', component: GameComponent },
  { path: 'manual', component: ManualComponent },
  { path: 'about', component: AboutComponent },
  { path: 'endscreen', component: EndscreenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
