import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mylist',
  templateUrl: './mylist.component.html',
  styleUrls: ['./mylist.component.css']
})
export class MylistComponent implements OnInit {

  watchlist=[];

  constructor() { }

  ngOnInit(): void {
    let myStorage = window.localStorage;
    let myWatchList_string=myStorage.getItem('watch_list');
    if(myWatchList_string==null) myWatchList_string="[]";
    eval("this.watchlist = "+myWatchList_string);
    console.log(this.watchlist)
    let nav_bar_list=document.getElementById('nav_bar_list')
    nav_bar_list.setAttribute("class","nav-item active");
    let nav_bar_home=document.getElementById('nav_bar_home')
    nav_bar_home.setAttribute("class","nav-item");

    let select_button=document.getElementById('navbar_button');
    select_button.className="navbar-toggler collapsed";
    select_button.setAttribute("aria-expanded","false");
    let select_part=document.getElementById('navbarSupportedContent');
    select_part.className="collapse navbar-collapse";
  }

}
