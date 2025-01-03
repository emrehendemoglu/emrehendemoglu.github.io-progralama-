// Oyuncu ve ekran elemanları
let player = document.getElementById("player");
let startScreen = document.getElementById("startScreen");
let crashScreen = document.getElementById("crashScreen");
let crashTitle = document.getElementById("crashTitle");
let crashMessage = document.getElementById("crashMessage");
let finalScore = document.getElementById("finalScore");
let startButton = document.getElementById("startButton");
let restartButton = document.getElementById("restartButton");
let scoreDisplay = document.getElementById("scoreDisplay");

// Ayarlar ve oyun durumu değişkenleri
let lanes = [10, 110, 210, 310];
let currentLane = 0;
let playerName = '';
let playerPlate = '';
let score = 0;
let baseSpeed = 20; // Arabaların başlangıç hızı (çok hızlı başlangıç)
let speed = baseSpeed; // Anlık hız
let enemyCars = [];
let gameInterval;
let enemyCarSpawnRate = 0.2; // Başlangıç spawn oranı
const carImages = ["car1.webp", "araba2.webp", "araba3.webp", "car1.webp"];

// Oyun kontrolleri (klavye ve butonlar)
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft" && currentLane > 0) {
        currentLane--;
        movePlayer();
    } else if (event.key === "ArrowRight" && currentLane < 3) {
        currentLane++;
        movePlayer();
    }
});

document.getElementById("moveLeftButton").addEventListener("click", function() {
    if (currentLane > 0) {
        currentLane--;
        movePlayer();
    }
});

document.getElementById("moveRightButton").addEventListener("click", function() {
    if (currentLane < 3) {
        currentLane++;
        movePlayer();
    }
});

// Oyuncu aracını taşıma
function movePlayer() {
    player.style.left = lanes[currentLane] + "px";
}

// Oyunu başlatma
function startGame() {
    // Yeni oyuncu bilgilerini al
    playerName = document.getElementById("driverName").value;
    playerPlate = document.getElementById("plate").value;

    if (!playerName || !playerPlate) {
        alert("Lütfen isim ve plaka giriniz!");
        return;
    }

    // Başlangıç ekranını gizle
    startScreen.style.display = "none";
    
    // Skor sıfırla ve ekranı güncelle
    score = 0;
    scoreDisplay.textContent = "Skor: " + score;
    
    // Hız ve spawn oranlarını başlangıca sıfırla
    speed = baseSpeed; 
    enemyCarSpawnRate = 0.2;

    // Oyun döngüsünü başlat
    gameInterval = setInterval(gameLoop, 100);
}

// Düşman arabası oluşturma
function createEnemyCar() {
    let enemy = document.createElement("div");
    enemy.classList.add("enemyCar");
    enemy.style.position = "absolute";
    enemy.style.top = "-120px";

    let randomLane = Math.floor(Math.random() * 4);
    let isLaneFree = enemyCars.every(car => parseInt(car.style.left) !== lanes[randomLane]);
    if (!isLaneFree) {
        return;
    }

    enemy.style.left = lanes[randomLane] + "px";
    let randomCarImage = carImages[Math.floor(Math.random() * carImages.length)];
    enemy.style.backgroundImage = `url(${randomCarImage})`;
    enemy.style.backgroundSize = "cover";
    enemy.style.width = "70px";
    enemy.style.height = "100px";
    document.getElementById("gameContainer").appendChild(enemy);
    enemyCars.push(enemy);
}

// Zorluk seviyesini artırma
function updateDifficulty() {
    if (score > 10 && score <= 20) {
        speed = baseSpeed * 2; // Skor 10'u geçince hız 2 katına çıkar
    } else if (score > 20 && score <= 30) {
        speed = baseSpeed * 4; // Skor 20'yi geçince hız 4 katına çıkar
    } else if (score > 30 && score <= 45) {
        speed = baseSpeed * 5; // Skor 30'u geçince hız 5 katına çıkar
    } else if (score > 45 && score <= 50) {
        speed = baseSpeed * 8; // Skor 45'i geçince hız 8 katına çıkar
    } else if (score > 50) {
        speed = baseSpeed * 10; // Skor 50'yi geçince hız 10 katına çıkar
    }
}

// Oyun döngüsü
function gameLoop() {
    if (Math.random() < enemyCarSpawnRate) {
        createEnemyCar();
    }

    for (let i = enemyCars.length - 1; i >= 0; i--) {
        let enemy = enemyCars[i];
        enemy.style.top = parseInt(enemy.style.top) + speed + "px";

        if (parseInt(enemy.style.top) > 830) {
            enemy.remove();
            enemyCars.splice(i, 1);
            incrementScore();
        }

        if (checkCollision(enemy)) {
            endGame();
            return;
        }
    }

    updateDifficulty();
}

// Çarpışma kontrolü
function checkCollision(enemy) {
    let playerRect = player.getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();

    return !(
        playerRect.top > enemyRect.bottom ||
        playerRect.bottom < enemyRect.top ||
        playerRect.right < enemyRect.left ||
        playerRect.left > enemyRect.right
    );
}

// Skor artırma
function incrementScore() {
    score++;
    scoreDisplay.textContent = "Skor: " + score;
}

// Oyunu bitirme
function endGame() {
    clearInterval(gameInterval);
    crashTitle.classList.add("flashing");
    crashMessage.textContent = `${playerPlate} plakalı araç otobanda kaza yaptı`;
    finalScore.textContent = "Final Skoru: " + score;
    crashScreen.style.display = "flex";
}

// Oyunu yeniden başlatma
restartButton.addEventListener("click", function() {
    // Oyun bitti ekranını gizle
    crashScreen.style.display = "none";
    
    // Başlangıç ekranını tekrar göster
    startScreen.style.display = "flex";
    
    // Oyun durumu sıfırlama
    enemyCars.forEach(car => car.remove());
    enemyCars = [];
    score = 0;
    scoreDisplay.textContent = "Skor: 0";
    
    // İsim ve plaka alanlarını temizle
    document.getElementById("driverName").value = '';
    document.getElementById("plate").value = '';
});

// Başla butonuna tıklayınca oyunu başlatma
startButton.addEventListener("click", startGame);
