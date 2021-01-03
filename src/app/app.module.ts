import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { ManualComponent } from './manual/manual.component';
import { AboutComponent } from './about/about.component';
import { LoadGameComponent } from './loadgame/loadgame.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LoadGameComponent,
    ManualComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
