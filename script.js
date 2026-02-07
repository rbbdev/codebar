// Obtener elementos del DOM
const barcodeInput = document.getElementById('barcodeInput');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const barcodeDisplay = document.getElementById('barcodeDisplay');

// Mensaje inicial
barcodeDisplay.innerHTML = '<p class="placeholder-message">El código de barras aparecerá aquí</p>';

// Función para generar el código de barras
function generateBarcode() {
    const value = barcodeInput.value.trim();
    
    // Validar que el campo no esté vacío
    if (value === '') {
        barcodeDisplay.innerHTML = '<p style="color: #e74c3c;">Por favor, ingrese un valor</p>';
        return;
    }
    
    // Limpiar el contenedor
    barcodeDisplay.innerHTML = '';
    
    try {
        // Crear elemento SVG para el código de barras
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        barcodeDisplay.appendChild(svg);
        
        // Generar código de barras usando JsBarcode
        JsBarcode(svg, value, {
            format: 'CODE128',
            width: 2,
            height: 100,
            displayValue: true,
            fontSize: 14,
            margin: 10
        });
        
    } catch (error) {
        // Mostrar error si el valor no es válido
        barcodeDisplay.innerHTML = '<p style="color: #e74c3c;">Error: No se pudo generar el código de barras. Verifique el valor ingresado.</p>';
        console.error('Error al generar código de barras:', error);
    }
}

// Función para limpiar el input y resetear
function clearInput() {
    barcodeInput.value = '';
    barcodeDisplay.innerHTML = '<p class="placeholder-message">El código de barras aparecerá aquí</p>';
    barcodeInput.focus();
}

// Event listeners
generateBtn.addEventListener('click', generateBarcode);
clearBtn.addEventListener('click', clearInput);

// Permitir generar con Enter
barcodeInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        generateBarcode();
    }
});

// Enfocar el input al cargar la página
window.addEventListener('load', function() {
    barcodeInput.focus();
});
