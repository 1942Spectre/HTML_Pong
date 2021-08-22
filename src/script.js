const cvs = document.getElementById('game')
const ctx = cvs.getContext('2d');


let seconds =0;
let minutes = 0;
let hours = 0;

////////

var audio = document.getElementById('audio');
var audio2 = document.getElementById('audio-2');
var playPauseBTN = document.getElementById('playPauseBTN');
var count = 0;

function playPause(){
	if(count == 0){
		count = 1;
		audio2.play();
		playPauseBTN.innerHTML = "Pause &#9208;";
        playPauseBTN.style.height="36px";
	}
    else{
		count = 0;
		audio2.pause();
		playPauseBTN.innerHTML = "Play &#9658;";
	}

}

function stop(){
	playPause()
	audio2.pause();
	audio2.currentTime = 0;
	playPauseBTN.innerHTML = "Play &#9658;";
}



/////////

const stopwatch = () => {
    seconds++;

    if(seconds / 60==1){
        seconds=0;
        minutes++;

        if(minutes/60 == 1){
            minutes = 0;
            hours++;
        }
    }

    document.getElementById('countdown').innerHTML = hours + ":" + minutes + ":" + seconds;
    document.getElementById('score').innerHTML = "Score: " + player1.score + " | " + player2.score;


}

window.setInterval(stopwatch,1000)

function drawRect(x,y,w,h,color){
    ctx.fillStyle=color
    ctx.fillRect(x,y,w,h)
}

function drawCircleF(x,y,r,color){
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x,y,r,0,2*Math.PI,false)
    ctx.closePath()
    ctx.fill()
}

function redrawField(){
    drawRect(0,0,cvs.width,cvs.height,'#C8DF27');
    drawRect(cvs.width/2-2,0,4,cvs.height,'#fff');
    drawCircleF(cvs.width/2,cvs.height/2,8,'#fff');
}


function drawText(text,x,y,color) {
    ctx.fillStyle = color
    ctx.font = '50px sans-serif'
    ctx.fillText(text,x,y)
}

const player1  ={
    is_moving:false,
    x:20,
    y:cvs.height/2-50,
    w:10,
    h:100,
    color:'#fff',
    score:0,

    draw(){
        drawRect(this.x,this.y,this.w,this.h,this.color)
    },
    moveup()
    {
        if(this.y > 0)
        this.y = this.y-10;
    },
    movedown(){
        if (this.y < cvs.height - this.h)
        this.y = this.y + 10;
    },
}

const controller = {

    p1up: "ArrowUp",
    p1down: "ArrowDown",
    p2up1: 'W',
    p2up2: 'w',
    p2down1: 'S',
    p2down2: 's',

    handle_keydown(e)
    {
        ball.stop = false;

        if(e.key == "w" || e.key == "W"){
            player1.is_moving = "up";
        }
        if(e.key == "ArrowUp"){
            player2.is_moving = "up";
        }
        if(e.key == "s" || e.key == "S"){
            player1.is_moving = "down";
        }
        if(e.key == "ArrowDown"){
            player2.is_moving = "down";
        }

    },

    handle_keyup(e)
    {
        
        if(e.key == "w" || e.key == "W")
            player1.is_moving = "false";


        if(e.key == "ArrowUp")
            player2.is_moving = "false";

        if(e.key == "s" || e.key == "S")
            player1.is_moving = "false";
        
        if(e.key == "ArrowDown"){
            player2.is_moving = "false";
        }

    }

}



const player2  ={
    
    is_moving: false,

    x:cvs.width-30,
    y:cvs.height/2-50,
    w:10,
    h:100,
    color:'#fff',
    score:0,
    speed: 10,

    draw(){
        drawRect(this.x,this.y,this.w,this.h,this.color)
    },
    moveup()
    {
        if(this.y > 0)
        this.y = this.y-10;
    },
    movedown(){
        if (this.y < cvs.height - this.h)
        this.y = this.y + 10;
    }
}

const ball = {
    x:cvs.width/2,
    y:cvs.height/2,
    r:13,
    color:'#4D3CC7',
    speed:5,
    velocityX:3,
    velocityY:4,
    stop:true,
    
    draw()
    {
        drawCircleF(this.x,this.y,this.r,this.color);
    },
    
    reset()
    {
        this.x = cvs.width/2
        this.y = cvs.height/2
        this.speed = 5
        this.velocityX=3
        this.velocityY=4
        this.stop=true
        seconds =0;
        minutes = 0;
        hours = 0;
        
    },

    move()
    {
        this.x = this.x + this.velocityX;
        this.y = this.y + this.velocityY;
    }

}

// Gets called on every keydown, causes an unwanted situation that disables players to move
// at the same time. 


document.addEventListener('keydown',controller.handle_keydown);
document.addEventListener('keyup',controller.handle_keyup)


// Handles the collision of ball and player
function collision(b,p){

    

    b.top = b.y-b.r
    b.bottom = b.y+b.r
    b.left = b.x-b.r
    b.right = b.x+b.r

    p.top = p.y
    p.bottom = p.y+p.h
    p.left = p.x
    p.right = p.x+p.w



    return(b.top<p.bottom && b.bottom>p.top && b.left<p.right && b.right>p.left)
    

}


// Main game rules are defined here.
function update (){
    
    if(!ball.stop)
        ball.move()
    

    // when the ball touches the top and bottom corners, reverses the direction
    if(ball.y + ball.r >cvs.height || ball.y-ball.r<0)
        ball.velocityY=-ball.velocityY;
        


        // Decides which player is the one who's going to interact with the ball,
        // this way, operates according to that player instead of checking both
    let player = (ball.x <cvs.width/2) ? player1:player2;
    // Also, each time a player hits the ball, ball's speed increases.
    if(collision(ball,player)){
        audio.play();
        let intersectY = ball.y-(player.y+player.h/2);
        intersectY /=player.h/2;

        let maxBounceRate = Math.PI / 3;
        let bounceAngle = intersectY * maxBounceRate;

        let direction = (ball.x< cvs.width/2) ? 1:-1;

        ball.velocityX = direction*ball.speed * Math.cos(bounceAngle);
        ball.velocityY = ball.speed * Math.sin(bounceAngle);

        ball.speed+=2;
       
    }

    // if ball is on the right side
    if(ball.x>cvs.width){
        player1.score++;
        ball.reset();
    }
    // if ball is on the left side
    else if(ball.x<0){
        player2.score++;
        ball.reset();
    }

    
}


// Visualizes the changes on the canvas
function render(){
    if(player1.is_moving == "up")
        player1.moveup();


    if(player1.is_moving == "down")
        player1.movedown();

    if(player2.is_moving == "up")
         player2.moveup();

    if(player2.is_moving == "down")
        player2.movedown();

    update();
    redrawField();
    player1.draw();
    player2.draw();
    ball.draw();
    
}

function game(){
    render();
}

const fps = 50;
setInterval(game,1000/fps);