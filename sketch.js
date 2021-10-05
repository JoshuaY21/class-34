const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var bg_img2;
var bg_img3;
var food;
var rabbit;

var muteBtn

var button;
var bunny;
var blink,eat,sad;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;
var wall;
var wall2

var back = 1
var diffBack1
var diffBack2
var diffBack3

var sound = 1;

var blower

function preload()
{
  bg_img = loadImage('background.png');
  bg_img2 = loadImage('bg_plain.png')
  bg_img3 = loadImage("bkg.jpg")
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  bk_song = loadSound("sound1.mp3");
  cut_sound = loadSound("rope_cut.mp3");
  air = loadSound("air.wav");
  sad_sound = loadSound("sad.wav");
  eating_sound = loadSound("eating_sound.mp3")
  
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false;
}

function setup() {

  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (isMobile) {
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth + 80,displayHeight);
  }
  else {

    canW = windowWidth;
    canH = windowHeight;
   
      createCanvas(windowWidth,windowHeight);
    
  }

  frameRate(80);

  engine = Engine.create();
  world = engine.world;

  muteBtn = createImg("mute.png")
  muteBtn.position(canW-100,20)
  muteBtn.size(30,30)

  button = createImg('cut_btn.png');
  button.position(20,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg('cut_btn.png');
  button2.position(330,35);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg('cut_btn.png');
  button3.position(360,200);
  button3.size(50,50);
  button3.mouseClicked(drop3);
  
  rope = new Rope(7,{x:40,y:30});
  rope2 = new Rope(8,{x:370,y:40});
  rope3 = new Rope(8,{x:400,y:225});
  ground = new Ground(canW/2,canH-50,canW,20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bk_song.play()
  bk_song.setVolume(0.05)

  bunny = createSprite(400,canH-130,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);

  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  fruit = Bodies.circle(300,300,20,{restitution: 0.0000000000001});
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link(rope2,fruit);
  fruit_con3 = new Link(rope3,fruit);

  wall = new Ground(500,350,5,700);
  wall2 = new Ground(0,350,5,700);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);

  blower = createImg("blower.png")
  blower.position(10,250)
  blower.size(150,100)

  diffBack1 = createImg("bg_plain.png");
  diffBack2 = createImg("bkg.jpg");
  diffBack3 = createImg("background.png");
  diffBack2.position(canW-100,130);
  diffBack2.size(50,70);
  diffBack3.position(canW-100,70);
  diffBack3.size(50,70);
  diffBack1.position(canW-100,190);
  diffBack1.size(50,70);
}

function draw() 
{
  background(51);

  //image(bg_img2,width/2,height/2,490,690);

  if (back === 1) {
    image(bg_img,width/2,height/2,canW+80,canH);
    diffBack1.mouseClicked(changeBack)
  }

  if (back === 2) {
    image(bg_img2,width/2,height/2,canW+80,canH);
    diffBack2.mouseClicked(changeBack2)
  }

  if (back === 3) {
    image(bg_img3,width/2,height/2,canW+80,canH);
    diffBack3.mouseClicked(changeBack3)
  }


  blower.mouseClicked(airBlow)
  muteBtn.mouseClicked(mute)

  

  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }

  rope.show();
  rope2.show();
  rope3.show();
  Engine.update(engine);
  //ground.show();

  if(collide(fruit,bunny)==true)
  {
    bunny.changeAnimation('eating');
    eating_sound.play()
    bk_song.stop()
  }
  if(fruit != null) {
    if (fruit.position.y >= 650)  
    {
      World.remove(engine.world,fruit);
      fruit = null
      bunny.changeAnimation('crying');
      sad_sound.play()
      bk_song.stop()
     }
  }
   drawSprites();
}

function drop()
{
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
  cut_sound.play()
}

function drop2()
{
  rope2.break();
  fruit_con2.dettach();
  fruit_con2 = null; 
  cut_sound.play()
}

function drop3()
{
  rope3.break();
  fruit_con3.dettach();
  fruit_con3 = null; 
  cut_sound.play()
}

function collide(body,sprite)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
              World.remove(engine.world,fruit);
               fruit = null;
               return true;
            }
            else{
              return false;
            }
         }
}

function airBlow() {
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.05,y:0})
  air.play()
  air.setVolume(0.1)
}

function mute() {
  

  if(sound === 1) {
    bk_song.setVolume(0)
    sound = 0
  }
  else{
    bk_song.setVolume(0.05)
    sound = 1
  }
}

function changeBack() {
  back = 2
}

function changeBack2() {
 back = 3
}

function changeBack3() {
  back = 1
}