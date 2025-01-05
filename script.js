// Oyuncu ve ekran elemanları
let player = document.getElementById("player"); // Oyuncu aracını temsil eden element
let startScreen = document.getElementById("startScreen"); // Başlangıç ekranı
let crashScreen = document.getElementById("crashScreen"); // Kaza ekranı
let crashTitle = document.getElementById("crashTitle"); // Kaza başlığı
let crashMessage = document.getElementById("crashMessage"); // Kaza mesajı
let finalScore = document.getElementById("finalScore"); // Final skoru
let startButton = document.getElementById("startButton"); // Başla butonu
let restartButton = document.getElementById("restartButton"); // Yeniden başlat butonu
let scoreDisplay = document.getElementById("scoreDisplay"); // Skor göstergesi

// Ayarlar ve oyun durumu değişkenleri
let lanes = [10, 110, 210, 310]; // Yolda bulunan şeritlerin konumları
let currentLane = 0; // Oyuncunun mevcut şeridi
let playerName = ''; // Oyuncu ismi
let playerPlate = ''; // Oyuncu plaka numarası
let score = 0; // Oyun skoru
let baseSpeed = 20; // Arabaların başlangıç hızı
let speed = baseSpeed; // Anlık hız (başlangıçta baseSpeed'e eşit)
let enemyCars = []; // Düşman arabaları dizisi
let gameInterval; // Oyun döngüsünün intervali
let enemyCarSpawnRate = 0.2; // Düşman arabalarının spawn oranı
const carImages = ["car1.webp", "araba2.webp", "araba3.webp", "car1.webp"]; // Arabaların resimleri

// Oyun kontrolleri (klavye ve butonlar)
document.addEventListener("keydown", function(event) { // Klavye ile hareket kontrolü
    if (event.key === "ArrowLeft" && currentLane > 0) { // Sol ok tuşu ile sola gitme
        currentLane--;
        movePlayer(); // Oyuncuyu yeni şeride taşı
    } else if (event.key === "ArrowRight" && currentLane < 3) { // Sağ ok tuşu ile sağa gitme
        currentLane++;
        movePlayer(); // Oyuncuyu yeni şeride taşı
    }
});

document.getElementById("moveLeftButton").addEventListener("click", function() { // Sol butona tıklama
    if (currentLane > 0) {
        currentLane--;
        movePlayer(); // Oyuncuyu yeni şeride taşı
    }
});

document.getElementById("moveRightButton").addEventListener("click", function() { // Sağ butona tıklama
    if (currentLane < 3) {
        currentLane++;
        movePlayer(); // Oyuncuyu yeni şeride taşı
    }
});

// Oyuncu aracını taşıma
function movePlayer() {
    player.style.left = lanes[currentLane] + "px"; // Oyuncu aracını mevcut şeride taşır
}

// Oyunu başlatma
function startGame() {
    // Yeni oyuncu bilgilerini al
    playerName = document.getElementById("driverName").value; // Oyuncu ismini al
    playerPlate = document.getElementById("plate").value; // Oyuncu plakasını al

    if (!playerName || !playerPlate) { // Eğer isim veya plaka girilmediyse uyarı ver
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
    gameInterval = setInterval(gameLoop, 100); // Her 100ms'de bir oyun döngüsünü çalıştır
}

// Düşman arabası oluşturma
function createEnemyCar() {
    let randomLane = Math.floor(Math.random() * 4); // Rastgele bir şerit seç
    let isLaneFree = enemyCars.every(car => parseInt(car.style.left) !== lanes[randomLane]); // Şeritte yer olup olmadığını kontrol et
    if (!isLaneFree) return; // Eğer şerit doluysa yeni araba oluşturma

    let enemy = document.createElement("div"); // Yeni düşman arabası elementi oluştur
    enemy.classList.add("enemyCar"); // Arabaya class ekle
    enemy.style.position = "absolute"; // Konumlandırmayı absolute yap
    enemy.style.top = "-120px"; // Arabayı ekran dışında bir noktada başlat
    enemy.style.left = lanes[randomLane] + "px"; // Arabayı seçilen şeritte konumlandır

    let randomCarImage = carImages[Math.floor(Math.random() * carImages.length)]; // Rastgele bir araba resmi seç
    Object.assign(enemy.style, {
        backgroundImage: `url(${randomCarImage})`, // Araba resmini ayarla
        backgroundSize: "cover", // Resmin boyutlarını tam kapsayacak şekilde ayarla
        width: "70px", // Araba genişliği
        height: "100px", // Araba yüksekliği
    });

    document.getElementById("gameContainer").appendChild(enemy); // Oyuna arabayı ekle
    enemyCars.push(enemy); // Düşman arabasını array'e ekle
}

// Zorluk seviyesini artırma
function updateDifficulty() {
    if (score > 10 && score <= 20) { // 10 ve 20 arası skor için hız 2 katına çıkar
        speed = baseSpeed * 2;
    } else if (score > 20 && score <= 30) { // 20 ve 30 arası skor için hız 4 katına çıkar
        speed = baseSpeed * 4;
    } else if (score > 30 && score <= 45) { // 30 ve 45 arası skor için hız 5 katına çıkar
        speed = baseSpeed * 5;
    } else if (score > 45 && score <= 50) { // 45 ve 50 arası skor için hız 8 katına çıkar
        speed = baseSpeed * 8;
    } else if (score > 50) { // 50'yi geçen skor için hız 10 katına çıkar
        speed = baseSpeed * 10;
    }
}

// Oyun döngüsü
function gameLoop() {
    if (Math.random() < enemyCarSpawnRate) createEnemyCar(); // Düşman arabası oluşturma olasılığı

    enemyCars = enemyCars.filter(enemy => { // Düşman arabalarını kontrol et
        enemy.style.top = parseInt(enemy.style.top) + speed + "px"; // Düşman arabasını aşağıya hareket ettir

        if (parseInt(enemy.style.top) > 830) { // Eğer araba ekranın altına çıkarsa
            enemy.remove(); // Araba ekranı terk etsin
            incrementScore(); // Skoru artır
            return false;
        }

        if (checkCollision(enemy)) { // Çarpışma kontrolü
            endGame(); // Oyun bitir
            return false;
        }

        return true; // Araba hareket etmeye devam etsin
    });

    updateDifficulty(); // Zorluk seviyesini güncelle
}

// Çarpışma kontrolü
function checkCollision(enemy) {
    let playerRect = player.getBoundingClientRect(); // Oyuncu aracının konumunu al
    let enemyRect = enemy.getBoundingClientRect(); // Düşman aracının konumunu al

    return !(
        playerRect.top > enemyRect.bottom ||
        playerRect.bottom < enemyRect.top ||
        playerRect.right < enemyRect.left ||
        playerRect.left > enemyRect.right
    ); // Eğer oyuncu ve düşman aracı çarpıyorsa true döner
}

// Skor artırma
function incrementScore() {
    score++; // Skoru 1 artır
    scoreDisplay.textContent = "Skor: " + score; // Skoru ekrana yazdır
}

// Oyunu bitirme
function endGame() {
    clearInterval(gameInterval); // Oyun döngüsünü durdur
    crashTitle.classList.add("flashing"); // Kaza başlığını yanıp sönen hale getir
    crashMessage.textContent = `${playerPlate} plakalı araç otobanda kaza yaptı`; // Kaza mesajını güncelle
    finalScore.textContent = "Final Skoru: " + score; // Final skoru göster
    crashScreen.style.display = "flex"; // Kaza ekranını göster
}

// Oyunu yeniden başlatma
restartButton.addEventListener("click", function() { // Yeniden başlat butonuna tıklayınca oyunu başlat
    crashScreen.style.display = "none"; // Kaza ekranını gizle
    startScreen.style.display = "flex"; // Başlangıç ekranını göster

    enemyCars.forEach(car => car.remove()); // Var olan tüm düşman arabalarını kaldır
    enemyCars = []; // Düşman arabalarını sıfırla
    score = 0; // Skoru sıfırla
    scoreDisplay.textContent = "Skor: 0"; // Skoru ekrana sıfır olarak yazdır

    document.getElementById("driverName").value = ''; // Oyuncu ismini sıfırla
    document.getElementById("plate").value = ''; // Oyuncu plakasını sıfırla

    // Başlangıç verilerini sıfırla
    ["playerName", "playerPlate"].map(key => window[key] = '');
});

// Başla butonuna tıklayınca oyunu başlatma
startButton.addEventListener("click", startGame); // Başla butonuna tıklayınca oyunu başlat
