document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('goldForm');
    const resultsSection = document.getElementById('results');
    const scoreCircle = document.querySelector('.circle');
    const percentageText = document.querySelector('.percentage');
    const gradeTitle = document.getElementById('gradeTitle');
    const explanation = document.getElementById('explanation');
    const estimatedValueSpan = document.getElementById('estimatedValue');
    const valuationSection = document.getElementById('valuationSection');
    
    // Breakdown Elements
    const purityScoreEl = document.getElementById('purityScore');
    const formScoreEl = document.getElementById('formScore');
    const conditionScoreEl = document.getElementById('conditionScore');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Gather Inputs
        const weight = parseFloat(document.getElementById('weight').value);
        const purity = document.getElementById('purity').value; // string key
        const formType = document.getElementById('form').value;
        const condition = document.getElementById('condition').value;
        const marketPrice = parseFloat(document.getElementById('marketPrice').value) || 0;

        // --- SCORING ALGORITHM ---
        
        // 1. Purity Score (Max 40)
        let notePurity = 0;
        let purityVal = 0;
        switch(purity) {
            case '24': notePurity = 40; purityVal = 0.999; break;
            case '22': notePurity = 35; purityVal = 0.916; break;
            case '18': notePurity = 25; purityVal = 0.750; break;
            case '14': notePurity = 15; purityVal = 0.583; break;
            case '10': notePurity = 5;  purityVal = 0.417; break; // Approximated
            default: notePurity = 5; purityVal = 0;
        }

        // 2. Form Score (Max 30)
        let noteForm = 0;
        switch(formType) {
            case 'bar': noteForm = 30; break;
            case 'coin': noteForm = 28; break;
            case 'jewelry': noteForm = 20; break;
            case 'scrap': noteForm = 10; break;
            default: noteForm = 10;
        }

        // 3. Condition Score (Max 30)
        let noteCondition = 0;
        switch(condition) {
            case 'new': noteCondition = 30; break;
            case 'excellent': noteCondition = 25; break;
            case 'good': noteCondition = 20; break;
            case 'damaged': noteCondition = 10; break;
            default: noteCondition = 10;
        }

        const totalScore = notePurity + noteForm + noteCondition;

        // --- DISPLAY & ANIMATION ---

        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });

        // Update Breakdown
        purityScoreEl.textContent = notePurity;
        formScoreEl.textContent = noteForm;
        conditionScoreEl.textContent = noteCondition;

        // Update Gauge Animation
        // Dasharray: first value is length of dash, second is length of gap. 
        // 100 is circumference. 
        setTimeout(() => {
            scoreCircle.setAttribute('stroke-dasharray', `${totalScore}, 100`);
            percentageText.textContent = totalScore;
        }, 100);

        // Determine Grade & Explanation
        let grade = '';
        let expl = '';

        if (totalScore >= 90) {
            grade = 'Pristine / Investment Grade';
            expl = 'This item is of the highest quality. It represents pure gold in perfect condition, ideal for investment.';
            scoreCircle.style.stroke = '#2ecc71'; // Green
        } else if (totalScore >= 75) {
            grade = 'Excellent Quality';
            expl = 'A high-value item with great purity and condition. Very liquid in the market.';
            scoreCircle.style.stroke = '#f1c40f'; // Gold
        } else if (totalScore >= 50) {
            grade = 'Standard / Commercial';
            expl = 'Typical commercial gold quality. Good for jewelry or trade, but may have lower purity or wear.';
            scoreCircle.style.stroke = '#e67e22'; // Orange
        } else {
            grade = 'Low Grade / Scrap';
            expl = 'Significant factors (low purity, damage, or scrap form) reduce the score. Primarily valued for melt weight.';
            scoreCircle.style.stroke = '#e74c3c'; // Red
        }

        gradeTitle.textContent = grade;
        explanation.textContent = expl;

        // Valuation Logic (Optional)
        if (marketPrice > 0 && weight > 0) {
            // Simple valuation: Weight * Market Price * Purity %
            // Note: This is a raw melt value estimate, ignoring premiums or craftsmanship.
            const estimatedVal = weight * marketPrice * purityVal;
            estimatedValueSpan.textContent = estimatedVal.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            valuationSection.classList.remove('hidden');
        } else {
            valuationSection.classList.add('hidden');
        }
    });

    // Reset gauge when inputs change (optional UX polish)
    form.addEventListener('change', () => {
       // Could hide results or reset opacity here if desired
    });
});
