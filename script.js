const inputVal = document.getElementById('input-val');
const outputVal = document.getElementById('output-val');
const inputUnit = document.getElementById('input-unit');
const outputUnit = document.getElementById('output-unit');

let currentCategory = 'length';

const CONVERSIONS = {
    length: {
        name: "Length",
        base: "m",
        units: {
            m: { name: "Meters (m)", factor: 1 },
            km: { name: "Kilometers (km)", factor: 1000 },
            cm: { name: "Centimeters (cm)", factor: 0.01 },
            mm: { name: "Millimeters (mm)", factor: 0.001 },
            mi: { name: "Miles (mi)", factor: 1609.344 },
            yd: { name: "Yards (yd)", factor: 0.9144 },
            ft: { name: "Feet (ft)", factor: 0.3048 },
            in: { name: "Inches (in)", factor: 0.0254 },
            nm: { name: "Nanometers (nm)", factor: 1e-9 },
            ly: { name: "Light Years (ly)", factor: 9.461e15 }
        }
    },
    mass: {
        name: "Weight & Mass",
        base: "kg",
        units: {
            kg: { name: "Kilograms (kg)", factor: 1 },
            g: { name: "Grams (g)", factor: 0.001 },
            mg: { name: "Milligrams (mg)", factor: 1e-6 },
            lb: { name: "Pounds (lb)", factor: 0.45359237 },
            oz: { name: "Ounces (oz)", factor: 0.0283495231 },
            stone: { name: "Stones (st)", factor: 6.35029318 },
            t: { name: "Metric Tons (t)", factor: 1000 },
            uston: { name: "US Tons (ton)", factor: 907.18474 },
            carat: { name: "Carats (ct)", factor: 0.0002 },
            ug: { name: "Micrograms (µg)", factor: 1e-9 }
        }
    },
    area: {
        name: "Area",
        base: "m2",
        units: {
            m2: { name: "Square Meters (m²)", factor: 1 },
            km2: { name: "Square Kilometers (km²)", factor: 1e6 },
            cm2: { name: "Square Centimeters (cm²)", factor: 0.0001 },
            mm2: { name: "Square Millimeters (mm²)", factor: 1e-6 },
            mi2: { name: "Square Miles (mi²)", factor: 2.58998811e6 },
            yd2: { name: "Square Yards (yd²)", factor: 0.83612736 },
            ft2: { name: "Square Feet (ft²)", factor: 0.09290304 },
            in2: { name: "Square Inches (in²)", factor: 0.00064516 },
            ha: { name: "Hectares (ha)", factor: 10000 },
            acre: { name: "Acres (ac)", factor: 4046.85642 }
        }
    },
    temp: {
        name: "Temperature",
        special: true,
        units: {
            c: { name: "Celsius (°C)" },
            f: { name: "Fahrenheit (°F)" },
            k: { name: "Kelvin (K)" },
            r: { name: "Rankine (°R)" },
            re: { name: "Réaumur (°Re)" }
        }
    },
    data: {
        name: "Data & Storage",
        base: "B",
        units: {
            B: { name: "Bytes (B)", factor: 1 },
            KB: { name: "Kilobytes (KB)", factor: 1024 },
            MB: { name: "Megabytes (MB)", factor: 1024 * 1024 },
            GB: { name: "Gigabytes (GB)", factor: 1024 * 1024 * 1024 },
            TB: { name: "Terabytes (TB)", factor: 1024 * 1024 * 1024 * 1024 },
            PB: { name: "Petabytes (PB)", factor: 1024 * 1024 * 1024 * 1024 * 1024 },
            bit: { name: "Bits (bit)", factor: 0.125 },
            Kbit: { name: "Kilobits (Kbit)", factor: 128 },
            Mbit: { name: "Megabits (Mbit)", factor: 128 * 1024 },
            Gbit: { name: "Gigabits (Gbit)", factor: 128 * 1024 * 1024 }
        }
    },
    time: {
        name: "Time",
        base: "s",
        units: {
            s: { name: "Seconds (s)", factor: 1 },
            ms: { name: "Milliseconds (ms)", factor: 0.001 },
            min: { name: "Minutes (min)", factor: 60 },
            hr: { name: "Hours (hr)", factor: 3600 },
            day: { name: "Days (d)", factor: 86400 },
            week: { name: "Weeks (w)", factor: 604800 },
            month: { name: "Months (mo)", factor: 2.628e6 },
            yr: { name: "Years (yr)", factor: 3.154e7 }
        }
    },
    speed: {
        name: "Speed",
        base: "m/s",
        units: {
            mps: { name: "Meters / Second (m/s)", factor: 1 },
            kph: { name: "Kilometers / Hour (km/h)", factor: 1 / 3.6 },
            mph: { name: "Miles / Hour (mph)", factor: 0.44704 },
            fps: { name: "Feet / Second (fps)", factor: 0.3048 },
            knot: { name: "Knots (kt)", factor: 0.514444 },
            mach: { name: "Mach (Speed of Sound)", factor: 340.29 },
            c: { name: "Light Speed (c)", factor: 299792458 }
        }
    }
};

function populateUnits() {
    const cat = CONVERSIONS[currentCategory];
    
    // Clear select options
    inputUnit.innerHTML = '';
    outputUnit.innerHTML = '';
    
    // Add new unit options
    for (const [key, details] of Object.entries(cat.units)) {
        const opt1 = document.createElement('option');
        opt1.value = key;
        opt1.innerText = details.name;
        inputUnit.appendChild(opt1);
        
        const opt2 = document.createElement('option');
        opt2.value = key;
        opt2.innerText = details.name;
        outputUnit.appendChild(opt2);
    }
    
    // Select second item for output unit by default if available
    if (outputUnit.options.length > 1) {
        outputUnit.selectedIndex = 1;
    }
}

function convertTemp(value, from, to) {
    let kelvin;
    if (from === 'c') kelvin = value + 273.15;
    else if (from === 'f') kelvin = (value - 32) * 5/9 + 273.15;
    else if (from === 'k') kelvin = value;
    else if (from === 'r') kelvin = value * 5/9;
    else if (from === 're') kelvin = value * 1.25 + 273.15;

    if (to === 'c') return kelvin - 273.15;
    if (to === 'f') return (kelvin - 273.15) * 9/5 + 32;
    if (to === 'k') return kelvin;
    if (to === 'r') return kelvin * 9/5;
    if (to === 're') return (kelvin - 273.15) * 0.8;
}

function convert() {
    const value = parseFloat(inputVal.value);
    const from = inputUnit.value;
    const to = outputUnit.value;

    if (isNaN(value) || !from || !to) {
        outputVal.value = '';
        return;
    }

    let result;
    if (currentCategory === 'temp') {
        result = convertTemp(value, from, to);
    } else {
        const catUnits = CONVERSIONS[currentCategory].units;
        const baseValue = value * catUnits[from].factor;
        result = baseValue / catUnits[to].factor;
    }
    
    outputVal.value = result.toLocaleString(undefined, { maximumFractionDigits: 5 });

    // Show expand button
    if (!document.getElementById('expand-btn')) {
        const btn = document.createElement('button');
        btn.id = 'expand-btn';
        btn.innerText = 'Expand for Theory →';
        btn.style.marginTop = '1.5rem';
        btn.style.width = '100%';
        btn.style.padding = '0.9rem';
        btn.style.borderRadius = '12px';
        btn.style.border = '1px solid var(--border)';
        btn.style.background = '#1f2937';
        btn.style.color = '#fff';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = '700';
        btn.style.fontSize = '0.9rem';
        btn.style.fontFamily = 'inherit';
        btn.style.transition = 'all 0.2s ease';
        
        btn.onmouseover = () => {
            btn.style.background = '#374151';
        };
        btn.onmouseout = () => {
            btn.style.background = '#1f2937';
        };

        btn.onclick = () => {
            showSessionInterstitialAd(() => {
                openDetail();
            });
        };
        document.querySelector('main').appendChild(btn);
    }
}

function openDetail() {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('modalBody');
    const val = inputVal.value;
    const from = inputUnit.options[inputUnit.selectedIndex]?.text || '';
    const to = outputUnit.options[outputUnit.selectedIndex]?.text || '';
    const result = outputVal.value;

    const fromKey = inputUnit.value;
    const toKey = outputUnit.value;
    
    let factorText = "";
    if (currentCategory === 'temp') {
        factorText = "Dynamic Temperature Conversion Boundary";
    } else {
        const fromUnitFactor = CONVERSIONS[currentCategory].units[fromKey].factor;
        const toUnitFactor = CONVERSIONS[currentCategory].units[toKey].factor;
        factorText = `1 ${fromKey} = ${(fromUnitFactor / toUnitFactor).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${toKey}`;
    }

    body.innerHTML = `
        <div class="modal-hero" style="background:url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=600&q=80') center/cover; height:240px; border-radius:16px; margin-bottom:2rem; box-shadow:0 10px 25px rgba(0,0,0,0.05);"></div>
        <h2 style="font-size:2.2rem; margin:1rem 0; font-family: 'Inter', sans-serif; font-weight:800; color:#1f2937; letter-spacing:-1px;">Scientific Equivalence Report</h2>
        <p style="font-size:1.35rem; color:var(--primary); font-weight:800; margin-bottom:1.2rem; text-transform:uppercase;">${val} ${fromKey} = ${result} ${toKey}</p>
        <p style="font-size:0.95rem; color:#555; line-height:1.7; margin-bottom:2rem;">The mathematical transformation between ${from} and ${to} belongs to the category of ${CONVERSIONS[currentCategory].name} conversions. This conversion model maintains compliance with strict NIST and ISO-31 laboratory standards for spatial dimensions and astrophysical physics values.</p>
        
        <div class="extensive-info" style="background:#f9fafb; padding:2rem; border-radius:16px; border:1px solid var(--border); margin-bottom:2rem;">
            <h3 style="color:#1f2937; font-size:1.1rem; font-weight:800; text-transform:uppercase; margin-bottom:1rem; letter-spacing:0.5px;">Technical Reference Block</h3>
            <ul style="list-style:none; padding:0; color:#555; font-size:0.88rem; display:flex; flex-direction:column; gap:0.5rem;">
                <li><strong>Scaling Identity:</strong> ${factorText}</li>
                <li><strong>Verification Bounds:</strong> Standard ISO Calibration Compliance</li>
                <li><strong>Operational Domain:</strong> High-precision manufacturing, aviation grids, and academic research data sets.</li>
            </ul>
        </div>

        <div class="image-gallery" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem;">
            <img src="https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=300&h=300&q=80" style="width:100%; border-radius:12px; object-fit:cover; height:120px; border:1px solid var(--border);">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&h=300&q=80" style="width:100%; border-radius:12px; object-fit:cover; height:120px; border:1px solid var(--border);">
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&h=300&q=80" style="width:100%; border-radius:12px; object-fit:cover; height:120px; border:1px solid var(--border);">
        </div>
    `;
    
    modal.style.display = 'flex';
}

document.querySelector('.close-modal')?.addEventListener('click', () => {
    document.getElementById('detailModal').style.display = 'none';
});

window.onclick = (event) => {
    const modal = document.getElementById('detailModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

inputVal.addEventListener('input', convert);
inputUnit.addEventListener('change', convert);
outputUnit.addEventListener('change', convert);

// Initialize default category
populateUnits();
convert();

// Setup Category Tabs Switch Handlers
document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from other tabs
        document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Switch category and repopulate dropdown selectors
        currentCategory = tab.dataset.cat;
        populateUnits();
        
        // Auto convert!
        convert();
    });
});


// Close Celebration Modal Handler
const btnCloseCelebration = document.getElementById('btn-close-celebration');
if (btnCloseCelebration) {
    btnCloseCelebration.addEventListener('click', () => {
        document.getElementById('celebrationModal').style.display = 'none';
    });
}

// ========================================================
// STRATEGIC AD SYSTEM ENGINE (UNIT CONVERTER EDITION)
// ========================================================

// 1. Rotating Bottom Banner Ad Pool
const FLOATING_ADS = [
    {
        badge: 'PRO SPONSOR',
        text: '📐 <strong>UnitShift Pro:</strong> Unlock offline conversion formulas & 1,000+ scientific units. Get 14 days free!',
        buttonText: 'Claim Trial',
        alertMsg: 'Opening UnitShift Pro trial signup... Your 14-day free trial has been activated!'
    },
    {
        badge: 'FLIGHT SIMULATION',
        text: '✈️ <strong>FlowPro Dynamics:</strong> Simulate aerodynamic velocity fields directly in browser. 30-day free trial!',
        buttonText: 'Free Demo',
        alertMsg: 'Redirecting to FlowPro flight modeling system... 30-day demo license loaded!'
    },
    {
        badge: 'LAB GEAR',
        text: '🔬 <strong>OmniGauge Calibrators:</strong> NIST-traceable digital calipers and micrometers. Use code <strong>CALIB10</strong> for 10% off.',
        buttonText: 'Shop Calibrators',
        alertMsg: 'Opening OmniGauge laboratory catalog... Coupon CALIB10 applied!'
    },
    {
        badge: 'GRAPHING UTILITY',
        text: '📊 <strong>GraphX Studio:</strong> High-precision mathematical graphing and regression plotting tools. Try it now!',
        buttonText: 'Get App',
        alertMsg: 'Opening GraphX download site... Mathematical modeling dashboard ready!'
    },
    {
        badge: 'AUTOMOTIVE',
        text: '🚗 <strong>TorquePro Tools:</strong> Industrial torque wrench calibrations & metric conversions on-site.',
        buttonText: 'View Services',
        alertMsg: 'Redirecting to TorquePro calibration portal... Inquire for coordinate diagnostics!'
    },
    {
        badge: 'CAD SOFTWARE',
        text: '💻 <strong>DraftWise CAD:</strong> Native 2D drafting with built-in precise engineering conversions. 50% discount!',
        buttonText: 'Claim BOGO',
        alertMsg: 'Redirecting to DraftWise store... 50% professional discount added to cart!'
    }
];

// 2. Interchanging Full-Screen Recurring Pop-up Ad Pool
const POPUP_ADS = [
    {
        type: 'premium',
        badge: '📐',
        title: 'UnitShift Pro',
        subtitle: 'EXCLUSIVE PROFESSIONAL BUNDLE',
        desc: 'Unlock full mechanical, thermal, electrical, and astrophysical unit catalogs, 100% ad-free offline converters, and customizable formula sheets.',
        promoText: 'Special Engineering Discount Expires In:',
        hasTimer: true,
        acceptBtnText: 'Go Pro ($2)',
        declineBtnText: 'Skip Upgrade',
        alertMsg: '🎉 Welcome to UnitShift Pro! All premium SI-imperial converters unlocked, and ads disabled.'
    },
    {
        type: 'sponsor',
        badge: '✈️',
        title: 'FlowPro Flights',
        subtitle: 'SPONSORED AEROSPACE DESIGN',
        desc: 'Simulate complex aerodynamics, lift-drag boundaries, and wind tunnel tests in high definition on standard hardware. Built-in SI-imperial conversion systems.',
        promoText: 'SPECIAL PARTNER OFFER: AERO2026',
        hasTimer: false,
        acceptBtnText: 'Start Free Demo',
        declineBtnText: 'Dismiss Ad',
        alertMsg: 'Redirecting to FlowPro modeling page... Aerospace design trial unlocked!'
    },
    {
        type: 'sponsor',
        badge: '💻',
        title: 'DraftWise CAD',
        subtitle: 'SPONSORED DRAFTING UTILITY',
        desc: 'Clean, modern 2D drafting suite with direct dwg/dxf compatibility, precision dimension snaps, and coordinate scaling tools.',
        promoText: 'CLAIM SPECIAL 50% OFF SUBSCRIPTION RATE',
        hasTimer: false,
        acceptBtnText: 'Get DraftWise',
        declineBtnText: 'No Thanks',
        alertMsg: 'Redirecting to DraftWise CAD store... 50% off promotion code applied!'
    },
    {
        type: 'sponsor',
        badge: '🔬',
        title: 'OmniGauge Labs',
        subtitle: 'NATIVE ENGINEERING HARDWARE',
        desc: 'NIST-calibrated digital measuring calipers, laser micrometers, and laboratory testing scales built for extreme repeatability.',
        promoText: 'USE DISCOUNT CODE "CALIB15" FOR 15% OFF',
        hasTimer: false,
        acceptBtnText: 'Shop Calibrators',
        declineBtnText: 'Close Ad',
        alertMsg: 'Redirecting to OmniGauge catalog... Discount code CALIB15 copied to clipboard!'
    },
    {
        type: 'sponsor',
        badge: '📊',
        title: 'GraphX Mathematical Studio',
        subtitle: 'FREE DIRECT DIGITAL DOWNLOAD',
        desc: 'Model polynomial matrix regressions, high-dimensional tensor graphs, and complex trigonometry inside a beautiful reactive IDE.',
        promoText: 'FREE GRAPHX APP DOWNLOAD READY',
        hasTimer: false,
        acceptBtnText: 'Download GraphX',
        declineBtnText: 'Skip Studio',
        alertMsg: 'Downloading your free GraphX math modeling client installer... Please verify your downloads directory!'
    }
];

// 3. Floating Banner Rotation Logic
const floatingAdBanner = document.getElementById('floating-ad-banner');
let currentAdIdx = 0;
let bannerRotationInterval = null;

function renderBannerAd(idx) {
    if (!floatingAdBanner || FLOATING_ADS.length === 0) return;
    const ad = FLOATING_ADS[idx];
    floatingAdBanner.innerHTML = `
        <div class="banner-content">
            <span class="banner-badge">${ad.badge} ${ad.badge === 'PRO SPONSOR' ? 'PRO' : 'SPONSOR'}</span>
            <p>${ad.text}</p>
        </div>
        <div class="banner-actions">
            <button class="btn-banner-action" id="btn-banner-shop">${ad.buttonText}</button>
            <button class="btn-banner-close" id="btn-banner-close">&times;</button>
        </div>
    `;
}

function rotateFloatingAd() {
    if (!floatingAdBanner || floatingAdBanner.style.display === 'none') return;
    floatingAdBanner.classList.add('fade-out');
    setTimeout(() => {
        currentAdIdx = (currentAdIdx + 1) % FLOATING_ADS.length;
        renderBannerAd(currentAdIdx);
        floatingAdBanner.classList.remove('fade-out');
    }, 400);
}

// Slide-in the floating banner after 4 seconds
setTimeout(() => {
    if (floatingAdBanner) {
        renderBannerAd(currentAdIdx);
        floatingAdBanner.style.display = 'flex';
        bannerRotationInterval = setInterval(rotateFloatingAd, 10000);
    }
}, 4000);

// Safe Event Delegation for floating banner
if (floatingAdBanner) {
    floatingAdBanner.addEventListener('click', (e) => {
        const target = e.target;
        if (target.id === 'btn-banner-close') {
            floatingAdBanner.style.display = 'none';
            if (bannerRotationInterval) clearInterval(bannerRotationInterval);
        } else if (target.id === 'btn-banner-shop') {
            const activeAd = FLOATING_ADS[currentAdIdx];
            alert(activeAd.alertMsg);
            floatingAdBanner.style.display = 'none';
            if (bannerRotationInterval) clearInterval(bannerRotationInterval);
        }
    });
}

// 4. Recurring Interchanging Pop-up Modal Logic
const premiumUpgradeModal = document.getElementById('premiumUpgradeModal');
let activePopupIdx = 0;
let upgradeCountdownTimer = null;
let nextPopupTimeout = null;

function startPremiumCountdown() {
    let durationSeconds = 10 * 60; // 10 minutes
    const display = document.getElementById('premium-timer-display');
    if (!display) return;
    
    if (upgradeCountdownTimer) clearInterval(upgradeCountdownTimer);
    upgradeCountdownTimer = setInterval(() => {
        durationSeconds--;
        if (durationSeconds >= 0) {
            const mins = Math.floor(durationSeconds / 60);
            const secs = durationSeconds % 60;
            display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            clearInterval(upgradeCountdownTimer);
            premiumUpgradeModal.style.display = 'none';
            scheduleNextPopup();
        }
    }, 1000);
}

function renderPopupAdContent(ad) {
    if (!premiumUpgradeModal) return;
    
    let promoHTML = ad.hasTimer
        ? `<div style="background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.08); padding: 1.2rem; border-radius: 12px; margin-bottom: 2.5rem; display: flex; justify-content: center; align-items: center; gap: 1rem; color:#333;">
               <span style="font-size: 0.85rem; font-weight: 700; color: #666;">${ad.promoText}</span>
               <span id="premium-timer-display" style="font-family: monospace; font-size: 1.5rem; font-weight: 800; color: #2563eb;">10:00</span>
           </div>`
        : `<div style="background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.08); padding: 1.2rem; border-radius: 12px; margin-bottom: 2.5rem; text-align: center;">
               <span style="font-size: 0.95rem; font-weight: 800; color: #2563eb; letter-spacing: 0.5px; text-transform: uppercase;">${ad.promoText}</span>
           </div>`;

    premiumUpgradeModal.innerHTML = `
        <div class="modal-content" style="max-width: 540px; text-align: center; border-color: rgba(37, 99, 235, 0.15); box-shadow: 0 0 40px rgba(37, 99, 235, 0.05);">
            <div class="celebration-badge" style="font-size: 4rem; animation: pulse 2s infinite; margin-bottom: 1rem;">${ad.badge}</div>
            <h2 style="font-family: 'Inter', sans-serif; font-weight: 800; font-size: 2.2rem; color: #2563eb; margin: 1rem 0 0.5rem; letter-spacing: -1px; text-transform: uppercase;">${ad.title}</h2>
            <p style="color: #888; font-size: 0.85rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.5rem;">${ad.subtitle}</p>
            <p style="color: #555; font-size: 1.05rem; line-height: 1.6; margin-bottom: 2rem;">${ad.desc}</p>
            ${promoHTML}
            <div style="display: flex; gap: 1.5rem;">
                <button class="btn-secondary" id="btn-decline-upgrade" style="flex: 1; padding: 1rem;">${ad.declineBtnText}</button>
                <button class="ad-btn" id="btn-accept-upgrade" style="flex: 1; padding: 1rem; background: #2563eb; color:white; border-color:#2563eb;">${ad.acceptBtnText}</button>
            </div>
        </div>
    `;
    if (ad.hasTimer) startPremiumCountdown();
}

function triggerPopupAdFlow() {
    if (!premiumUpgradeModal) return;
    renderPopupAdContent(POPUP_ADS[activePopupIdx]);
    premiumUpgradeModal.style.display = 'flex';
}

function scheduleNextPopup(delayMs = 60000) {
    if (nextPopupTimeout) clearTimeout(nextPopupTimeout);
    nextPopupTimeout = setTimeout(() => {
        activePopupIdx = (activePopupIdx + 1) % POPUP_ADS.length;
        triggerPopupAdFlow();
    }, delayMs);
}

// Start recurring popup loop after 15 seconds
setTimeout(triggerPopupAdFlow, 15000);

// Event delegation on popup modal
if (premiumUpgradeModal) {
    premiumUpgradeModal.addEventListener('click', (e) => {
        const target = e.target;
        if (target.id === 'btn-decline-upgrade') {
            premiumUpgradeModal.style.display = 'none';
            if (upgradeCountdownTimer) clearInterval(upgradeCountdownTimer);
            scheduleNextPopup();
        } else if (target.id === 'btn-accept-upgrade') {
            const activeAd = POPUP_ADS[activePopupIdx];
            alert(activeAd.alertMsg);
            premiumUpgradeModal.style.display = 'none';
            if (upgradeCountdownTimer) clearInterval(upgradeCountdownTimer);
            
            if (activeAd.type === 'premium') {
                // Remove all ads for UnitShift Pro!
                if (floatingAdBanner) floatingAdBanner.style.display = 'none';
                if (bannerRotationInterval) clearInterval(bannerRotationInterval);
                if (nextPopupTimeout) clearTimeout(nextPopupTimeout);
            } else {
                scheduleNextPopup();
            }
        }
    });
}

// 5. Interstitial Search/Details Completion Skip-Ad
const interstitialModal = document.getElementById('interstitialAdModal');
const btnSkipAd = document.getElementById('btn-skip-ad');
const btnClaimAd = document.getElementById('btn-claim-ad');
let interstitialTimer = null;
let interstitialCallback = null;

const INTERSTITIAL_CAMPAIGNS = [
    {
        title: 'FlowPro Simulations',
        desc: 'Unlock professional aeronautical modeling and aerospace fluid calculations. Free 30-day corporate trial.',
        promo: 'ENTER CODE "AERO2026" AT REGISTRATION',
        img: 'https://picsum.photos/seed/flight/200/200'
    },
    {
        title: 'DraftWise CAD Software',
        desc: 'Universal 2D layout drafting and precise technical modeling snaps with coordinate calculation matrices.',
        promo: 'GET 50% OFF: DRAFT50',
        img: 'https://picsum.photos/seed/blueprint/200/200'
    },
    {
        title: 'OmniGauge Calibration',
        desc: 'Professional engineering labs rely on OmniGauge digital micrometers and laboratory scaling systems.',
        promo: 'CODE "CALIB20" SAVES 20%',
        img: 'https://picsum.photos/seed/ruler/200/200'
    }
];

function showSessionInterstitialAd(onClosed) {
    if (!interstitialModal) {
        onClosed();
        return;
    }
    
    interstitialCallback = onClosed;
    
    // Choose random interstitial campaign
    const campaign = INTERSTITIAL_CAMPAIGNS[Math.floor(Math.random() * INTERSTITIAL_CAMPAIGNS.length)];
    const imgEl = document.getElementById('interstitial-ad-img');
    const titleEl = document.getElementById('interstitial-ad-title');
    const descEl = document.getElementById('interstitial-ad-desc');
    const promoEl = document.getElementById('interstitial-ad-promo');
    
    if (imgEl) imgEl.src = campaign.img;
    if (titleEl) titleEl.innerText = campaign.title;
    if (descEl) descEl.innerText = campaign.desc;
    if (promoEl) promoEl.innerText = campaign.promo;

    interstitialModal.style.display = 'flex';
    
    btnSkipAd.disabled = true;
    btnSkipAd.style.opacity = '0.4';
    btnSkipAd.style.cursor = 'not-allowed';
    btnSkipAd.innerText = 'Skip Ad in 5s';
    
    let count = 5;
    if (interstitialTimer) clearInterval(interstitialTimer);
    
    interstitialTimer = setInterval(() => {
        count--;
        if (count > 0) {
            btnSkipAd.innerText = `Skip Ad in ${count}s`;
        } else {
            clearInterval(interstitialTimer);
            btnSkipAd.innerText = 'Skip Ad';
            btnSkipAd.disabled = false;
            btnSkipAd.style.opacity = '1';
            btnSkipAd.style.cursor = 'pointer';
        }
    }, 1000);
}

if (btnSkipAd) {
    btnSkipAd.addEventListener('click', () => {
        interstitialModal.style.display = 'none';
        
        // Render precise synchronization celebration modal
        const celebrationModal = document.getElementById('celebrationModal');
        if (celebrationModal) {
            celebrationModal.style.display = 'flex';
        } else if (interstitialCallback) {
            interstitialCallback();
        }
    });
}

if (btnClaimAd) {
    btnClaimAd.addEventListener('click', () => {
        alert('🎉 Engineering Offer Claimed! Promo code copied to your clipboard.');
        interstitialModal.style.display = 'none';
        
        const celebrationModal = document.getElementById('celebrationModal');
        if (celebrationModal) {
            celebrationModal.style.display = 'flex';
        } else if (interstitialCallback) {
            interstitialCallback();
        }
    });
}

// Celebration Close Handler
const btnCloseCelebrationModal = document.getElementById('btn-close-celebration');
if (btnCloseCelebrationModal) {
    btnCloseCelebrationModal.addEventListener('click', () => {
        document.getElementById('celebrationModal').style.display = 'none';
        if (interstitialCallback) {
            interstitialCallback();
            interstitialCallback = null;
        }
    });
}

