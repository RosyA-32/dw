// Elementos del DOM
const emailInput = document.getElementById('emailInput');
const validateBtn = document.getElementById('validateBtn');
const resultArea = document.getElementById('resultArea');
const resultIcon = document.getElementById('resultIcon');
const resultText = document.getElementById('resultText');

// Expresión regular para email (más completa que la anterior)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Función de validación
function validateEmail() {
    const email = emailInput.value.trim();
    
    if (email === '') {
        setResult('❓', 'Por favor, ingresa un email.', '');
        return;
    }
    
    if (emailRegex.test(email)) {
        setResult('✅', `"${email}" es un email válido.`, 'valid');
    } else {
        setResult('❌', `"${email}" no es un email válido.`, 'invalid');
    }
}

// Función para actualizar el resultado con clases
function setResult(icon, text, type) {
    resultIcon.textContent = icon;
    resultText.textContent = text;
    
    // Limpiar clases anteriores
    resultArea.classList.remove('valid', 'invalid');
    
    if (type) {
        resultArea.classList.add(type);
    }
}

// Eventos
validateBtn.addEventListener('click', validateEmail);
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        validateEmail();
    }
});

// Inicializar
setResult('📨', 'Esperando email...', '');