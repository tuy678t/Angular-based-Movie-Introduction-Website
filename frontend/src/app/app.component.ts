import {Component, Injectable,ViewEncapsulation } from '@angular/core';
import {Observable, OperatorFunction, of} from 'rxjs';
import {debounceTime, map,} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';




@Injectable()
export class TMDBService {
  constructor(private http: HttpClient) {}
  search(term: string) {
    if (term == '') {
      return of([]);
    }
    term=term.replace(/ /g,"%20");
    var search_url="https://czhou240-csci571-hw8-nodejs.wm.r.appspot.com/search/"+term;
    return this.http.get<[any, string[]]>(search_url);
  }
  carousel(){
    var search_url="https://czhou240-csci571-hw8-nodejs.wm.r.appspot.com/home_carousel";
    return this.http.get<[any, string[]]>(search_url);
  }

  others(media:string,category:string){
    var search_url="https://czhou240-csci571-hw8-nodejs.wm.r.appspot.com/other_carousel/"+media+"/"+category;
    return this.http.get<[any, string[]]>(search_url);
  }

  details(id:string,media:string){
    var search_url="https://czhou240-csci571-hw8-nodejs.wm.r.appspot.com/details/"+media+"/"+id;
    return this.http.get<[any, string[]]>(search_url);
  }

  reviews(id:string,media:string){
    var search_url="https://czhou240-csci571-hw8-nodejs.wm.r.appspot.com/reviews/"+media+"/"+id;
    return this.http.get<[any, string[]]>(search_url);
  }

  
  casts(id:string,media:string){
    var search_url="https://czhou240-csci571-hw8-nodejs.wm.r.appspot.com/casts/"+media+"/"+id;
    return this.http.get<[any, string[]]>(search_url);
  }

  recommended(id:string,media:string){
    var search_url="https://czhou240-csci571-hw8-nodejs.wm.r.appspot.com/recommended/"+media+"/"+id;
    return this.http.get<[any, string[]]>(search_url);
  }

  similar(id:string,media:string){
    var search_url="https://czhou240-csci571-hw8-nodejs.wm.r.appspot.com/similar/"+media+"/"+id;
    return this.http.get<[any, string[]]>(search_url);
  }

  videos(id:string,media:string){
    var search_url="https://czhou240-csci571-hw8-nodejs.wm.r.appspot.com/videos/"+media+"/"+id;
    return this.http.get<[any, string[]]>(search_url);
  }

  castdetails(id:string){
    var search_url="https://czhou240-csci571-hw8-nodejs.wm.r.appspot.com/castdetails/"+id;
    return this.http.get<[any, string[]]>(search_url);
  }

  castdetails2(id:string){
    var search_url="https://czhou240-csci571-hw8-nodejs.wm.r.appspot.com/castdetails2/"+id;
    return this.http.get<[any, string[]]>(search_url);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [TMDBService]
})
export class AppComponent {
  public model: any;
  public search_return_list=[];
  constructor(private _service: TMDBService,
    private router: Router,) {}


  ngOnInit(){

  }
  

  onSelect($event) {
    $event.preventDefault();
    this.model = null;
    this.router.navigate(['/watch/', $event.item.routerLink]);
} ;
  

  getSearchResult(term){
    //console.log(term);
    this.search_return_list=[];
    this._service.search(term).subscribe(
      (data)=>{
        var result_list=data['results'];
        this.search_return_list=[];
        for(var index=0;index<result_list.length;index++){
          if(this.search_return_list.length==7) break;
          if(result_list[index]['backdrop_path']==null) continue;
          var newdict={};
          if(result_list[index]['media_type']=='tv'){     
            newdict['showname']=result_list[index]['name'];
            newdict['backdrop_path']='https://image.tmdb.org/t/p/original'+result_list[index]['backdrop_path'];
            newdict['routerLink']='/watch/tv/'+result_list[index]['id'];
          }
          else if(result_list[index]['media_type']=='movie'){
            newdict['id']=result_list[index]['id'];
            newdict['showname']=result_list[index]['title'];
            newdict['backdrop_path']='https://image.tmdb.org/t/p/original'+result_list[index]['backdrop_path'];
            newdict['routerLink']='/watch/movie/'+result_list[index]['id'];
          }
          else continue;
          this.search_return_list.push(newdict);
        }
      }
    )
  }


  show(obj){
    console.log(obj)
  }

  searchClick(routerLink){
    console.log(routerLink)
    this.router.navigate([routerLink]);
  }

  search: OperatorFunction<string, readonly {showname, backdrop_path}[]> = (text$: Observable<string>) =>{
    return text$.pipe(
      map(term=>{
        this.search_return_list=[];
        if(term!=""){
          this.getSearchResult(term);
        }
        return term;
      }),
      debounceTime(1000),
      map(term=>{
        if(term=="") return [];
        else return this.search_return_list.slice(0, 7);
      })
    )
  }

  formatter = (x: {showname: string}) => x.showname;
}
