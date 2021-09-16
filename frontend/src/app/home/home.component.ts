import { Component, OnInit,Injectable } from '@angular/core';
import {TMDBService} from '../app.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public carousel_resturn_list=[];
  public popular_movie_list=[];
  public popular_tv_list=[];
  public top_movie_list=[];
  public top_tv_list=[];
  public trending_movie_list=[];
  public trending_tv_list=[];
  public popular_movie_list_sm=[];
  public popular_tv_list_sm=[];
  public top_movie_list_sm=[];
  public top_tv_list_sm=[];
  public trending_movie_list_sm=[];
  public trending_tv_list_sm=[];

  constructor(private _service: TMDBService) {}

  ngOnInit(): void {
    this.getCarouselData();
    this.getPopMov();
    this.getPopTv();
    this.getTopMov();
    this.getTopTv();
    this.getTreMov();
    this.getTreTv();
    this.getContinueWatching();
    let nav_bar_home=document.getElementById('nav_bar_home')
    nav_bar_home.setAttribute("class","nav-item active");
    let nav_bar_list=document.getElementById('nav_bar_list')
    nav_bar_list.setAttribute("class","nav-item");

    let select_button=document.getElementById('navbar_button');
    select_button.className="navbar-toggler collapsed";
    select_button.setAttribute("aria-expanded","false");
    let select_part=document.getElementById('navbarSupportedContent');
    select_part.className="collapse navbar-collapse";
  }

  public continue_watch_list=[];
  public continue_watch_list_sm=[];

  getContinueWatching(){
    this.continue_watch_list=[];
    let myStorage = window.localStorage;
    let myContinueList_string=myStorage.getItem('continue_list');
    let continue_list;
    if(myContinueList_string==null){
      this.continue_watch_list=[];
      this.continue_watch_list_sm=[];
      return;
    }
    else{
      eval("continue_list = "+myContinueList_string);
    }
    continue_list=continue_list.reverse();
    let tmp_list=[];
    for(let ind=0;ind<continue_list.length;ind++){
      if(ind!=0&&ind%6==0){
        this.continue_watch_list.push(tmp_list);
        tmp_list=[];
      }
      tmp_list.push(continue_list[ind])
      this.continue_watch_list_sm.push(continue_list[ind]);
    }
    this.continue_watch_list.push(tmp_list);
    this.continue_watch_list=this.continue_watch_list.slice(0,24);
  }


  getCarouselData(){
    this.carousel_resturn_list=[];
    this._service.carousel().subscribe(
      (data)=>{
        var result_list=data['results'];
        for(var index=0;index<result_list.length;index++){
          var newdict={};
          if(result_list[index]['poster_path']==null) continue;
          newdict['id']=result_list[index]['id'];
          newdict['title']=result_list[index]['title'];
          newdict['backdrop_path']='https://image.tmdb.org/t/p/original'+result_list[index]['backdrop_path'];
          this.carousel_resturn_list.push(newdict);
        }
        this.carousel_resturn_list=this.carousel_resturn_list.slice(0,5);
        //console.log(this.carousel_resturn_list);
      }
    )
  }

  getPopMov(){
    this.popular_movie_list=[];
    var tmp_list=[];
    this._service.others("movie","popular").subscribe(
      (data)=>{ 
        var result_list=data['results'];
        for(var index=0;index<result_list.length;index++){
          if(index!=0&&index%6==0){
            this.popular_movie_list.push(tmp_list);
            tmp_list=[];
          }
          var newdict={};
          newdict['media']="movie";
          newdict['id']=result_list[index]['id'];
          if(result_list[index]['poster_path']==null) newdict['poster_path']='assets/img/poster_default.png';
          else newdict['poster_path']='https://image.tmdb.org/t/p/original'+result_list[index]['poster_path'];
          newdict['showname']=result_list[index]['title'];
          tmp_list.push(newdict);
          this.popular_movie_list_sm.push(newdict);
        }
        this.popular_movie_list.push(tmp_list);
        //console.log(this.popular_movie_list);
      }
    )
  }
  getPopTv(){
    this.popular_tv_list=[];
    var tmp_list=[];
    this._service.others("tv","popular").subscribe(
      (data)=>{ 
        var result_list=data['results'];
        for(var index=0;index<result_list.length;index++){
          if(index!=0&&index%6==0){
            this.popular_tv_list.push(tmp_list);
            tmp_list=[];
          }
          var newdict={};
          newdict['media']="tv";
          newdict['id']=result_list[index]['id'];
          if(result_list[index]['poster_path']==null) newdict['poster_path']='assets/img/poster_default.png';
          else newdict['poster_path']='https://image.tmdb.org/t/p/original'+result_list[index]['poster_path'];
          newdict['showname']=result_list[index]['name'];
          tmp_list.push(newdict);
          this.popular_tv_list_sm.push(newdict);
        }
        this.popular_tv_list.push(tmp_list);
        //console.log(this.popular_tv_list);
      }
    )
  }
  getTopMov(){
    this.top_movie_list=[];
    var tmp_list=[];
    this._service.others("movie","top_rated").subscribe(
      (data)=>{ 
        var result_list=data['results'];
        for(var index=0;index<result_list.length;index++){
          if(index!=0&&index%6==0){
            this.top_movie_list.push(tmp_list);
            tmp_list=[];
          }
          var newdict={};
          newdict['media']="movie";
          newdict['id']=result_list[index]['id'];
          if(result_list[index]['poster_path']==null) newdict['poster_path']='assets/img/poster_default.png';
          else newdict['poster_path']='https://image.tmdb.org/t/p/original'+result_list[index]['poster_path'];
          newdict['showname']=result_list[index]['title'];
          tmp_list.push(newdict);
          this.top_movie_list_sm.push(newdict);
        }
        this.top_movie_list.push(tmp_list);
        //console.log(this.top_movie_list);
      }
    )
  }
  getTopTv(){
    this.top_tv_list=[];
    var tmp_list=[];
    this._service.others("tv","top_rated").subscribe(
      (data)=>{ 
        var result_list=data['results'];
        for(var index=0;index<result_list.length;index++){
          if(index!=0&&index%6==0){
            this.top_tv_list.push(tmp_list);
            tmp_list=[];
          }
          var newdict={};
          newdict['media']="tv";
          newdict['id']=result_list[index]['id'];
          if(result_list[index]['poster_path']==null) newdict['poster_path']='assets/img/poster_default.png';
          else newdict['poster_path']='https://image.tmdb.org/t/p/original'+result_list[index]['poster_path'];
          newdict['showname']=result_list[index]['name'];
          tmp_list.push(newdict);
          this.top_tv_list_sm.push(newdict);
        }
        this.top_tv_list.push(tmp_list);
        //console.log(this.top_tv_list);
      }
    )
  }  
  getTreMov(){
    this.trending_movie_list=[];
    var tmp_list=[];
    this._service.others("movie","trending").subscribe(
      (data)=>{ 
        var result_list=data['results'];
        for(var index=0;index<result_list.length;index++){
          if(index!=0&&index%6==0){
            this.trending_movie_list.push(tmp_list);
            tmp_list=[];
          }
          var newdict={};
          newdict['media']="movie";
          newdict['id']=result_list[index]['id'];
          if(result_list[index]['poster_path']==null) newdict['poster_path']='assets/img/poster_default.png';
          else newdict['poster_path']='https://image.tmdb.org/t/p/original'+result_list[index]['poster_path'];
          newdict['showname']=result_list[index]['title'];
          tmp_list.push(newdict);
          this.trending_movie_list_sm.push(newdict);
        }
        this.trending_movie_list.push(tmp_list);
        //console.log(this.trending_movie_list);
      }
    )
  }
  getTreTv(){
    this.trending_tv_list=[];
    var tmp_list=[];
    this._service.others("tv","trending").subscribe(
      (data)=>{ 
        var result_list=data['results'];
        for(var index=0;index<result_list.length;index++){
          if(index!=0&&index%6==0){
            this.trending_tv_list.push(tmp_list);
            tmp_list=[];
          }
          var newdict={};
          newdict['media']="tv";
          newdict['id']=result_list[index]['id'];
          if(result_list[index]['poster_path']==null) newdict['poster_path']='assets/img/poster_default.png';
          else newdict['poster_path']='https://image.tmdb.org/t/p/original'+result_list[index]['poster_path'];
          newdict['showname']=result_list[index]['name'];
          tmp_list.push(newdict);
          this.trending_tv_list_sm.push(newdict);
        }
        this.trending_tv_list.push(tmp_list);
        //console.log(this.trending_tv_list);
      }
    )
  }  

}
