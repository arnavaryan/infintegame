var PLAY = 1;
var END = 0;
var gameState = PLAY;

var pacman, pacmanclosed
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var ghostsGroup, redz, pinkz, orangez;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  pacmanImg = loadAnimation("pacman.png","pacmanclosed.png");
  
  redImg = loadImage("red.png");
  pinkImg = loadImage("pink.png");
  orangeImg = loadImage("orange.png");
  
  groundImage = loadImage("road.PNG");
  
  cloudImage = loadImage("cloud.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  pacman = createSprite(50,height-70,20,50);
  pacman.addAnimation("running", pacmanImg);
  pacman.scale = 0.1;
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("road",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  ghostsGroup = createGroup();
  cloudsGroup = createGroup();
  
  pacman.setCollider("circle",0,0,40);
  pacman.debug = false
  
  score = 0;
  
}

function draw() {
  background(180);
  //displaying score
  text("Score: "+ score,30,50);
  
  
  if(gameState === PLAY){
    pacman.visible = true;
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& pacman.y >= 100) {
        pacman.velocityY = -12;
        jumpSound.play()
    }
    
    //add gravity
    pacman.velocityY = pacman.velocityY + 0.8

    if(score>0 && score%100 === 0){
      checkPointSound.play()
    }
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnGhosts();
    
    if(ghostsGroup.isTouching(pacman)){
        gameState = END;
        dieSound.play() 
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      pacman.velocityY = 0
     
      pacman.visible = false;
     
      //set lifetime of the game objects so that they are never destroyed
    ghostsGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     ghostsGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

     if(mousePressedOver(restart)){
      reset();
     }
   }
  
 
  //stop trex from falling down
  pacman.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnGhosts(){
 if (frameCount % 60 === 0){
   var ghost = createSprite(600,height-80,20,30);
   ghost.velocityX = -6;
   ghost.velocityX = -(6 + score/100)
   
    //generate random ghosts
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: ghost.addImage(redImg);
              break;
      case 2: ghost.addImage(pinkImg);
              break;
      case 3: ghost.addImage(orangeImg);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the ghost          
    ghost.scale = 0.1;
    ghost.lifetime = 300;
   
   //add each ghost to the group
    ghostsGroup.add(ghost);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = pacman.depth;
    pacman.depth = pacman.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  } 
}

function reset(){
  gameState = PLAY;
  gameOver.visible= false;
  restart.visible= false;

  ghostsGroup.destroyEach();
  cloudsGroup.destroyEach();
  score= 0; 
  pacman.changeAnimation("running", pacman)
}  