require("dotenv").config({ path: __dirname + "/config/config.env" });
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find(function(err, posts){
    if(!err){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
    }
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/",function(req, res){

})

app.post("/compose", function(req, res){
  const post = new Post({
    title : req.body.postTitle,
    content : req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id : requestedPostId}, function(err, post){
    if(!err){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});


//Weather API


app.get("/weather", function(req, res) {
      res.render("weather");

})

app.post("/weather", function(req, res){

  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric";

  const url ="https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  https.get(url, function(response) {

    console.log(response.statusCode);

    let wdata = '';

    response.on('data', data => wdata += data);

    response.on('end', function() {

      const pwdata = JSON.parse(wdata);

      const temp = pwdata.main.temp;

      const wdescr = pwdata.weather[0].description;

      const icon = pwdata.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      const content = "The temperature in " + query + " is " +  temp + " degrees Celscius";
      const body = "The weather is currently " + wdescr;

      res.render("display",{content:content, body:body, imageURL:imageURL});
    })

  })
})

app.get("/date", function(req,res){
  const date = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };

    const body = date.toLocaleDateString("en-US", options);
    const content = date.toLocaleTimeString("en-US");
    res.render("date_time",{content:content, body:body});

})


app.listen(process.env.PORT, function() {
  console.log("Server started on port 3000");
});
