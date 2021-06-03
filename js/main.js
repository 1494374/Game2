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
var levelCompletedCalled = false;

const GROUND_HEIGHT = window.innerHeight / 2 - window.innerHeight / 4 //100;
const GROUND_HEIGHT_2 = window.innerHeight / 2 + window.innerHeight / 6 //350;

// Difficulty parameters
var speed;
var timer;
var initialSpawnTimer;
var initialSpawnTimer2;
var spawnTimer;
var spawnTimer2;
var numberOfObstacles;
var numberOfObstacles2;
var obstacleCounter = 0;
var obstacleCounter2 = 0;
var currentLevel;

// Array with all the possible parameters of a level
var levelParams = JSON.parse(data); //JSON.parse(localStorage.getItem('levels'));
var timeAlive = 0;
timeAlive = setInterval(function() {
    timeAlive++;
}, 1000);
var timeAliveRecord;
if (localStorage.timeAliveRecord) {
    timeAliveRecord = JSON.parse(localStorage.getItem('timeAliveRecord'));
} else {
    timeAliveRecord = [];
}
var averageTimeAlive;

var rightLevelRecord;
if (localStorage.rightLevelRecord) {
    rightLevelRecord = JSON.parse(localStorage.getItem('rightLevelRecord'));
} else {
    rightLevelRecord = [];
}

var levelsPlayedParams = {};
if (localStorage.levelsPlayedParams) {
    levelsPlayedParams = JSON.parse(localStorage.getItem('levelsPlayedParams'));
} else {
    levelsPlayedParams[1] = levelParams[0].params;
}

var rightLevel;
if (localStorage.rightLevel) {
    rightLevel = localStorage.getItem('rightLevel');
} else {
    rightLevel = 0; //Math.floor(Math.random() * levelParams.length);
}
if (rightLevelRecord.length === 0) {
    rightLevelRecord.push(levelParams[rightLevel].level)
}

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
function Setup() {    
    speed = levelsPlayedParams[level].speed;
    timer = levelsPlayedParams[level].distance;
    numberOfObstacles = levelsPlayedParams[level].obstacles;
    numberOfObstacles2 = levelsPlayedParams[level].obstacles;

    initialSpawnTimer = timer;
    spawnTimer = initialSpawnTimer;
    initialSpawnTimer2 = timer + 50;
    spawnTimer2 = initialSpawnTimer2;
    currentLevel = level;
}

function SpawnObstacle() {
    var obstacle;
    var type;
    var w = 50;
    var h = 25;
    var isBird = Math.random() < 0.4;
    
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
    var isBird = Math.random() < 0.4;
    
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
            if (timeAlive > 1) { 
                timeAliveRecord.push(timeAlive);
                localStorage.setItem('timeAliveRecord', JSON.stringify(timeAliveRecord)); 
            }
            timeAlive = 0;
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
            if (!levelCompletedCalled) {
                levelCompletedCalled = true;
                timeAliveRecord.push(timeAlive);
                var chances = timeAliveRecord.length;
                // Compute average time alive
                var sum = 0;
                for(var i = 0; i < timeAliveRecord.length; i++) {
                    sum += timeAliveRecord[i];
                }
                averageTimeAlive = sum / timeAliveRecord.length;

                // Find the parameters for a level with the closest avg time alive
                var difference = 0;
                var bestDifference = Infinity;
                var repeatedTimeAlive = [];
                for (var i = 0; i < levelParams.length; i++){
                    if (levelParams[i].level === currentLevel) {
                        // Look for the entry with the closest 'timeAlive' value
                        difference = Math.abs(averageTimeAlive - levelParams[i].timeAlive);
                        if (difference < bestDifference) {
                            bestDifference = difference;
                            repeatedTimeAlive = [i];
                        } else if (difference === bestDifference) {
                            repeatedTimeAlive.push(i);
                        }
                    }
                }

                var indexOfPlayerModel = repeatedTimeAlive[Math.floor(Math.random() * repeatedTimeAlive.length)];
                var playerModel = levelParams[indexOfPlayerModel].generation;

                // Find max time alive of the player model
                var max = 0;
                var repeatedMaxTimeAlive = [];
                speed = speed === 5 ? 10 : speed;
                speed = speed === 30 ? 25 : speed;
                levelParams.forEach(function(item, i) {
                    
                    if (chances <= 5) {
                        if (item.generation === playerModel && item.params.speed > speed) {
                            if (item.timeAlive > max) {
                                max = item.timeAlive;
                                repeatedMaxTimeAlive = [i];
                            } else if (max === item.timeAlive) {
                                repeatedMaxTimeAlive.push(i);
                            }
                        }
                    } else { // chances > 5
                        if (item.generation === playerModel && item.params.speed < speed) {
                            if (item.timeAlive > max) {
                                max = item.timeAlive;
                                repeatedMaxTimeAlive = [i];
                            } else if (max === item.timeAlive) {
                                repeatedMaxTimeAlive.push(i);
                            }
                        }
                    }
                });
                rightLevel = repeatedMaxTimeAlive[Math.floor(Math.random() * repeatedMaxTimeAlive.length)];

                if (!rightLevelRecord.includes(levelParams[rightLevel].level)) {
                    rightLevelRecord.push(levelParams[rightLevel].level);
                } else {
                    while (rightLevelRecord.includes(levelParams[rightLevel].level)) {
                        rightLevel++;
                        if (rightLevel === levelParams.length) {
                            rightLevel = 0;
                        }
                        if (rightLevelRecord.length === 9) {
                            rightLevelRecord = [];
                        }
                    }
                    rightLevelRecord.push(levelParams[rightLevel].level);
                }
                localStorage.setItem('rightLevelRecord', JSON.stringify(rightLevelRecord)); 

                timeAliveRecord = [];
                localStorage.setItem('timeAliveRecord', JSON.stringify(timeAliveRecord)); 
                localStorage.setItem('rightLevel', rightLevel);
                if (!levelsPlayedParams.hasOwnProperty(level + 1)) {
                    levelsPlayedParams[level + 1] = levelParams[rightLevel].params;
                }
                localStorage.setItem('levelsPlayedParams', JSON.stringify(levelsPlayedParams));

                Setup();
                successModal.style.display = "block";
                    if (level != 9) {
                        levelsCompleted[level + 1] = true;
                        localStorage.setItem('levelsCompleted', JSON.stringify(levelsCompleted));
                    }
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
            if (timeAlive > 1) { 
                timeAliveRecord.push(timeAlive);
                localStorage.setItem('timeAliveRecord', JSON.stringify(timeAliveRecord)); 
            }
            timeAlive = 0;
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

Setup();
Start();
