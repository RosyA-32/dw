// Selección de elementos
const mainCounter = document.getElementById('mainCounter');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const incrementClicksSpan = document.getElementById('incrementClicks');
const decrementClicksSpan = document.getElementById('decrementClicks');

// Estado
let count = 0;
let incClicks = 0;
let decClicks = 0;

// Actualizar UI
function updateUI() {
    mainCounter.textContent = count;
    incrementClicksSpan.textContent = incClicks;
    decrementClicksSpan.textContent = decClicks;
}

// Incrementar
function increment() {
    count++;
    incClicks++;
    if (incClicks === 10) {
        incClicks = 0;
        // Podríamos añadir un efecto visual adicional
        mainCounter.style.transform = 'scale(1.1)';
        setTimeout(() => mainCounter.style.transform = 'scale(1)', 150);
    }
    updateUI();
}

// Decrementar
function decrement() {
    count--;
    decClicks++;
    if (decClicks === 10) {
        decClicks = 0;
        mainCounter.style.transform = 'scale(1.1)';
        setTimeout(() => mainCounter.style.transform = 'scale(1)', 150);
    }
    updateUI();
}

// Eventos
incrementBtn.addEventListener('click', increment);
decrementBtn.addEventListener('click', decrement);

// Inicializar
updateUI();