 // Code 128 patterns (0-106)
        const patterns = [
            "11011001100", "11001101100", "11001100110", "10010011000",
            "10010001100", "10001001100", "10011001000", "10011000100",
            "10001100100", "11001001000", "11001000100", "11000100100",
            "10110011100", "10011011100", "10011001110", "10111001100",
            "10011101100", "10011100110", "11001110010", "11001011100",
            "11001001110", "11011100100", "11001110100", "11101101110",
            "11101001100", "11100101100", "11100100110", "11101100100",
            "11100110100", "11100110010", "11011011000", "11011000110",
            "11000110110", "10100011000", "10001011000", "10001000110",
            "10110001000", "10001101000", "10001100010", "11010001000",
            "11000101000", "11000100010", "10110111000", "10110001110",
            "10001101110", "10111011000", "10111000110", "10001110110",
            "11101110110", "11010001110", "11000101110", "11011101000",
            "11011100010", "11011101110", "11101011000", "11101000110",
            "11100010110", "11101101000", "11101100010", "11100011010",
            "11101111010", "11001000010", "11110001010", "10100110000",
            "10100001100", "10010110000", "10010000110", "10000101100",
            "10000100110", "10110010000", "10110000100", "10011010000",
            "10011000010", "10000110100", "10000110010", "11000010010",
            "11001010000", "11110111010", "11000010100", "10001111010",
            "10100111100", "10010111100", "10010011110", "10111100100",
            "10011110100", "10011110010", "11110100100", "11110010100",
            "11110010010", "11011011110", "11011110110", "11110110110",
            "10101111000", "10100011110", "10001011110", "10111101000",
            "10111100010", "11110101000", "11110100010", "10111011110",
            "10111101110", "11101011110", "11110101110", "11010000100",
            "11010010000", "11010011100", "1100011101011"
        ];
        
        // DOM elements
        const barcodeInput = document.getElementById('barcodeInput');
        const generateBtn = document.getElementById('generateBtn');
        const barcodeCanvas = document.getElementById('barcodeCanvas');
        const barcodeText = document.getElementById('barcodeText');
        const barcodeContainer = document.getElementById('barcodeContainer');
        const errorMessage = document.getElementById('errorMessage');
        
        // Initialize canvas
        const ctx = barcodeCanvas.getContext('2d');
        ctx.fillStyle = '#000';
        
        // Generate barcode function
        function generateBarcode() {
            const input = barcodeInput.value.trim();
            errorMessage.style.display = 'none';
            barcodeInput.classList.remove('invalid');
            
            // Validate input
            if (!input) {
                showError('Please enter text to generate a barcode.');
                barcodeInput.classList.add('invalid');
                return;
            }
            
            if (input.length > 60) {
                showError('Input is too long. Maximum length is 60 characters.');
                barcodeInput.classList.add('invalid');
                return;
            }
            
            // Check for invalid characters (Code 128B supports ASCII 32-126)
            for (let i = 0; i < input.length; i++) {
                const charCode = input.charCodeAt(i);
                if (charCode < 32 || charCode > 126) {
                    showError(`Invalid character "${input.charAt(i)}" at position ${i + 1}. Only standard ASCII characters (space to ~) are allowed.`);
                    barcodeInput.classList.add('invalid');
                    return;
                }
            }
            
            try {
                // Generate barcode pattern
                let barcodeStr = "";
                
                // Start with Code 128B start character (value 104)
                barcodeStr += patterns[104];
                
                // Convert each character to its Code 128B value and add pattern
                const codes = [];
                for (let i = 0; i < input.length; i++) {
                    const charCode = input.charCodeAt(i);
                    const codeValue = charCode - 32; // Space (32) = 0, ! (33) = 1, etc.
                    codes.push(codeValue);
                    barcodeStr += patterns[codeValue];
                }
                
                // Calculate checksum
                let checksum = 104; // Start with value of start character
                for (let i = 0; i < codes.length; i++) {
                    checksum += codes[i] * (i + 1); // Weighted by position (1-indexed)
                }
                checksum %= 103;
                barcodeStr += patterns[checksum];
                
                // Add stop pattern
                barcodeStr += patterns[106];
                
                // Add quiet zones (10 modules on each side)
                barcodeStr = "0".repeat(10) + barcodeStr + "0".repeat(10);
                
                // Draw barcode
                drawBarcode(barcodeStr, input);
                
                // Show barcode container
                barcodeContainer.classList.add('visible');
            } catch (error) {
                console.error('Error generating barcode:', error);
                showError('An error occurred while generating the barcode. Please try again with different text.');
            }
        }
        
        // Draw barcode on canvas
        function drawBarcode(barcodeStr, text) {
            // Clear canvas
            ctx.clearRect(0, 0, barcodeCanvas.width, barcodeCanvas.height);
            
            // Calculate dimensions
            const moduleWidth = 2; // Width of smallest bar module in pixels
            const barcodeHeight = 100; // Height of bars
            const marginTop = 20; // Space at top
            const marginLeft = 15; // Space at left
            
            // Calculate total width needed
            const totalWidth = barcodeStr.length * moduleWidth + marginLeft * 2;
            
            // Adjust canvas size if needed
            if (totalWidth > barcodeCanvas.width) {
                barcodeCanvas.width = totalWidth;
            }
            
            // Draw bars
            let x = marginLeft;
            for (let i = 0; i < barcodeStr.length; i++) {
                if (barcodeStr[i] === '1') {
                    ctx.fillRect(x, marginTop, moduleWidth, barcodeHeight);
                }
                x += moduleWidth;
            }
            
            // Draw text below barcode
            ctx.font = '18px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(text, barcodeCanvas.width / 2, marginTop + barcodeHeight + 30);
            
            // Update text display
            barcodeText.textContent = text;
        }
        
        // Show error message
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
        
        // Event listeners
        generateBtn.addEventListener('click', generateBarcode);
        
        barcodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateBarcode();
            }
        });
        
        // Initialize with a sample barcode
        window.addEventListener('load', function() {
            barcodeInput.value = "CODE128-DEMO-2026";
            generateBarcode();
        });
