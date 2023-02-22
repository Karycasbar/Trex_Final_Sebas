
var trex ,trex_running, trex_collide;
var edges;
var ground, invisibleGround;
var groundImage;
var cloud, cloudImage;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var obstaclesGroup, cloudsGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverImg, restartImg, gameOver, restart;
var jumpSound, checkPointSound, dieSound;

  function preload(){
      trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
      groundImage = loadImage("ground2.png");
      cloudImage = loadImage("cloud.png");
      trex_collide = loadAnimation("trex_collided.png");

      obstacle1 = loadImage("obstacle1.png");
      obstacle2 = loadImage("obstacle2.png");
      obstacle3 = loadImage("obstacle3.png");
      obstacle4 = loadImage("obstacle4.png");
      obstacle5 = loadImage("obstacle5.png");
      obstacle6 = loadImage("obstacle6.png");

      gameOverImg = loadImage("gameOver.png");
      restartImg = loadImage("restart.png");
      jumpSound = loadSound("jump.mp3");
      checkPointSound = loadSound("checkPoint.mp3");
      dieSound = loadSound("die.mp3");
  }

  function setup(){
    createCanvas(windowWidth,windowHeight);
    
    //crear sprite del t-rex.
    trex = createSprite(50, height-70, 20, 50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collide);
    trex.scale = 0.5;

    trex.setCollider("circle", 0, 0, 40);
    //trex.debug = true;

    //creacion del suelo
    ground = createSprite(width/2,height-80,width,20);
    ground.addImage("ground", groundImage);

    //crear un sprite invisible
    invisibleGround = createSprite(width/2,height-10,width,125);
    invisibleGround.visible = false;

    //variable que guarda los bordes
    edges = createEdgeSprites();

    /*var rand = Math.round(random(1,100));
    console.log(rand);*/

    gameOver = createSprite(width/2, height/2 -50);
    gameOver.addImage(gameOverImg);

    restart = createSprite(width/2, height/2);
    restart.addImage(restartImg);

    gameOver.scale = 0.5;
    restart.scale = 0.5;

    obstaclesGroup = new Group();
    cloudsGroup = new Group();

    
    
  
  }

function draw(){
  background("white");

  

  //console.log(frameCount);

  //texto para la puntuación
  fill("black");
  text("Puntuación: " + score, width/2, 50);


  if(gameState == PLAY){
    gameOver.visible = false;
    restart.visible = false;
  //Suelo moviendose
  ground.velocityX = -(5 + score / 100);

  //generar la puntuación
  score = score + Math.round(getFrameRate() / 60);
  if(score > 0 && score % 100 == 0){
    checkPointSound.play();
  }

  if(ground.x<0){
    ground.x = ground.width/2;
  }

  //salto del trex
  if((touches.length > 0 || keyDown("space")) && trex.y >= height - 180 ){
    trex.velocityY = -10;
    jumpSound.play();
    touches = [];
  }
  //agregando gravedad al dino
  trex.velocityY = trex.velocityY + 0.5

    //aparece las nubes y obstaculos
    spawnClouds();
    spawnObstacles();

  if(obstaclesGroup.isTouching(trex)){
    gameState = END;
    dieSound.play();

  }

  }
  else if(gameState == END){
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    //cambio de animación del Trex
    trex.changeAnimation("collided", trex_collide);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    //Establecer un ciclo de vidad a los grupos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.velocityY = 0;

    /*if(mousePressedOver(restart)){
      reset();
    }*/

    if(touches.length > 0 || mousePressedOver(restart)){
      reset();
      touches = [];
    }
  }
  


  trex.collide(invisibleGround);  

  drawSprites();

}

function spawnClouds(){
  if(frameCount % 60 == 0){
    cloud = createSprite(width + 20, height, 40, 10);
    cloud.velocityX = -3;
    cloud.addImage(cloudImage);
    cloud.scale = 0.4;
    cloud.y = Math.round(random(10,95));

    //console.log(trex.depth);
    //console.log(cloud.depth);

    //ajuste de profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //asignar un ciclo de vida a la variable
    cloud.lifetime = 220;

    //añadir cada nube en el grupo
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if(frameCount % 60 == 0){
    obstacle = createSprite (width+20, height-95, 10, 40);
    obstacle.velocityX = -(6 + score / 100);

    //generar obstaculos al azar
    var rand = Math.round(random(1,6));
    switch (rand){
      case 1: obstacle.addImage(obstacle1);
      break;
      case 2: obstacle.addImage(obstacle2);
      break;
      case 3: obstacle.addImage(obstacle3);
      break;
      case 4: obstacle.addImage(obstacle4);
      break;
      case 5: obstacle.addImage(obstacle5);
      break;
      case 6: obstacle.addImage(obstacle6);
      break;
      default: break;
    }

    //asignar escala y ciclo de vida
    obstacle.scale = 0.5;
    obstacle.lifetime = 220;

        //añadir cada obstaculo en el grupo
        obstaclesGroup.add(obstacle);
  }
}

function reset(){
 gameState = PLAY;
 score = 0;
 gameOver.visible = false;
 restart.visible = false;
 obstaclesGroup.destroyEach();
 cloudsGroup.destroyEach();
 trex.changeAnimation("running", trex_running);
}
