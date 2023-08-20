const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();

// general settings
let gamePlaying = 0; // 0 for starting, 1 for playing, 2 for lose.
const gravity = 0.74;
const speed = 7;
const size = [50, 33.5];
const jump = -13;
const cTenth = (canvas.width / 10);

var x = document.getElementById("bgm");
var y = document.getElementById("jump");

let currentMapRotation = 0;

let mapRotation = ["./kagemadiset.png", "./joshmadiset.png", "./gaiamadiset.png"];

let muted = false;

let endGameNoti = document.getElementById("endGameNoti");

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipe;

// pipe settings
const pipeWidth = 78;
const pipeGap = 220;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
  img = new Image();
  img.src = "./flyingMadiSet.png";

  x = document.getElementById("bgm");
  y = document.getElementById("jump");

  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

var score = document.getElementById("count");

const render = () => {

  // tell the browser to perform anim
  if (gamePlaying == 0 || gamePlaying == 1) {
    requestAnimationFrame(render);
  }

  // make the pipe and bird moving 
  index++;

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background first part 
  ctx.drawImage(img, 0, 0, canvas.width-10, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // background second part
  ctx.drawImage(img, 0, 0, canvas.width-10, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // pipe display
  if (gamePlaying == 1){
    pipes.map(pipe => {
      // pipe moving
      pipe[0] -= speed;

      // top pipe
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // bottom pipe
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // give 1 point & create new pipe
      if(pipe[0] <= -pipeWidth){
        currentScore++;
      
        // check if it's the best score
        bestScore = Math.max(bestScore, currentScore);
        
        // remove & create new pipe
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
        console.log(pipes);
      }
    
      // if hit the pipe, end
      if ([
        pipe[0] <= cTenth + size[0], 
        pipe[0] + pipeWidth >= cTenth, 
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = 2; // TEST
      }
    })
  }
  // draw bird
  if (gamePlaying == 1) {
    ctx.drawImage(img, 435, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, size[0]+10, size[1]+10);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
      // text accueil
    if (gamePlaying == 0) {
      ctx.drawImage(img, 435, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, size[0]+10, size[1]+10);
      flyHeight = (canvas.height / 2) - (size[1] / 2);
      ctx.fillText(`BEST SCORE LAH : ${bestScore}`, 125, 198);
      ctx.fillText("CLICK TO PLAY LAH !", 120, 435);
      ctx.font = "30px fantasy";
      ctx.fillStyle = "white";
    } else if (gamePlaying == 2) {

      ctx.font = "60px fantasy";
      ctx.fillStyle = "#FFFFBA";
      ctx.fillText(`SCORE: ${currentScore}`, 120, 110);

      let rand = Math.random();
      if (rand < 0.25) {
        txt = "\"THIS SCORE WON'T ENOUGH TO GET\n YOU ANY BITCHES.\" - (KABAE, 2023)";
        x = 10;
        y = 250;
        lineheight = 50;
        lines = txt.split('\n');
      }
      else if (rand < 0.7) {
        txt = "\"EVEN AN OLD MAN CAN PLAY BETTER \nTHAN THAT !\" - (JOSH, 2023)";
        x = 10;
        y = 250;
        lineheight = 50;
        lines = txt.split('\n');
      }  else {
        txt = "\"EVEN KIDS IN MY NEIGHBORHOOD\n CAN SCORE 80 !\" - (CHADANO, 2023)";
        x = 10;
        y = 250;
        lineheight = 50;
        lines = txt.split('\n');
      }


      ctx.fillStyle = "#FFFFBA";
      ctx.fillRect(x, y-40, 390, 100);

      ctx.fillStyle = "teal";
      ctx.font = "28px fantasy";
      ctx.textAlign = "left";

      for (var i = 0; i<lines.length; i++) {
        ctx.fillText(lines[i], x, y + (i*lineheight));
      }
      
      ctx.fillStyle = "#FFFFBA";
      ctx.fillText("TAP TO PLAY AGAIN !", 120, 435);
    }
    
  }
  
  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;
}

function mute() {
  muted = !muted;
}

// launch setup
setup();
img.onload = render;

var clicked = false;
var clicked2 = false;

// start game
document.addEventListener('click', () => {
  if (gamePlaying == 0) {
    gamePlaying = 1;
  } else if (gamePlaying == 2) {
    gamePlaying = 0;
    setup();
    render();
  }

  if (currentScore > 1) {

    if (currentScore % 5 == 0 && !clicked2) {
      clicked2 = true;
      document.getElementById("currentScore").style.display = "none";
      document.getElementById("bestScore").style.display = "none";
      document.getElementById("muteMusic").style.display = "none";
      score.innerHTML = currentScore;
      document.getElementById("notification").style.display = "inline-block";

      setTimeout(() => {
        document.getElementById("currentScore").style.display = "inline-block";
        document.getElementById("bestScore").style.display = "inline-block";
        document.getElementById("muteMusic").style.display = "inline-block";
        document.getElementById("notification").style.display = "none";
      }, 1000);
    }

    if (currentScore % 10 == 0 && !clicked) {
      clicked = true;
      document.getElementById("congrats").volume = 0.1;
      document.getElementById("congrats").play();
      currentMapRotation++;
      if (currentMapRotation == 3) {
        currentMapRotation = 1;
      }
      img = new Image();
      img.src = mapRotation[currentMapRotation];
    }


    if (currentScore % 10 > 0) {
      if (currentScore % 5 > 2) {
        clicked2 = false;
      }
      clicked = false;
    }
  }


  y.play();

  console.log(muted);
  console.log(x);
  console.log(y);

  if (!muted) {
    x.volume = 0.03;
    x.play();
  } else {
    x.pause();
  }
});

window.onclick = () => {
  flight = jump;
}