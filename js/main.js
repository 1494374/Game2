const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Variables
var levelText;
var player;
var player2;
var gravity;
var obstacles = [];
var obstacles2 = [];
var gameSpeed;
var keys = {};
var levelsCompleted = JSON.parse(localStorage.getItem("levelsCompleted"));

const GROUND_HEIGHT = 100;
const GROUND_HEIGHT_2 = 350;

// Difficulty parameters
var speed;
var timer;
var birdChances;
var initialSpawnTimer;
var spawnTimer;
var initialSpawnTimer2;
var spawnTimer2;
var numberOfObstacles;
var obstacleCounter = 0;
var numberOfObstacles2;
var obstacleCounter2 = 0;

// Event listeners
document.addEventListener('keydown', function(event) {
    keys[event.code] = true;
});
document.addEventListener('keyup', function(event) {
    keys[event.code] = false;
});

class Text {
    constructor(t, x, y, a, c, s) {
        this.t = t;
        this.x = x;
        this.y = y;
        this.a = a;
        this.c = c;
        this.s = s;
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.font = this.s + "px sans-serif";
        ctx.textAlign = this.a;
        ctx.fillText(this.t, this.x, this.y);
        ctx.closePath();
    }
}

// Game Functions
function Setup(level) {    
    switch(level) {
        case 1:
          speed = 3;
          timer = 200;
          birdChances = 0.2;
          numberOfObstacles = 5;
          numberOfObstacles2 = 5;
          break;
        case 2:
          speed = 4;
          timer = 190;
          birdChances = 0.2; 
          numberOfObstacles = 15; 
          numberOfObstacles2 = 15; 
          break;
        case 3:
          speed = 5;
          timer = 180;
          birdChances = 0.3;
          numberOfObstacles = 20;
          numberOfObstacles2 = 20;
          break;
        case 4:
          speed = 6;
          timer = 160;
          birdChances = 0.3;
          numberOfObstacles = 25;
          numberOfObstacles2 = 25;
          break;
        case 5:
          speed = 7;
          timer = 150;
          birdChances = 0.4;
          numberOfObstacles = 30;
          numberOfObstacles2 = 25;
          break;
        case 6:
          speed = 8;
          timer = 130;
          birdChances = 0.4;
          numberOfObstacles = 35;
          numberOfObstacles2 = 35;
          break;
        case 7:
          speed = 9;
          timer = 120;
          birdChances = 0.4;
          numberOfObstacles = 40;
          numberOfObstacles2 = 40;
          break;
        case 8:
          speed = 10;
          timer = 110;
          birdChances = 0.5;
          numberOfObstacles = 45;
          numberOfObstacles2 = 45;
          break;
        case 9:
          speed = 11;
          timer = 100;
          birdChances = 0.5;
          numberOfObstacles = 50;
          numberOfObstacles2 = 50;
          break;
    }
    initialSpawnTimer = timer;
    spawnTimer = initialSpawnTimer;

    initialSpawnTimer2 = timer + 50;
    spawnTimer2 = initialSpawnTimer2;
}

function SpawnObstacle() {
    var obstacle;
    var type;
    var w = 50;
    var h = 25;
    var isBird = Math.random() < birdChances;
    
    if (isBird) {
        obstacle = new Bird(canvas.width + w, canvas.height - h, w, h, '#2484E4', GROUND_HEIGHT);
    } else {
        type = RandomIntInRange(0, 2); 
        obstacle = new Obstacle(canvas.width, canvas.height, type, '#2484E4', GROUND_HEIGHT);
    }
            
    obstacles.push(obstacle);
}

function SpawnObstacle2() {
    var obstacle;
    var type;
    var w = 50;
    var h = 25;
    var isBird = Math.random() < birdChances;
    
    if (isBird) {
        obstacle = new Bird(canvas.width + w, canvas.height - h, w, h, '#2484E4', GROUND_HEIGHT_2);
    } else {
        type = RandomIntInRange(0, 2); 
        obstacle = new Obstacle(canvas.width, canvas.height, type, '#2484E4', GROUND_HEIGHT_2);
    }
            
    obstacles2.push(obstacle);
}

function RandomIntInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function Start() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.font = "20px sans-serif"

    gameSpeed = speed;
    gravity = 1;

    player = new Player(150, canvas.height - 400, 30, 60, '#FF5858', GROUND_HEIGHT, 1);
    player2 = new Player(150, 0, 30, 60, '#FF5858', GROUND_HEIGHT_2, 2);

    levelText = new Text("Level: " + level, 25, 25, "left", "#212121", "20");
    requestAnimationFrame(Update);
}

function Update() {
    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spawnTimer--; 
    if (spawnTimer <= 0) {
        if (obstacleCounter < numberOfObstacles) {
            SpawnObstacle();
            obstacleCounter++;
            console.log(obstacles);
            spawnTimer = initialSpawnTimer - gameSpeed * 8;
        }

        var random = RandomIntInRange(6, 8) * 10;
        if (spawnTimer < random) {
            spawnTimer = random;
        }
    }

    // Spawn Enemies
    for (var i = 0; i < obstacles.length; i++) {
        var o = obstacles[i];

        // if (o.x + o.w < 0) {
        //     // obstacles.splice(i,1);
        //     if (obstacleCounter == numberOfObstacles) {
        //         modal.style.display = "block";
        //     }
        // }

        if (
            player.x < o.x + o.w && 
            player.x + player.w > o.x && 
            player.y < o.y + o.h && 
            player.y + player.h > o.y
        ) {
            // obstacles = [];
            spawnTimer = initialSpawnTimer;
            gameSpeed = speed;
            failModal.style.display = "block";
        }

        // Stop updating obstacles when the modal is shown
        if (failModal.style.display != "block" && successModal.style.display != "block") {
            o.Update();
        } else {
            o.Draw();
        }
    }


    spawnTimer2--; 
    if (spawnTimer2 <= 0) {
        if (obstacleCounter2 < numberOfObstacles2) {
            SpawnObstacle2();
            obstacleCounter2++;
            console.log(obstacles2);
            spawnTimer2 = initialSpawnTimer2 - gameSpeed * 8;
        } else if (obstacles2[numberOfObstacles2 - 1].x + obstacles2[numberOfObstacles2 - 1].w < 0 && player2.jumpTimer == 0) {
            setTimeout(function() {
                successModal.style.display = "block";
            }, 1000);
            if (level != 9) {
                levelsCompleted[level + 1] = true;
                localStorage.setItem('levelsCompleted', JSON.stringify(levelsCompleted));
            }
        }
        
        var random = RandomIntInRange(6, 8) * 10;
        if (spawnTimer2 < random) {
            spawnTimer2 = random;
        }
    }

    for (var i = 0; i < obstacles2.length; i++) {
        var o2 = obstacles2[i];

        // if (o.x + o.w < 0) {
        //     // obstacles.splice(i,1);
        //     if (obstacleCounter == numberOfObstacles) {
        //         modal.style.display = "block";
        //     }
        // }

        if (
            player2.x < o2.x + o2.w && 
            player2.x + player2.w > o2.x && 
            player2.y < o2.y + o2.h && 
            player2.y + player2.h > o2.y
        ) {
            // obstacles = [];
            spawnTimer = initialSpawnTimer;
            gameSpeed = speed;
            failModal.style.display = "block";
        }

        // Stop updating obstacles when the modal is shown
        if (failModal.style.display != "block" && successModal.style.display != "block") {
            o2.Update();
        } else {
            o2.Draw();
        }
    }

    // Stop animating the player when the modal is shown
    if (failModal.style.display != "block" && successModal.style.display != "block") {
        player.Animate();
        player2.Animate();
    } else {
        player.Draw();
        player2.Draw();
    }
    
    levelText.Draw();

    gameSpeed += 0.003;

    // Background line 1
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - GROUND_HEIGHT);
    ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT);
    ctx.stroke();

    // Background line 2
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - GROUND_HEIGHT_2);
    ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT_2);
    ctx.stroke();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var level = parseInt(getParameterByName('level'));

Setup(level);
Start();
