//server.js
var express = require('express');
const axios=require('axios');
var cors=require('cors');
const app = express();
app.use(cors());
app.get('/', function(req, res) {
    res.send('Hello World');
})

const API_KEY='baf022b7d23f0b8b096c25c69fbaa641'

const url='https://api.themoviedb.org/3/trending/movie/week?api_key=baf022b7d23f0b8b096c25c69fbaa641'


//Search Query
app.get('/search/:query', function(req, res) {
  var query = req.params.query;
  var search_url="https://api.themoviedb.org/3/search/multi?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&query="+query;
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})

//Now Playing
app.get('/home_carousel', function(req, res) {
  var search_url="https://api.themoviedb.org/3/movie/now_playing?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&page=1";
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})


//Other Carousel
app.get('/other_carousel/:media/:category', function(req, res) {
  var media = req.params.media;
  var category=req.params.category;
  var search_url;
  if(category=="trending"){
    search_url="https://api.themoviedb.org/3/"+category+"/"+media+"/day"+"?api_key=baf022b7d23f0b8b096c25c69fbaa641";
  }
  else{
    search_url="https://api.themoviedb.org/3/"+media+"/"+category+"?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&page=1";
  }
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})

//Details
app.get('/details/:media/:id', function(req, res) {
  var media = req.params.media;
  var id=req.params.id;
  var search_url="https://api.themoviedb.org/3/"+media+"/"+id+"?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&page=1";
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})

//Reviews
app.get('/reviews/:media/:id', function(req, res) {
  var media = req.params.media;
  var id=req.params.id;
  var search_url="https://api.themoviedb.org/3/"+media+"/"+id+"/reviews?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&page=1";
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})


//Casts
app.get('/casts/:media/:id', function(req, res) {
  var media = req.params.media;
  var id=req.params.id;
  var search_url="https://api.themoviedb.org/3/"+media+"/"+id+"/credits?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&page=1";
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})

//Recommended
app.get('/recommended/:media/:id', function(req, res) {
  var media = req.params.media;
  var id=req.params.id;
  var search_url="https://api.themoviedb.org/3/"+media+"/"+id+"/recommendations?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&page=1";
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})

//Similar
app.get('/similar/:media/:id', function(req, res) {
  var media = req.params.media;
  var id=req.params.id;
  var search_url="https://api.themoviedb.org/3/"+media+"/"+id+"/similar?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&page=1";
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})

//Videos
app.get('/videos/:media/:id', function(req, res) {
  var media = req.params.media;
  var id=req.params.id;
  var search_url="https://api.themoviedb.org/3/"+media+"/"+id+"/videos?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&page=1";
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})

//Castdetails
app.get('/castdetails/:id', function(req, res) {
  var id=req.params.id;
  var search_url="https://api.themoviedb.org/3/person/"+id+"?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&page=1";
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})

//Castdetails2
app.get('/castdetails2/:id', function(req, res) {
  var id=req.params.id;
  var search_url="https://api.themoviedb.org/3/person/"+id+"/external_ids?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&page=1";
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})

/*
app.get('/search', function(req, res) {
  var params = req.query;
  var que=params['query'];
  var search_url="https://api.themoviedb.org/3/search/multi?api_key=baf022b7d23f0b8b096c25c69fbaa641&language=en-US&query="+que;
  axios.get(search_url)
  .then(response=>{
    res.send(response.data);
  })
  .catch(error=>console.log('Error',error));
})
*/ 

var server = app.listen(8080, function() {
    console.log("Backend Application listening at http://localhost:8080")
})