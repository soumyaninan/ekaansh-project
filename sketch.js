var PLAY=1;
var END=0;
var gameState=PLAY;
var ground,invisibleGround;
var score=0;
var player;
var gameOver,restart;
var cloudsGroup,cloudImage;
var obstacleGroup,obstacle1Image,obstacle2Image,obstacle3Image,obstacle4Image,obstacle5Image,obstacle6Image;
var player_running,groundImage,backgroundImage,restartImage,gameOverImage,player_jumping,player_colllided,endImage;



function preload(){

  backgroundImage = loadImage("background.jpg");
  groundImage = loadImage("ground2.png");
  player_running = loadAnimation("multiple1.png","multiple2.png","multiple3.png","multiple4.png","multiple5.png","multiple6.png","multiple7.png","multiple8.png");
  //endImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
  cloudImage = loadImage("cloud.png");
  player_jumping = loadAnimation("jumping.png");
  player_collided = loadAnimation("collided.jpg");

  obstacle1Image  = loadImage("obstacle1.jpg");
  obstacle2Image  = loadImage("obstacle2.jpg");
  obstacle3Image  = loadImage("obstacle3.jpg");
  obstacle4Image  = loadImage("obstacle4.jpg");
  obstacle5Image  = loadImage("obstacle5.jpg");
  obstacle6Image  = loadImage("obstacle6.jpg");

}
function setup(){
  createCanvas(1200,500);

  player = createSprite(200,470,30,30);
  player.addAnimation("running", player_running);
  player.addAnimation("jumping", player_jumping);
  player.addAnimation("collided", player_collided);
  player.scale=1.1;

  ground = createSprite(600,470,1200,500);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2
  ground.velocityX = -(6+3*score/100); 

  invisibleGround = createSprite(600,1500,1200,500);
  invisibleGround.visible= false;

gameOver = createSprite(200,500);
restart = createSprite(200,340);
gameOver.addImage(gameOverImage);
gameOver.scale = 0.5;
restart.addImage(restartImage);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;


cloudsGroup = new Group();
obstacleGroup= new Group();

textSize(30);
textFont("Georgia");
textStyle(BOLD);

localStorage["HighestScore"]=0;

}
function draw(){
  background(backgroundImage);
  text("SCORE = "+score,900,90);

  if(gameState===PLAY){
  if(ground.x<0){
    ground.x=ground.width/2;
  }
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 2*score/100);
    if(keyDown("space") && player.y>=395){
      player.velocityY= -15;
      player.changeAnimation("jumping", player_jumping)
    }
    
    player.velocityY=player.velocityY+0.99;

    if(player.collide(ground)){
      player.changeAnimation("running", player_running);
    }
    
    spawnClouds();
    spawnObstacles();

    if(obstacleGroup.isTouching(player)){
      gameState=END;
      
    }
  }

  else if (gameState === END) {

   // gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    player.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    player.changeAnimation("collided",player_collided);
    
    obstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
}


function spawnClouds() {
  if (frameCount % 80 === 0) {
    var cloud = createSprite(1250,200,40,10);
    cloud.y = Math.round(random(100,200));
    cloud.addImage("cloud",cloudImage);
 
    cloud.velocityX = -3;
    
    cloud.lifetime = 420;
    
    cloud.depth = player.depth;
    player.depth = player.depth + 1;
    
    cloudsGroup.add(cloud);
  }
  
}
function spawnObstacles() {
  if(frameCount % 70 === 0) {
    var obstacle = createSprite(1250,430,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1Image);
              break;
      case 2: obstacle.addImage(obstacle2Image);
              break;
      case 3: obstacle.addImage(obstacle3Image);
              break;
      case 4: obstacle.addImage(obstacle4Image);
              break;   
      case 5: obstacle.addImage(obstacle5Image);
              break;
      case 6: obstacle.addImage(obstacle6Image);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstacleGroup.add(obstacle);
  }
}
function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  
  obstacleGroup.destroyEach();
  cloudsGroup.destroyEach();

  player.changeAnimation("running",player_running);
  score=0;
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"]=score;

    score=0;
    console.log( localStorage["HighestScore"]);
  }
}