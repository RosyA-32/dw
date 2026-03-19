// Elementos del DOM
const wordInput = document.getElementById('wordInput');
const checkBtn = document.getElementById('checkBtn');
const resultCard = document.getElementById('resultCard');
const resultIcon = document.getElementById('resultIcon');
const resultMessage = document.getElementById('resultMessage');
const exampleBtns = document.querySelectorAll('.example-btn');

// Función para limpiar el texto
function sanitizeText(str) {
    // Convertir a minúsculas
    let cleaned = str.toLowerCase();
    // Eliminar acentos
    cleaned = cleaned.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Eliminar caracteres no alfanuméricos
    cleaned = cleaned.replace(/[^a-z0-9]/g, '');
    return cleaned;
}

// Función para verificar si es palíndromo
function isPalindrome(word) {
    const cleaned = sanitizeText(word);
    if (cleaned.length === 0) return false;
    const reversed = cleaned.split('').reverse().join('');
    return cleaned === reversed;
}

// Función para actualizar la interfaz
function updateResult(word) {
    if (!word.trim()) {
        resultCard.className = 'result-card';
        resultIcon.textContent = '🔍';
        resultMessage.textContent = 'Esperando palabra...';
        return;
    }
    
    const palindrome = isPalindrome(word);
    
    if (palindrome) {
        resultCard.className = 'result-card positive';
        resultIcon.textContent = '✅';
        resultMessage.textContent = `¡"${word}" es un palíndromo!`;
    } else {
        resultCard.className = 'result-card negative';
        resultIcon.textContent = '❌';
        resultMessage.textContent = `"${word}" no es un palíndromo.`;
    }
}

// Evento del botón comprobar
checkBtn.addEventListener('click', () => {
    updateResult(wordInput.value);
});

// Evento al presionar Enter
wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        updateResult(wordInput.value);
    }
});

// Eventos para los botones de ejemplo
exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const example = btn.dataset.example;
        wordInput.value = example;
        updateResult(example);
    });
});

// Inicialización
updateResult('');