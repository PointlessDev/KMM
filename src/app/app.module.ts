import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import {MaterialModule} from './material.module';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ModListComponent } from './mod-list/mod-list.component';
import { ModDetailComponent } from './mod-detail/mod-detail.component';
import { TypographyComponent } from './typography/typography.component';
import { MacControlsComponent } from './mac-controls/mac-controls.component';
import { RegistryReloadComponent } from './registry-reload/registry-reload.component';
import { RegistryService } from './registry.service';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    PageNotFoundComponent,
    ModListComponent,
    ModDetailComponent,
    TypographyComponent,
    MacControlsComponent,
    RegistryReloadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [RegistryService],
  bootstrap: [AppComponent],
  entryComponents: [
    TypographyComponent,
    RegistryReloadComponent
  ]
})
export class AppModule { }
