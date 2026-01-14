// 1. Rasto de Corações no Rato
document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.1) return; 
    const heart = document.createElement('span');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    heart.style.fontSize = '15px';
    heart.style.pointerEvents = 'none';
    heart.style.transition = 'all 1s ease';
    heart.style.zIndex = '9999';
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.style.transform = `translateY(-30px) scale(0)`;
        heart.style.opacity = '0';
    }, 50);
    setTimeout(() => heart.remove(), 1000);
});

// 2. Variáveis do Jogo
const canvas = document.getElementById('game-canvas');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const winScreen = document.getElementById('game-win');
let score = 0;
let gameActive = true;

// Controle do Jogador
if(canvas) {
    canvas.addEventListener('mousemove', (e) => {
        if (!gameActive) return;
        const rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left - player.offsetWidth / 2;
        x = Math.max(0, Math.min(x, canvas.offsetWidth - player.offsetWidth));
        player.style.left = x + 'px';
    });
}

function scrollToMural() {
    const mural = document.getElementById('mural-destino');
    if (mural) {
        mural.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    } else {
        console.error("Alvo mural-destino não encontrado!");
    }
}

// Lógica de Criar Corações
function createHeart() {
    if (!gameActive || score >= 10 || !canvas) return;

    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.left = Math.random() * (canvas.offsetWidth - 30) + 'px';
    heart.style.top = '-50px';
    heart.style.fontSize = '25px';
    heart.style.userSelect = 'none';
    canvas.appendChild(heart);

    let top = -50;
    const fall = setInterval(() => {
        if (!gameActive) {
            heart.remove();
            clearInterval(fall);
            return;
        }

        top += 4; 
        heart.style.top = top + 'px';
        
        const pRect = player.getBoundingClientRect();
        const hRect = heart.getBoundingClientRect();

        if (hRect.bottom > pRect.top && hRect.right > pRect.left && hRect.left < pRect.right) {
            score++;
            scoreElement.innerText = `Corações: ${score}`;
            heart.remove();
            clearInterval(fall);
            
            if (score >= 10) {
                gameActive = false; 
                showWin();
            }
        }
        
        if (top > canvas.offsetHeight) { 
            heart.remove(); 
            clearInterval(fall); 
        }
    }, 20);
}

setInterval(() => {
    if (gameActive) createHeart();
}, 800);

// Função Vitória
function showWin() {
    const remainingHearts = document.querySelectorAll('.falling-heart');
    remainingHearts.forEach(h => h.remove());

    winScreen.classList.remove('hidden');
    
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff80ab', '#d81b60', '#ffffff']
        });
    }
}

// Reiniciar Jogo
function restartGame() {
    score = 0;
    gameActive = true;
    scoreElement.innerText = "Corações: 0";
    winScreen.classList.add('hidden');
}

// 3. Música e Volume
let isPlaying = false;
const audio = document.getElementById("myAudio");
const playIcon = document.getElementById("play-icon");

function toggleMusic() {
    if (isPlaying) { 
        audio.pause(); 
        playIcon.innerText = "🎵"; 
    } else { 
        audio.play(); 
        playIcon.innerText = "⏸️"; 
    }
    isPlaying = !isPlaying;
}

const volumeSlider = document.getElementById('volume-slider');
if (volumeSlider && audio) {
    audio.volume = volumeSlider.value;
    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value;
    });
}

// 4. Inicialização (Confetes ao carregar e Envelope)
// 4. Inicialização: Efeito Explosivo e Envelope
document.addEventListener('DOMContentLoaded', () => {
    // Configuração do Envelope (Mantido)
    const envelope = document.getElementById('envelope-wrapper');
    const waxSeal = document.getElementById('wax-seal-btn');

    if (waxSeal && envelope) {
        waxSeal.addEventListener('click', () => {
            envelope.classList.add('open');
        });
    }

    // --- EFEITO EXPLOSIVO DE BOAS-VINDAS ---
    if (typeof confetti === 'function') {
        const duracao = 3 * 1000; // 3 segundos de festa
        const fim = Date.now() + duracao;

        const frame = () => {
            // Lança confetis da esquerda
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff80ab', '#d81b60', '#ffffff', '#b2ebf2'],
                shapes: ['heart', 'circle']
            });
            
            // Lança confetis da direita
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff80ab', '#d81b60', '#ffffff', '#b2ebf2'],
                shapes: ['heart', 'circle']
            });

            if (Date.now() < fim) {
                requestAnimationFrame(frame);
            }
        };

        // Pequeno atraso para o site carregar e... CABUM!
        setTimeout(() => {
            // Grande explosão central inicial
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.3 },
                colors: ['#ff80ab', '#d81b60', '#ffffff'],
                shapes: ['heart'],
                scalar: 1.2
            });
            
            // Inicia a chuva contínua das laterais
            frame();
        }, 600);
    }
});