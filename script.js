// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const fromFlag = document.getElementById('from-flag');
const toFlag = document.getElementById('to-flag');
const convertedAmount = document.getElementById('converted-amount');
const loadingSpinner = document.getElementById('loading-spinner');
const swapBtn = document.getElementById('swap-btn');
const convertBtn = document.getElementById('convert-btn');
const resetBtn = document.getElementById('reset-btn');
const lastUpdated = document.getElementById('last-updated');

// Common currencies with their flags
const currencies = {
    USD: { name: 'US Dollar', flag: 'https://flagcdn.com/w20/us.png' },
    EUR: { name: 'Euro', flag: 'https://flagcdn.com/w20/eu.png' },
    GBP: { name: 'British Pound', flag: 'https://flagcdn.com/w20/gb.png' },
    JPY: { name: 'Japanese Yen', flag: 'https://flagcdn.com/w20/jp.png' },
    AUD: { name: 'Australian Dollar', flag: 'https://flagcdn.com/w20/au.png' },
    CAD: { name: 'Canadian Dollar', flag: 'https://flagcdn.com/w20/ca.png' },
    CHF: { name: 'Swiss Franc', flag: 'https://flagcdn.com/w20/ch.png' },
    CNY: { name: 'Chinese Yuan', flag: 'https://flagcdn.com/w20/cn.png' },
    INR: { name: 'Indian Rupee', flag: 'https://flagcdn.com/w20/in.png' },
    NZD: { name: 'New Zealand Dollar', flag: 'https://flagcdn.com/w20/nz.png' }
};

// Populate currency dropdowns
function populateCurrencyDropdowns() {
    // Clear existing options
    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';
    
    for (const [code, data] of Object.entries(currencies)) {
        const fromOption = document.createElement('option');
        const toOption = document.createElement('option');
        
        fromOption.value = code;
        toOption.value = code;
        
        fromOption.textContent = `${code} - ${data.name}`;
        toOption.textContent = `${code} - ${data.name}`;
        
        if (code === 'USD') fromOption.selected = true;
        if (code === 'INR') toOption.selected = true;
        
        fromCurrency.appendChild(fromOption);
        toCurrency.appendChild(toOption);
    }
    
    // Set initial flags
    updateFlags();
}

// Update flag images
function updateFlags() {
    const fromCode = fromCurrency.value;
    const toCode = toCurrency.value;
    
    console.log('Updating flags for:', fromCode, toCode);
    
    // Use a higher quality flag source with proper country codes
    const fromFlagUrl = `https://flagcdn.com/w40/${getCountryCode(fromCode)}.png`;
    const toFlagUrl = `https://flagcdn.com/w40/${getCountryCode(toCode)}.png`;
    
    console.log('Flag URLs:', fromFlagUrl, toFlagUrl);
    
    fromFlag.src = fromFlagUrl;
    toFlag.src = toFlagUrl;
    
    fromFlag.alt = `${fromCode} flag`;
    toFlag.alt = `${toCode} flag`;
    
    // Add event listeners to check if images loaded successfully
    fromFlag.onload = () => console.log('From flag loaded successfully');
    fromFlag.onerror = () => console.error('Error loading from flag');
    
    toFlag.onload = () => console.log('To flag loaded successfully');
    toFlag.onerror = () => console.error('Error loading to flag');
}

// Helper function to get the correct country code for the flag API
function getCountryCode(currencyCode) {
    // Map of currency codes to country codes for the flag API
    const countryMap = {
        'USD': 'us',
        'EUR': 'eu',
        'GBP': 'gb',
        'JPY': 'jp',
        'AUD': 'au',
        'CAD': 'ca',
        'CHF': 'ch',
        'CNY': 'cn',
        'INR': 'in',
        'NZD': 'nz'
    };
    
    return countryMap[currencyCode] || currencyCode.toLowerCase();
}

// Show loading spinner
function showLoading() {
    loadingSpinner.style.display = 'block';
    convertedAmount.style.display = 'none';
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.style.display = 'none';
    convertedAmount.style.display = 'block';
}

// Format date and time
function formatDateTime(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    lastUpdated.textContent = formatDateTime(now);
}

// Add animation to the result when conversion is successful
function animateResult() {
    convertedAmount.classList.add('success');
    setTimeout(() => {
        convertedAmount.classList.remove('success');
    }, 1000);
}

// Add animation to the result when there's an error
function animateError() {
    convertedAmount.classList.add('error');
    setTimeout(() => {
        convertedAmount.classList.remove('error');
    }, 1000);
}

// Convert currency
async function convertCurrency() {
    const amount = amountInput.value;
    const from = fromCurrency.value;
    const to = toCurrency.value;
    
    console.log(`Converting ${amount} ${from} to ${to}`);
    
    if (amount <= 0) {
        convertedAmount.textContent = 'Please enter a valid amount';
        animateError();
        return;
    }
    
    showLoading();
    
    try {
        // Using a more reliable API endpoint
        const apiUrl = `https://api.exchangerate-api.com/v4/latest/${from}`;
        console.log('Fetching from API:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.rates && data.rates[to]) {
            const rate = data.rates[to];
            const result = (amount * rate).toFixed(2);
            convertedAmount.textContent = `${amount} ${from} = ${result} ${to}`;
            console.log('Conversion successful:', result);
            
            // Update last updated timestamp
            updateLastUpdated();
            
            // Add success animation
            animateResult();
        } else {
            convertedAmount.textContent = 'Error: Could not fetch exchange rate';
            console.error('API returned invalid data');
            
            // Add error animation
            animateError();
        }
    } catch (error) {
        console.error('Error during conversion:', error);
        convertedAmount.textContent = 'Error: Could not connect to the server. Please try again later.';
        
        // Add error animation
        animateError();
    }
    
    hideLoading();
}

// Swap currencies
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    updateFlags();
    convertCurrency();
}

// Reset form
function resetForm() {
    amountInput.value = 1;
    fromCurrency.value = 'USD';
    toCurrency.value = 'INR';
    updateFlags();
    convertCurrency();
}

// Event listeners
amountInput.addEventListener('input', () => {
    // Don't convert on every keystroke, just update the UI
    if (amountInput.value <= 0) {
        convertedAmount.textContent = 'Please enter a valid amount';
    }
});

fromCurrency.addEventListener('change', () => {
    updateFlags();
    convertCurrency();
});

toCurrency.addEventListener('change', () => {
    updateFlags();
    convertCurrency();
});

swapBtn.addEventListener('click', swapCurrencies);
convertBtn.addEventListener('click', convertCurrency);
resetBtn.addEventListener('click', resetForm);

// Add hover effect to the swap button
swapBtn.addEventListener('mouseenter', () => {
    swapBtn.style.transform = 'scale(1.1)';
});

swapBtn.addEventListener('mouseleave', () => {
    swapBtn.style.transform = 'scale(1)';
});

// Add focus effects to inputs
amountInput.addEventListener('focus', () => {
    amountInput.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.3)';
});

amountInput.addEventListener('blur', () => {
    amountInput.style.boxShadow = 'none';
});

fromCurrency.addEventListener('focus', () => {
    fromCurrency.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.3)';
});

fromCurrency.addEventListener('blur', () => {
    fromCurrency.style.boxShadow = 'none';
});

toCurrency.addEventListener('focus', () => {
    toCurrency.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.3)';
});

toCurrency.addEventListener('blur', () => {
    toCurrency.style.boxShadow = 'none';
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+Enter to convert
    if (e.ctrlKey && e.key === 'Enter') {
        convertCurrency();
    }
    
    // Ctrl+R to reset
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        resetForm();
    }
    
    // Ctrl+S to swap currencies
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        swapCurrencies();
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    populateCurrencyDropdowns();
    convertCurrency();
}); 