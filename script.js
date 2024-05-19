let providerCount = 1;

document.getElementById('add-provider').addEventListener('click', function() {
    addProvider();
});

function addProvider() {
    const providerContainer = document.getElementById('provider-container');
    const newProvider = document.createElement('div');
    newProvider.classList.add('provider-input');
    newProvider.id = `provider-${providerCount}`;
    newProvider.innerHTML = `
        <div class="input-field">
            <input type="text" id="provider-cost-${providerCount}" name="provider-cost" placeholder="Provider Cost ($)" oninput="formatInput(this)">
            <label for="provider-cost-${providerCount}">Provider Cost ($)</label>
            <span class="error-message" id="provider-cost-${providerCount}-error"></span>
        </div>
        <a href="#" class="btn gray addremove" onclick="removeProvider('provider-${providerCount}')"><i class="material-icons">delete</i></a>
    `;
    providerContainer.appendChild(newProvider);
    providerCount++;
    M.updateTextFields();  // Update Materialize fields
}

function removeProvider(id) {
    const provider = document.getElementById(id);
    if (provider) {
        provider.remove();
    }
}

function toggleProviders() {
    const providerContainer = document.getElementById('provider-container');
    const addProviderButton = document.getElementById('add-provider');
    const includeProviders = document.getElementById('include-providers').checked;

    if (includeProviders) {
        providerContainer.style.display = 'block';
        addProviderButton.style.display = 'inline-block';
    } else {
        providerContainer.style.display = 'none';
        addProviderButton.style.display = 'none';
    }
}

function formatInput(input) {
    if (!isNaN(value) && value !== '') {
        input.value = formatNumberWithCommas(value);
    }
}

function formatNumberWithCommas(value) {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatNumber(value) {
    const formattedValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
    return value.toLocaleString('en-US', {maximumFractionDigits: 2}).replace(/\.00$/, '');

}

function calculateCommission() {
    clearErrors();
    let valid = true;
    
    const projectPrice = parseFloat(document.getElementById('project-price').value.replace(/,/g, ''));
    const leadCost = parseFloat(document.getElementById('lead-cost').value.replace(/,/g, ''));
    const sharePercentage = parseFloat(document.getElementById('share-percentage').value);

    if (isNaN(projectPrice)) {
        document.getElementById('project-price-error').innerText = 'Please enter a valid project price.';
        valid = false;
    }
    if (isNaN(leadCost)) {
        document.getElementById('lead-cost-error').innerText = 'Please enter a valid lead cost.';
        valid = false;
    }
    if (isNaN(sharePercentage) || sharePercentage < 0 || sharePercentage > 100) {
        document.getElementById('share-percentage-error').innerText = 'Please enter a valid share percentage (0-100).';
        valid = false;
    }

    let totalProviderCost = 0;
    if (document.getElementById('include-providers').checked) {
        for (let i = 0; i < providerCount; i++) {
            const providerCostInput = document.getElementById(`provider-cost-${i}`);
            if (providerCostInput) {
                const providerCost = parseFloat(providerCostInput.value.replace(/,/g, ''));
                if (isNaN(providerCost)) {
                    document.getElementById(`provider-cost-${i}-error`).innerText = 'Please enter a valid provider cost.';
                    valid = false;
                } else {
                    totalProviderCost += providerCost;
                }
            }
        }
    }

    if (!valid) {
        return;
    }

    const totalCost = totalProviderCost + leadCost;
    const profit = projectPrice - totalCost;
    const commission = (profit * sharePercentage) / 100;

    // Display results in modal
    document.getElementById('modal-project-price').innerText = formatNumber(projectPrice);
    document.getElementById('modal-total-provider-cost').innerText = formatNumber(totalProviderCost);
    document.getElementById('modal-lead-cost').innerText = formatNumber(leadCost);
    document.getElementById('modal-profit').innerText = formatNumber(profit);
    document.getElementById('modal-total-commission').innerText = "$" + formatNumber(commission);

    // Open modal
    const modalInstance = M.Modal.getInstance(document.getElementById('results-modal'));
    modalInstance.open();
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.innerText = '');
}

document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', function() {
        formatInput(input);
    });
});

function clearDefault(el) {
    if (el.value === '0') {
        el.value = '';
    }
}

function restoreDefault(el) {
    if (el.value === '') {
        el.value = '0';
    } else {
        el.value = formatNumber(parseFloat(el.value.replace(/,/g, '')));
    }
}

toggleProviders();  // Initialize the provider section based on the checkbox state
