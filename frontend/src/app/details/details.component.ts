import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {TMDBService} from '../app.component'
import { NgbModal,NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  
  watchCategory:string;
  watchId:string;

  apiLoaded = false;


  constructor(
      private _activatedRoute: ActivatedRoute,
      private route: ActivatedRoute,
      private _service: TMDBService,
      private modalService: NgbModal
  ) {
      this._activatedRoute.paramMap.subscribe(params => {
          this.ngOnInit();
      });
  }

  
  details_json={};
  reviews_list=[];
  reviews_loaded=false;
  reviews_length=0;
  casts_list=[];
  casts_loaded=false;
  recommended_list=[];
  recommended_loaded=false;
  similar_list=[];
  similar_loaded=false;
  title_string="";
  videos_json={};
  watch_list_string='';
  watch_list_alert_string='';
  watch_list_alert_type='success';

  recordHistory(){
    let myStorage = window.localStorage;
    let myContinueList_string=myStorage.getItem('continue_list');
    if(myContinueList_string==null) myContinueList_string="[]";
    let continue_list;
    eval("continue_list = "+myContinueList_string);
    for(let ind=0;ind<continue_list.length;ind++){
      if(continue_list[ind]['id']==this.watchId&&continue_list[ind]['media']==this.watchCategory){
        continue_list.splice(ind,1);
        break;
      }
    }
    let newItems={};
    newItems['id']=this.watchId;
    newItems['media']=this.watchCategory;
    newItems['poster_path']=this.details_json['poster_path'];
    newItems['showname']=this.details_json['showname'];
    continue_list.push(newItems);
    let myContinueList_resultstring=JSON.stringify(continue_list);
    localStorage.setItem('continue_list', myContinueList_resultstring);
    //console.log(continue_list);
  }

  getDetails(Id,Category){
    this.details_json=[];
    this._service.details(Id,Category).subscribe(
      (data)=>{
        this.details_json={};
        //console.log("Details");
        //console.log(data);
        var result_json=data;
        if(Category=='tv'){
          this.details_json['showname']=result_json['name'];
          this.details_json['genres']="";
          for(var index=0;index<result_json['genres'].length;index++){
            if(index==0){
              this.details_json['genres']=result_json['genres'][index]['name'];
            }
            else{
              this.details_json['genres']+=", "+result_json['genres'][index]['name'];
            }
          }
          this.details_json['spoken_languages']="";
          for(var index=0;index<result_json['spoken_languages'].length;index++){
            if(index==0){
              this.details_json['spoken_languages']=result_json['spoken_languages'][index]['english_name'];
            }
            else{
              this.details_json['spoken_languages']+=", "+result_json['spoken_languages'][index]['english_name'];
            }
          }
          this.details_json['date']=result_json['first_air_date'].substr(0,4);
          if(result_json['episode_run_time']%60==0){
            this.details_json['runtime']=Math.floor(result_json['episode_run_time']/60)+"hrs";
          }
          else{
            this.details_json['runtime']=Math.floor(result_json['episode_run_time']/60)+"hrs "+result_json['episode_run_time']%60+"mins";
          }
          this.details_json['overview']=result_json['overview'];
          this.details_json['vote_average']=result_json['vote_average'];
          this.details_json['tagline']=result_json['tagline'];
          this.details_json['poster_path']="https://image.tmdb.org/t/p/w185"+result_json['poster_path'];
        }
        else{
          this.details_json['showname']=result_json['title'];
          this.details_json['genres']="";
          for(var index=0;index<result_json['genres'].length;index++){
            if(index==0){
              this.details_json['genres']=result_json['genres'][index]['name'];
            }
            else{
              this.details_json['genres']+=", "+result_json['genres'][index]['name'];
            }
          }
          this.details_json['spoken_languages']="";
          for(var index=0;index<result_json['spoken_languages'].length;index++){
            if(index==0){
              this.details_json['spoken_languages']=result_json['spoken_languages'][index]['english_name'];
            }
            else{
              this.details_json['spoken_languages']+=", "+result_json['spoken_languages'][index]['english_name'];
            }
          }
          this.details_json['date']=result_json['release_date'].substr(0,4);
          if(result_json['runtime']%60==0){
            this.details_json['runtime']=Math.floor(result_json['runtime']/60)+"hrs";
          }
          else{
            this.details_json['runtime']=Math.floor(result_json['runtime']/60)+"hrs "+result_json['runtime']%60+"mins";
          }
          this.details_json['overview']=result_json['overview'];
          this.details_json['vote_average']=result_json['vote_average'];
          this.details_json['tagline']=result_json['tagline'];
          this.details_json['poster_path']="https://image.tmdb.org/t/p/w185"+result_json['poster_path'];
        }
        let location=this.judgeInWatchList();
        if(location!=-1){
          this.watch_list_string="Remove from Watchlist";
          this.shiftToTop(location)
        }
        else{
          this.watch_list_string="Add to Watchlist";
        }
        this.recordHistory();
        //console.log(this.details_json);
      });
  }
  getReviews(Id,Category){
    this.reviews_loaded=false;
    this.reviews_list=[];
    this.reviews_length=0;
    this._service.reviews(Id,Category).subscribe(
      (data)=>{
        this.reviews_list=[];
        //console.log(data)
        var result_list=data['results'];
        for(var index=0;index<result_list.length;index++){
          var newdict={};
          newdict['author']=result_list[index]['author'];
          newdict['content']=result_list[index]['content'];
          //2020-12-18T14:08:08.440Z
          var d=new Date(result_list[index]['created_at'])
          newdict['created_at']=d;
          // let month=result_list[index]['created_at'].substr(5,2);
          // let year=result_list[index]['created_at'].substr(0,4);
          // let day=Number(result_list[index]['created_at'].substr(8,2));
          // let hour=result_list[index]['created_at'].substr(11,2);
          // let mise=result_list[index]['created_at'].substr(14,5);
          // if(month=="01"){
          //   newdict['created_at']="January"
          // }
          // else if(month=="02"){
          //   newdict['created_at']="February"
          // }
          // else if(month=="03"){
          //   newdict['created_at']="March"
          // }
          // else if(month=="04"){
          //   newdict['created_at']="April"
          // }
          // else if(month=="05"){
          //   newdict['created_at']="May"
          // }
          // else if(month=="06"){
          //   newdict['created_at']="June"
          // }
          // else if(month=="07"){
          //   newdict['created_at']="July"
          // }
          // else if(month=="08"){
          //   newdict['created_at']="August"
          // }
          // else if(month=="09"){
          //   newdict['created_at']="September"
          // }
          // else if(month=="10"){
          //   newdict['created_at']="October"
          // }
          // else if(month=="11"){
          //   newdict['created_at']="November"
          // }
          // else if(month=="12"){
          //   newdict['created_at']="December"
          // }
          // else{
          //   newdict['created_at']=""
          // }
          // newdict['created_at']+=" ";
          // newdict['created_at']+=day+", "+year+", ";
          // if(hour==12) newdict['created_at']+=12+":"+mise+" PM";
          // else if(hour==24) newdict['created_at']+=12+":"+mise+" AM";
          // else if(hour>12) newdict['created_at']+=hour-12+":"+mise+" PM";
          // else newdict['created_at']+=hour+":"+mise+" AM";
          newdict['url']=result_list[index]['url'];
          if(result_list[index]['author_details']['rating']==null){
            newdict['rating']=0;
          }
          else{
            newdict['rating']=result_list[index]['author_details']['rating'];
          }
          if(result_list[index]['author_details']['avatar_path']==null){
            newdict['avatar_path']="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHnPmUvFLjjmoYWAbLTEmLLIRCPpV_OgxCVA&usqp=CAU";
          }
          else{
            if(result_list[index]['author_details']['avatar_path'].indexOf('/https://secure.gravatar.com/avatar/')==0){
              newdict['avatar_path']=result_list[index]['author_details']['avatar_path'].substr(1);
            }
            else{
              newdict['avatar_path']="https://image.tmdb.org/t/p/original"+result_list[index]['author_details']['avatar_path'];
            }
          }
          this.reviews_list.push(newdict);
          //console.log("add");
          //console.log(this.reviews_list);
        }
        this.reviews_list=this.reviews_list.slice(0,10);
        this.reviews_loaded=true;
        this.reviews_length=this.reviews_list.length;
        //console.log(this.reviews_list);
      });
  }
  getCasts(Id,Category){
    this.casts_loaded=false;
    this.casts_list=[];
    this._service.casts(Id,Category).subscribe(
      (data)=>{
        this.casts_list=[];
        var result_list=data['cast'];
        for(var index=0;index<result_list.length;index++){
          if(result_list[index]['profile_path']==null) continue;
          var newdict={};
          newdict['id']=result_list[index]['id'];
          newdict['name']=result_list[index]['name'];
          newdict['character']=result_list[index]['character'];
          newdict['profile_path']="https://image.tmdb.org/t/p/w500/"+result_list[index]['profile_path'];
          this.casts_list.push(newdict);
        }
        this.casts_loaded=true;
        //console.log(this.casts_list);
      });
  }
  recommended_list_sm=[];
  getRecommended(Id,Category){
    this.recommended_list=[];
    this.recommended_list_sm=[];
    this.recommended_loaded=false;
    this._service.recommended(Id,Category).subscribe(
      (data)=>{
        this.recommended_list=[];
        this.recommended_list_sm=[];
        var result_list=data['results'];
        var use_list=[];
        for(var index=0;index<result_list.length;index++){
          if(index!=0&&index%6==0){
            this.recommended_list.push(use_list);
            use_list=[];
          }
          var newdict={};
          newdict['id']=result_list[index]['id'];
          if(result_list[index]['poster_path']==null){
            newdict['poster_path']="assets/img/poster_default.png"
          }
          else{
            newdict['poster_path']="https://image.tmdb.org/t/p/w185"+result_list[index]['poster_path'];
          }
          if(Category=="movie"){
            newdict['showname']=result_list[index]['title'];
            newdict['media']='movie';
          }
          else{
            newdict['showname']=result_list[index]['name'];
            newdict['media']='tv';
          }
          use_list.push(newdict);
          this.recommended_list_sm.push(newdict);
        }
        if(use_list.length!=0){
          this.recommended_list.push(use_list);
        }
        //console.log(this.recommended_list);
        this.recommended_loaded=true;
      });
  }
  similar_list_sm=[];
  getSimilar(Id,Category){
    this.similar_list=[];
    this.similar_list_sm=[];
    this.similar_loaded=false;
    this._service.similar(Id,Category).subscribe(
      (data)=>{
        this.similar_list=[];
        this.similar_list_sm=[];
        var result_list=data['results'];
        var use_list=[];
        for(var index=0;index<result_list.length;index++){
          //console.log(index)
          if(index!=0&&index%6==0){
            this.similar_list.push(use_list);
            use_list=[];
          }
          var newdict={};
          newdict['id']=result_list[index]['id'];
          if(result_list[index]['poster_path']==null){
            newdict['poster_path']="assets/img/poster_default.png"
          }
          else{
            newdict['poster_path']="https://image.tmdb.org/t/p/w185"+result_list[index]['poster_path'];
          }
          if(Category=="movie"){
            newdict['showname']=result_list[index]['title'];
            newdict['media']='movie';
          }
          else{
            newdict['showname']=result_list[index]['name'];
            newdict['media']='tv';
          }
          use_list.push(newdict);
          this.similar_list_sm.push(newdict);
        }
        if(use_list.length!=0){
          this.similar_list.push(use_list);
        }
        
        //console.log(this.similar_list);
        this.similar_loaded=true;
      });
  }
  getVideos(Id,Category){
    this.videos_json=[];
    this._service.videos(Id,Category).subscribe(
      (data)=>{
        var result_list=data['results'];
        //console.log(result_list);
        for(var index=0;index<result_list.length;index++){
          if(result_list[index]['type']=='Trailer'&&result_list[index]['site']=='YouTube'){
            this.videos_json['site']=result_list[index]['site'];
            this.videos_json['type']=result_list[index]['type'];
            this.videos_json['name']=result_list[index]['name'];
            this.videos_json['key']=result_list[index]['key'];
            //console.log(this.videos_json);
            return;
          }
        }
        for(var index=0;index<result_list.length;index++){
          if(result_list[index]['type']=='Teaser'&&result_list[index]['site']=='YouTube'){
            this.videos_json['site']=result_list[index]['site'];
            this.videos_json['type']=result_list[index]['type'];
            this.videos_json['name']=result_list[index]['name'];
            this.videos_json['key']=result_list[index]['key'];
            //console.log(this.videos_json);
            return;
          }
        }
          this.videos_json['site']='YouTube';
          this.videos_json['type']='Default';
          this.videos_json['name']='Default';
          this.videos_json['key']='tzkWB85ULJY';
          //console.log(this.videos_json);
      });
  }

  private _success = new Subject<string>();
  @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert: NgbAlert;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.watchId = params.get('watchId');
      this.watchCategory = params.get('watchCategory');
    });
    this.getDetails(this.watchId,this.watchCategory);
    this.getReviews(this.watchId,this.watchCategory);
    this.getCasts(this.watchId,this.watchCategory);
    this.getRecommended(this.watchId,this.watchCategory);
    this.getSimilar(this.watchId,this.watchCategory);
    this.getVideos(this.watchId,this.watchCategory);
    if(this.watchCategory=="tv") this.title_string="TV Shows";
    else this.title_string="Movies";

    if(!this.apiLoaded){
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded=true;
    }

    // const tag1=document.createElement('link');
    // tag1.rel="stylesheet";
    // tag1.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    // document.body.appendChild(tag1);
    const tag1=document.createElement('script');
    tag1.crossOrigin="anonymous";
    tag1.src="https://kit.fontawesome.com/ffb0f7b977.js";
    document.body.appendChild(tag1);

    this._success.subscribe(message => this.watch_list_alert_string = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });

    let input_up=document.getElementById('searchInput')
    console.log('!important')
    console.log(input_up);
    input_up.nodeValue="";


    let nav_bar_list=document.getElementById('nav_bar_list')
    nav_bar_list.setAttribute("class","nav-item");
    let nav_bar_home=document.getElementById('nav_bar_home')
    nav_bar_home.setAttribute("class","nav-item");


    let select_button=document.getElementById('navbar_button');
    select_button.className="navbar-toggler collapsed";
    select_button.setAttribute("aria-expanded","false");
    let select_part=document.getElementById('navbarSupportedContent');
    select_part.className="collapse navbar-collapse";
  }


 

  cast_details={};
  cast_details2={};
  getCastDetails(id){
    this._service.castdetails(id).subscribe(
      (data)=>{
        //console.log(data);
        this.cast_details['birthday']=data['birthday'];
        if(data['gender']==1){
          this.cast_details['gender']="Female";
        }
        else if(data['gender']==2){
          this.cast_details['gender']="Male";
        }
        else{
          this.cast_details['gender']="Undefined";
        }
        this.cast_details['name']=data['name'];
        this.cast_details['homepage']=data['homepage'];
        this.cast_details['also_known_as']=null;
        for(var index=0;index<data['also_known_as'].length;index++){
          if(index==0) this.cast_details['also_known_as']=data['also_known_as'][index];
          else{
            this.cast_details['also_known_as']+=","+data['also_known_as'][index];
          }
        }
        this.cast_details['known_for_department']=data['known_for_department'];
        this.cast_details['biography']=data['biography'];
        this.cast_details['place_of_birth']=data['place_of_birth'];
        
        //console.log(this.cast_details);
      }
    )
    this._service.castdetails2(id).subscribe(
      (data)=>{
        if(data['imdb_id']!=null){
          this.cast_details2['imdb']="https://www.imdb.com/name/"+data['imdb_id'];
        }
        else{
          this.cast_details2['imdb']=null;
        }
        if(data['facebook_id']!=null){
          this.cast_details2['facebook']="https://facebook.com/"+data['facebook_id'];
        }
        else{
          this.cast_details2['facebook']=null;
        }
        if(data['instagram_id']!=null){
          this.cast_details2['instagram']="https://instagram.com/"+data['instagram_id'];
        }
        else{
          this.cast_details2['instagram']=null;
        }
        if(data['twitter_id']!=null){
          this.cast_details2['twitter']="https://twitter.com/"+data['twitter_id'];
        }
        else{
          this.cast_details2['twitter']=null;
        }

        //console.log(this.cast_details2);
      }
    )
  }

  openModal(mymodal,cast_id,poster_path){
    //console.log(cast_id);
    this.cast_details['poster_path']=poster_path;
    this.getCastDetails(cast_id);
    this.modalService.open(mymodal, { size: 'lg', scrollable: true });
  }

  judgeInWatchList(){
    let myStorage = window.localStorage;
    let myWatchList_string=myStorage.getItem('watch_list');
    if(myWatchList_string==null) return -1;
    else{
      let myWatchList;
      eval("myWatchList = "+myWatchList_string);
      for(let i=0;i<myWatchList.length;i++){
        if(myWatchList[i]['media']==this.watchCategory&&myWatchList[i]['id']==this.watchId) return i;
      }
      return -1;
    }
  }

  hover_on(bi){
    console.log(bi);
    let bt=document.getElementById(bi);
    bt.click();
  }

  shiftToTop(location){
    let myStorage = window.localStorage;
    let myWatchList_string=myStorage.getItem('watch_list');
    let myWatchList;
    eval("myWatchList = "+myWatchList_string);
    myWatchList.splice(location,1);
    let newItems={};
    newItems['id']=this.watchId;
    newItems['media']=this.watchCategory;
    newItems['poster_path']=this.details_json['poster_path'];
    newItems['showname']=this.details_json['showname'];
    myWatchList.push(newItems);
    let myWatchList_resultstring=JSON.stringify(myWatchList);
    localStorage.setItem('watch_list', myWatchList_resultstring);
    return;

  }

  clickOnButton(){
    let index=this.judgeInWatchList()
    let myStorage = window.localStorage;
    let myWatchList_string=myStorage.getItem('watch_list');
    if(myWatchList_string==null) myWatchList_string="[]";
    let myWatchList;
    eval("myWatchList = "+myWatchList_string);
    //console.log(myWatchList)
    if(index==-1){
      let newItems={};
      newItems['id']=this.watchId;
      newItems['media']=this.watchCategory;
      newItems['poster_path']=this.details_json['poster_path'];
      newItems['showname']=this.details_json['showname'];
      myWatchList.push(newItems);
      let myWatchList_resultstring=JSON.stringify(myWatchList);
      localStorage.setItem('watch_list', myWatchList_resultstring);
      this.watch_list_alert_type='success';
      this._success.next('Added to watchList');
      this.watch_list_string="Remove from Watchlist";
    }else{
      myWatchList.splice(index,1);
      let myWatchList_resultstring=JSON.stringify(myWatchList);
      localStorage.setItem('watch_list', myWatchList_resultstring);
      this.watch_list_alert_type='danger';
      this._success.next('Removed from watchList');
      this.watch_list_string="Add to Watchlist";
    }
  }
}
