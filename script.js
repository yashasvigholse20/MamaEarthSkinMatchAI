document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Fade Up Animations on Scroll
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => observer.observe(el));

    // Skin Analyzer Logic
    const analyzerForm = document.getElementById('skinAnalyzerForm');
    const analyzerResult = document.getElementById('analyzerResult');
    const analyzerLoader = document.getElementById('analyzerLoader');
    const routineContent = document.getElementById('routineContent');
    const routineSteps = document.getElementById('routineSteps');
    const resetAnalyzer = document.getElementById('resetAnalyzer');

    analyzerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Hide form, show loader
        analyzerForm.classList.add('hidden');
        analyzerResult.classList.remove('hidden');
        analyzerLoader.style.display = 'block';
        routineContent.classList.add('hidden');

        // Gather data
        const skinType = document.getElementById('skinType').value;
        const concern = document.getElementById('skinConcern').value;
        const sensitivity = document.getElementById('sensitivity').value;

        // Generate routine steps based on input
        setTimeout(() => {
            generateRoutine(skinType, concern, sensitivity);
            analyzerLoader.style.display = 'none';
            routineContent.classList.remove('hidden');
        }, 1500); // simulate analysis delay
    });

    function generateRoutine(type, concern, sensitivity) {
        routineSteps.innerHTML = '';

        const routine = [
            {
                step: 'Step 1: Cleanse',
                title: type === 'dry' || sensitivity === 'high' ? 'Gentle Hydrating Cleansing Milk' : 'Purifying Gel Cleanser',
                desc: 'Removes impurities without stripping natural oils.'
            },
            {
                step: 'Step 2: Treat',
                title: concern === 'acne' ? 'Salicylic Acid & Neem Serum' : concern === 'aging' ? 'Bakuchiol Anti-Aging Drops' : 'Vitamin C Glow Serum',
                desc: 'Targets specific concerns with highly concentrated botanicals.'
            },
            {
                step: 'Step 3: Moisturize',
                title: type === 'oily' ? 'Lightweight Aloe Gel Cream' : 'Rich Ceramide Recovery Cream',
                desc: 'Locks in hydration and repairs the skin barrier overnight.'
            },
            {
                step: 'Step 4: Protect',
                title: 'Broad Spectrum Mineral SPF 50',
                desc: 'Essential daily protection against UV, aging, and pigmentation.'
            }
        ];

        routine.forEach(item => {
            const stepHtml = `
                <div class="routine-step">
                    <div class="routine-step-num">${item.step}</div>
                    <div class="routine-step-title">${item.title}</div>
                    <div class="routine-step-desc">${item.desc}</div>
                </div>
            `;
            routineSteps.insertAdjacentHTML('beforeend', stepHtml);
        });
    }

    resetAnalyzer.addEventListener('click', () => {
        analyzerResult.classList.add('hidden');
        analyzerForm.classList.remove('hidden');
        analyzerForm.reset();
    });

});
