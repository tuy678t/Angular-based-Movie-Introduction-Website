import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DetailsComponent } from './details/details.component';
import { MylistComponent } from './mylist/mylist.component';
import { HomeComponent } from './home/home.component';
import { YouTubePlayerModule } from '@angular/youtube-player';

const routes: Routes = [
  {path: '',component: HomeComponent,pathMatch: 'full'},
  {path: 'mylist',component: MylistComponent},
  {path: 'watch/:watchCategory/:watchId',component: DetailsComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    DetailsComponent,
    MylistComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot(routes),
    YouTubePlayerModule,
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
