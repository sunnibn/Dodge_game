var W = 1000; //screen width
var H = 600; //screen height

//Variables for fire balls
var balls = []; // List of all fireballs on screen.
var b; //Initial fire ball, 'b'.
var xcoor; // List of all x-coordinates of  fireballs on screen, initially has x value of 'b'.
var ycoor; // List of all x-coordinates of fireballs on screen, initially has y value of 'b'.

//Variables for wings movement
var wingdir = 0;
var wingspread = 30;
var wingplace = H - 35 - 15;

//Variables for time
var time1;
var time2;

//Variables for fireball color
var c1, c2;

var y; // Altitude of bird

var start = -1; //defines which screen to run. (-1: Game Start screen, -2: How to Play screen, 1: Game Play, 0: Game Over screen)

function setup() {
    createCanvas(W, H);
    b = new fireball(H - 50); //Set 'b' as initial fire ball.
    balls.push(b); //Add 'b' in the 'balls' list.
}

function draw() {
    //set the color range for fire balls
    c1 = color(255 * document.getElementById("Rval").value / 100, 255 * document.getElementById("Gval").value / 100, 255 * document.getElementById("Bval").value / 100);
    c2 = color(255 * document.getElementById("Rval2").value / 100, 255 * document.getElementById("Gval2").value / 100, 255 * document.getElementById("Bval2").value / 100);

    //----------Game Start screen-----------//
    if (start === -1) {
        gamestart();
    }
    //----------How to Play screen----------//
    if (start === -2) {
        howtoplay();
    }
    //----------Game Over screen------------//
    if (start === 0) {
        gameover();
    }
    //----------Game Play-------------------//
    if (start === 1) {
        background(0);
        time2 = millis() / 1000;

        //----draw fire balls-------//
        push();
        for (let n = 0; n < balls.length; n++) { //draw each fire balls in 'balls' list
            push();
            xcoor[n] += 2 + (time2 - time1) / 20; // increase values of x-coordinates of each fire balls.
            translate(-xcoor[n], 0);
            balls[n].draw();
            pop();
        }
        if (xcoor[xcoor.length - 1] > 250) { //Add a new fire ball for each uniform distance. Add them in the lists.
            let y2 = random(20, H - 30); //Randomly pick a new y-coordinate for fire ball,
            let ball = new fireball(y2); // make a new fire ball using that value.
            balls.push(ball);
            xcoor.push(0);
            ycoor.push(y2);
        }
        if (xcoor[0] > W + 20 + 50) { //if the fire ball goes out of the screen, that fire ball is eliminated from the lists.
            balls.shift();
            xcoor.shift();
            ycoor.shift();
        }
        pop();

        //----draw the bird--------//
        push();
        y = constrain(y, -H, 0); // set the range for positioning the bird
        if (keyIsDown(32)) { // keycode for space bar is 32, when pressed, birds' altitude increases.
            y -= 6;
        }
        y += 2; // when nothing is done, the altitude is lowered automatically.
        translate(0, y);
        bird();
        pop();

        //----time record---------//
        push();
        fill(200);
        textSize(15);
        text('survival time: ' + round(time2 - time1), W - 200, 20);
        pop();

        //----when bird is dead---//
        if (dist(100, H - 35 + y, W + 20 - xcoor[0], ycoor[0]) < 20 + 30 - 2) {
            start = 0;
        }
    }
    //---------Shows color range for fire balls------//
    push();
    noStroke();
    fill(c1);
    rect(W - 40, 10, 15, 15);
    fill(c2);
    rect(W - 25, 10, 15, 15);
    pop();
}

class fireball { //A class for making fire ball.
    constructor(y) {
        this.y = y; //y is a y-coordinate of the fire ball, indicates where the ball will be drawn.
    }
    draw() { //draws the fire ball(with a tail). Changes its color within range of color c1 and c2.
        noStroke();
        fill(random(red(c1), red(c2)), random(green(c1), green(c2)), random(blue(c1), blue(c2)), 50);
        ellipse(W + 50, this.y, 25, 25);
        fill(random(red(c1), red(c2)), random(green(c1), green(c2)), random(blue(c1), blue(c2)), 100);
        ellipse(W + 40, this.y, 30, 30);
        fill(random(red(c1), red(c2)), random(green(c1), green(c2)), random(blue(c1), blue(c2)), 150);
        ellipse(W + 30, this.y, 35, 35);
        fill(lerpColor(c1, c2, random(0, 1, 0.01)));
        ellipse(W + 20, this.y, 40, 40);
    }  
}

function bird() { //Bird making function.
    fill(250, 210, 10);
    triangle(100 + 20, H - 35 - 20, 100 + 20, H - 35 + 20, 100 + 50, H - 35); //beak
    fill(70);
    ellipse(100, H - 35, 60, 60); //body
    fill(240);
    ellipse(100 + 5, H - 35, 30, 30); //eye ball
    fill(0);
    ellipse(100 + 5, H - 35, 3, 3); //eye
    fill(70);
    //------eyelids------------//
    if (y > -H + 100) { //
        arc(100 + 5, H - 35, 30, 30, -PI + HALF_PI * (-y) / (H + 100 - 5), 0 - HALF_PI * (-y) / (H + 100 - 5), OPEN); //upper eyelid
        arc(100 + 5, H - 35, 30, 30, 0 + HALF_PI * (-y) / (H + 100 - 5), -PI - HALF_PI * (-y) / (H + 100 - 5), OPEN); //lower eyelid
    }
    //------wings--------------//
    //'wingdir' indicates whether wing is being spread or fold. (wingdir == 0: getting fold, wingdir == 1: getting spread)
    if (wingdir === 0) {
        wingspread -= 1 + 9 * (-y/(H-30)); // decrease the wing spread.
        wingplace += (1 + 9 * (-y/(H-30))) / 2; // adjust the wing to right place.
        if (wingspread <= 0) {
            wingdir = 1;
        }
    }
    if (wingdir === 1) {
        wingspread += 1 + 9 * (-y/(H-30)); // increase the wing spread
        wingplace -= (1 + 9 * (-y/(H-30))) / 2; // adjust the wing to right place.
        if (wingspread >= 30) {
            wingdir = 0;
        }
    }
    fill(55);
    arc(100 - 20, wingplace, 30, wingspread, -HALF_PI * 3, -HALF_PI, CHORD); // wings
    triangle(100 - 30, H - 35, 100 - 30 - 15, H - 35 + 10, 100 - 30 - 15, H - 35 - 10); // tail
}

function gamestart() { //The Game Start screen. 
    background(0);
    push();
    textAlign(CENTER);
    fill(200);
    textSize(20);
    text('* Press [Play] to continue *', W / 2, H / 2 + 200);
    stroke(230, 0, 0);
    fill(40);
    strokeWeight(3);
    rect(W / 2 - 70, H / 2 + 100 - 35, 140, 70); //Rectangle that will be used as a Game Play button.
    fill(200, 0, 0);
    noStroke();
    textSize(25);
    text('Play', W / 2, H / 2 + 100 + 10);
    textSize(50);
    text('Dodge', W / 2, H / 2 - 50);
    pop();
    if (mouseIsPressed) { //When mouse is pressed in the area of rectange, it will load the How to Play screen.
        if (W / 2 - 70 < mouseX && mouseX < W / 2 + 70 && H / 2 + 100 - 35 < mouseY && mouseY < H / 2 + 100 + 35) {
            start = -2;
        }
    }
}

function howtoplay() { //The How to Play screen
    background(0);
    push();
    fill(200);
    textAlign(LEFT);
    textSize(20);
    text('- Press the [Space bar] to wake up the bird, making it fly higher.\n  If nothing is done, the bird will fall back to sleep.', 100, 200);
    text('- Try to avoid the fire balls flying toward the bird.\n  They gets faster as time passes.', 100, 300);
    text('- If fire ball hits the birds body, the game is over. Try to survive as much as possible.', 100, 400);
    textAlign(CENTER);
    fill(230, 0, 0);
    textSize(17);
    text('* Press any key to start *', W / 2, 500);
    pop();
    if (keyIsPressed) { //If any key is pressed, the game will start.
        start = 1;
        restart();
    }
}

function gameover() {
    push();
    //----draw dead birds' eye---//
    fill(240);
    ellipse(100 + 5, H - 35 + y, 30, 30);
    strokeWeight(2);
    line(100 + 5 - 5, H - 35 + y - 5, 100 + 5 + 5, H - 35 + y + 5);
    line(100 + 5 + 5, H - 35 + y - 5, 100 + 5 - 5, H - 35 + y + 5);
    //----show the record--------//
    fill(255);
    textAlign(CENTER);
    textSize(20);
    text('Survival time: ' + round(time2 - time1) + ' seconds', W / 2, H / 2 - 100);
    //----restart button---------//
    fill(40);
    stroke(230, 0, 0);
    strokeWeight(3);
    rect(W / 2 - 100, H / 2 - 50, 200, 100);
    fill(230, 0, 0);
    noStroke();
    textSize(30);
    text('restart', W / 2, H / 2 + 10);
    pop();
    
    if (mouseIsPressed) { //When mouse is pressed in area of rectangle, game restarts.
        if (W / 2 - 100 < mouseX && mouseX < W / 2 + 100 && H / 2 - 50 < mouseY && mouseY < H / 2 + 50) {
            start = 1;
            restart();
        }
    }
}

function restart() { //function to restart the game, initiallizes the needed variables.
    xcoor = [0];
    ycoor = [H - 50];
    balls = [b];
    y = 0;
    time1 = millis() / 1000;
}