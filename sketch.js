//Create variables here
var dog, happyDog
var dogImg, happyDogImg
var database
var foodS, foodStock
var milkImg;
var feed, addFood, fedTime, lastFed, foodObj;

function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();

  createCanvas(500, 500);
  
  dog = createSprite(250,250,10,10);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  foodObj = new Food(700,200,10,10);

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add More Food :)");
  addFood.position(700,135);
  addFood.mousePressed(addFood);


  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
}

function draw() {  
  background(255,204,255);
 
  drawSprites();
  foodObj.display();

  fedTime = database.ref("Feed Time");
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  textSize(20);
  fill(255);
  text("Food:"+ foodS,10,20);

  if(lastFed >= 12){
    text("Last Fed: " + lastFed%12 + "PM", 350,30);
  } else if(lastFed === 0){
    text("Last Fed: 12 AM",350,50);
  } else{
    text("Last Fed: " + lastFed%12 + "AM", 350,30);
  }
}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  } else {
    x = x-1;
  }

  database.ref('/').update({
    Food:x
  });
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    fedTime:hour()
  })
}

function addFood(){
  foodObj= foodObj+1;
  database.ref('/').update({
    Food:foodS
  })
}


