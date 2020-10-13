var monkey, monkeyAni;
var ground, groundI, invisiGround;
var banana, bananaI, bananaG;
var obstacle, obstacleI, obstacleG;
var score = 0;

var foodCheck = 280;
var loseCheck = 5;
var gameState = "start";

function preload() {


  monkeyAni = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");

  bananaI = loadImage("banana.png");
  obstacleI = loadImage("obstacle.png");

  groundI = loadImage("ground.png");

  bananaG = new Group();
  obstacleG = new Group();
}



function setup() {
  createCanvas(800, 300);

  monkey = createSprite(100, 180);
  monkey.addAnimation("running", monkeyAni);
  monkey.scale = 0.12;
  monkey.velocityY = 10;

  ground = createSprite(800, 280);
  ground.addImage("ground", groundI);
  ground.velocityX = -5;

  invisiGround = createSprite(ground.x, ground.y + 5, ground.width, ground.height - 7);
  invisiGround.visible = false;
}

function draw() {

  background(10);

  if (gameState === "start") {
    monkey.visible = false;
    ground.velocityX = 0;
    monkey.collide(invisiGround);

    textSize(25);
    fill("white");
    text("Avoid Rocks", 320, 100);
    text("Eat Bananas",320,140);
    text("You lose if you hit a rock or miss 6 bananas",180,180);
    text("Press 'SPACE' to Play",270,220);
    
    if(keyDown("space")){
      ground.velocityX = -5;
      gameState = "play";
    }
  }

  if (gameState === "play") {
    score += Math.round(frameRate() / 29);

    foodCheck--;

    monkey.visible = true;

    if (ground.x === 0) {
      ground.x = ground.width / 2;
    }
    if (keyDown("space") && monkey.y >= 231) {
      monkey.velocityY = -15;
    }
    monkey.velocityY += 0.7;
    monkey.collide(invisiGround);
    //console.log(monkey.y);

    spawnFood();
    spawnObstacle();
    defeatCheck();

    //console.log(loseCheck);
  }

  if (gameState === "end") {
    ground.velocityX = 0;

    monkey.visible = false;

    textSize(35);
    fill("white");
    text("You Lose", 340, 140);
    textSize(25);
    text("Press 'R' to restart", 310, 170);

    if (keyDown("r")) {
      ground.velocityX = -5;

      score = 0;
      loseCheck = 5;
      foodCheck = 280;

      gameState = "play";
    }
  }

  textSize(18);
  fill("white");
  text("Score : " + score, 680, 40);



  drawSprites();



  //console.log(foodCheck);
}

function spawnFood() {
  if (frameCount % 160 === 0) {
    var randYPos = Math.round(random(80, 220));

    banana = createSprite(820, randYPos);
    banana.addImage("food", bananaI);
    banana.velocityX = -7;
    banana.lifetime = 120;
    banana.scale = 0.1;

    bananaG.add(banana);
  }
}

function spawnObstacle() {
  if (frameCount % 300 === 0) {
    obstacle = createSprite(840, 250);
    obstacle.addImage("rock", obstacleI);
    obstacle.velocityX = -8;
    obstacle.scale = 0.15;
    obstacle.lifetime = 100;

    obstacleG.add(obstacle);
  }
}

function defeatCheck() {
  if (bananaG.isTouching(monkey)) {
    bananaG.destroyEach();

    foodCheck = 170;
  }

  if (obstacleG.isTouching(monkey)) {
    loseCheck = 0;
  }

  if (foodCheck === 0) {
    loseCheck -= 1;

    foodCheck = 170;
  }

  if (loseCheck === 0) {
    gameState = "end";
  }
}