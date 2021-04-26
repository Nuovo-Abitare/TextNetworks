var t,tInc;

var ww,hh;

var dots = new Array();

var demultiplier;

var alphai = 90;

var thresholddist = 80;

var thresrepulrion = 200;

function setup() {
  // put setup code here
  // let myCanvas = createCanvas( $(document).width()  , $(document).height() );
  // let myCanvas = createCanvas( 1200  , 720 );

  ww = $("#anim").width();
  hh = $("#anim").height();
  generateDots();
  let myCanvas = createCanvas( ww  , hh );
  myCanvas.parent('anim');
  t = 0;
  tInc = 0.01;

}

function windowResized() {
  ww = $("#anim").width();
  hh = $("#anim").height();
  generateDots();
  resizeCanvas(ww, hh);
}


function draw() {
  // put drawing code here
  t = t + tInc;
 
  background( 0 );

  ellipseMode(CENTER);

  
  for(var i=0; i<dots.length;i++){
    dots[i].x = dots[i].x + dots[i].vx;
    dots[i].y = dots[i].y + dots[i].vy;

    var dm = dist(dots[i].x,dots[i].y,mouseX,mouseY);
    if(dm<thresrepulrion ){
      var ax = (mouseX - dots[i].x)/30;
      var ay = (mouseY - dots[i].y)/30;

      dots[i].vx = (dots[i].vx - ax);
      dots[i].vy = (dots[i].vy - ay);

    }    

    dots[i].vx = dots[i].vx * 0.9;
    dots[i].vy = dots[i].vy * 0.9;

    dots[i].x = dots[i].x + cos(dots[i].w*t);
    dots[i].y = dots[i].y + sin(dots[i].w*t);


    if(dots[i].x<0) { dots[i].x = dots[i].x + ww; } //ww; }
    if(dots[i].x>ww) { dots[i].x = dots[i].x - ww; } //0; }
    if(dots[i].y<0) { dots[i].y = dots[i].y + hh; } //hh; }
    if(dots[i].y>hh) { dots[i].y = dots[i].y - hh; } //0; }
    noStroke();
    fill(204,35,42,alphai);
    ellipse( dots[i].x , dots[i].y , dots[i].w );

    
    for(var j = i+1; j<dots.length; j++){
      if(dist(dots[i].x,dots[i].y,dots[j].x,dots[j].y)<thresholddist){
        noFill();
        stroke(204,35,42,alphai/2);
        line(dots[i].x,dots[i].y,dots[j].x,dots[j].y);
      }
    }
    

  }



}

function generateDots(){
  dots = new Array();

  demultiplier = 6;
  if(ww<650){ demultiplier = 9; }

  thresholddist = ww/15;

  thresrepulrion = ww/12;


  var n = ww/demultiplier;
  for(var i = 0; i<n; i++){
    var o = new Object();
    o.x = random(0,ww);
    o.y = random(0,hh);
    o.vx = random(-5,5);
    o.vy = random(-5,5);
    o.w = random(2,4);
    dots.push( o );
  }
}