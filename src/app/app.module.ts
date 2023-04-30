import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArtboardComponent } from './artboard/artboard.component';
import { ArtboardContainerComponent } from './artboard-container/artboard-container.component';

@NgModule({
  declarations: [
    AppComponent,
    ArtboardComponent,
    ArtboardContainerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
