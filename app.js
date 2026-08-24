/* ======================================
   VK Premium E-Commerce — Interactive Logic
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHeroSlider();
    initMobileMenu();
    initSearch();
    initCart();
    initWishlist();
    initScrollAnimations();
    initProductDetail();
    initShopFilters();
    initCheckout();
});

/* Hero Banner Animated Slider */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');

    if (!slides.length) return;

    let currentSlide = 0;
    let timer = null;
    const slideDuration = 5000;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        indicators.forEach(i => i.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');

        resetTimer();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(nextSlide, slideDuration);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => goToSlide(i));
    });

    // Start Auto-Play
    resetTimer();
}


/* Header Scroll Effect */
function initHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* Mobile Navigation Drawer */
function initMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('mobile-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!mobileMenu) return;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* Search Overlay */
function initSearch() {
    const searchToggle = document.getElementById('search-toggle');
    const searchClose = document.getElementById('search-close');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');

    if (!searchOverlay) return;

    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            if (searchInput) searchInput.focus();
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });
}

/* Cart Management (LocalStorage) */
function initCart() {
    let cart = JSON.parse(localStorage.getItem('vk_cart') || '[]');
    updateCartCount(cart);

    // Add to cart buttons listener
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.dataset.id || '1';
            const name = btn.dataset.name || 'Premium Oversized T-Shirt';
            const price = parseInt(btn.dataset.price || '1299');
            const color = document.querySelector('.color-dot.active')?.dataset.color || 'Black';
            const size = document.querySelector('.size-btn.active')?.textContent || 'L';
            const img = btn.dataset.img || 'images/black-tshirt.png';

            const existingIndex = cart.findIndex(item => item.id === id && item.color === color && item.size === size);

            if (existingIndex > -1) {
                cart[existingIndex].qty += 1;
            } else {
                cart.push({ id, name, price, color, size, img, qty: 1 });
            }

            localStorage.setItem('vk_cart', JSON.stringify(cart));
            updateCartCount(cart);

            // Toast feedback
            showToast(`Added ${name} (${size}) to Bag`);
        });
    });
}

function updateCartCount(cart) {
    const counts = document.querySelectorAll('.cart-count');
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    counts.forEach(c => {
        c.textContent = totalQty;
    });
}

/* Wishlist Toggle */
function initWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('vk_wishlist') || '[]');

    document.querySelectorAll('.product-card__action[aria-label="Add to wishlist"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const id = card ? card.id : 'product-fav';

            if (wishlist.includes(id)) {
                wishlist = wishlist.filter(item => item !== id);
                btn.style.color = '';
                showToast('Removed from Wishlist');
            } else {
                wishlist.push(id);
                btn.style.color = '#C75050';
                showToast('Added to Wishlist');
            }

            localStorage.setItem('vk_wishlist', JSON.stringify(wishlist));
        });
    });
}

/* Toast Message */
function showToast(message) {
    const existing = document.querySelector('.vk-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'vk-toast';
    toast.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>${message}</span>
    `;

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '80px',
        right: '24px',
        background: '#1A1A1A',
        color: '#FFFFFF',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: '3000',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.3s ease forwards'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

/* Scroll Animations */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in, .product-card, .testimonial-card, .category-card').forEach(el => {
        observer.observe(el);
    });
}

/* Product Customizer: Multi-Category, Fabrics & Colors */
function initProductDetail() {
    const custTabs = document.querySelectorAll('.cust-tab');
    const colorGrid = document.getElementById('color-swatches');
    const fabricBox = document.getElementById('fabric-options');
    const mainImg = document.getElementById('main-product-img');
    const custTitle = document.getElementById('cust-title');
    const custDesc = document.getElementById('cust-desc');
    const custPrice = document.getElementById('cust-price');
    const custOldPrice = document.getElementById('cust-old-price');
    const custCategoryName = document.getElementById('cust-category-name');
    const selectedFabricName = document.getElementById('selected-fabric-name');
    const selectedColorName = document.getElementById('selected-color-name');
    const sizeSection = document.getElementById('size-section');

    if (!colorGrid) return;

    // Comprehensive Product Database for Customizer
    const customizerDb = {
        'tshirt': {
            category: 'T-Shirts',
            title: 'VK 240 GSM Organic Cotton Oversized Tee',
            desc: 'Engineered from 100% Organic Heavyweight Combed Cotton with bio-wash finish. Drop-shoulder relaxed fit.',
            price: '₹1,299',
            oldPrice: '₹1,899',
            img: 'images/black-tshirt.png',
            fabrics: [
                'Organic Cotton (240 GSM)',
                'Pima Soft Cotton',
                'Waffle Knit Breathable',
                'Acid Wash Vintage Cotton'
            ],
            colors: [
                { name: 'Jet Black', hex: '#1A1A1A', img: 'images/black-tshirt.png' },
                { name: 'Heather Gray', hex: '#9A9A9A', img: 'images/gray-tshirt.png' },
                { name: 'Cream White', hex: '#F5F5F0', img: 'images/black-tshirt.png' },
                { name: 'Sage Green', hex: '#7A8B7B', img: 'images/gray-tshirt.png' },
                { name: 'Maroon Red', hex: '#6b1d2f', img: 'images/black-tshirt.png' }
            ],
            hasSize: true
        },
        'shirt': {
            category: 'Shirts',
            title: 'Classic Italian Linen & Oxford Formal Shirt',
            desc: 'Tailored button-down shirt available in Pure Italian Linen, Cotton Satin, and Heavy Denim.',
            price: '₹2,199',
            oldPrice: '₹2,999',
            img: 'images/gray-tshirt.png',
            fabrics: [
                '100% Pure Italian Linen',
                'Oxford Cotton Weave',
                'Cotton Satin Silk Blend',
                'Vintage Denim Cotton'
            ],
            colors: [
                { name: 'Sky Blue', hex: '#87CEEB', img: 'images/gray-tshirt.png' },
                { name: 'Crisp White', hex: '#FFFFFF', img: 'images/black-tshirt.png' },
                { name: 'Navy Blue', hex: '#1E3A5F', img: 'images/gray-tshirt.png' },
                { name: 'Olive Green', hex: '#556B2F', img: 'images/black-tshirt.png' },
                { name: 'Wine Red', hex: '#722F37', img: 'images/gray-tshirt.png' }
            ],
            hasSize: true
        },
        'pants': {
            category: 'Pants & Trousers',
            title: 'Stretch Cotton Chino & Utility Cargo Trousers',
            desc: 'Premium tailored trousers in Stretch Chino, Ripstop Tactical Cargo, and Italian Wool Pleated fabrics.',
            price: '₹1,999',
            oldPrice: '₹2,699',
            img: 'images/black-tshirt.png',
            fabrics: [
                'Stretch Cotton Twill (Chinos)',
                'Ripstop Tactical Cotton (Cargos)',
                'Italian Wool Blend (Formal)',
                'Raw Heavy Denim (Jeans)',
                '100% Pure Linen (Summer)'
            ],
            colors: [
                { name: 'Khaki Beige', hex: '#C3B091', img: 'images/black-tshirt.png' },
                { name: 'Navy Blue', hex: '#1B263B', img: 'images/gray-tshirt.png' },
                { name: 'Olive Green', hex: '#3B4D3C', img: 'images/black-tshirt.png' },
                { name: 'Charcoal Gray', hex: '#36454F', img: 'images/gray-tshirt.png' },
                { name: 'Jet Black', hex: '#1A1A1A', img: 'images/black-tshirt.png' }
            ],
            hasSize: true
        },
        'watch': {
            category: 'Watches',
            title: 'Chronograph Stainless Steel & Leather Watch',
            desc: 'Precision Swiss quartz movement watch with genuine Italian leather strap or Milanese mesh bracelet.',
            price: '₹3,499',
            oldPrice: '₹4,999',
            img: 'images/watch.png',
            fabrics: [
                'Genuine Top-Grain Leather Strap',
                '316L Stainless Steel Mesh',
                'Matte Ceramic Coating'
            ],
            colors: [
                { name: 'Classic Brown Leather', hex: '#8B4513', img: 'images/watch.png' },
                { name: 'All-Black Matte', hex: '#111111', img: 'images/watch.png' },
                { name: 'Rose Gold Chrome', hex: '#B76E79', img: 'images/watch.png' },
                { name: 'Silver Steel', hex: '#C0C0C0', img: 'images/watch.png' },
                { name: 'Emerald Green Dial', hex: '#004B23', img: 'images/watch.png' }
            ],
            hasSize: false
        },
        'headphone': {
            category: 'Electronics',
            title: 'Studio Pro Active Noise Cancelling Headphones',
            desc: 'High-fidelity 40mm neodymium drivers, 40-hour battery life, plush memory foam ear cushions.',
            price: '₹4,999',
            oldPrice: '₹6,499',
            img: 'images/headphones.png',
            fabrics: [
                'Memory Foam & Protein Leather',
                'Matte Anodized Aluminum',
                'Acoustic Walnut Wood Accent'
            ],
            colors: [
                { name: 'Matte Stealth Black', hex: '#1A1A1A', img: 'images/headphones.png' },
                { name: 'Silver Platinum', hex: '#E5E5E5', img: 'images/headphones.png' },
                { name: 'Midnight Navy', hex: '#0A192F', img: 'images/headphones.png' },
                { name: 'Rose Champagne', hex: '#E8C5C8', img: 'images/headphones.png' }
            ],
            hasSize: false
        }
    };

    let activeKey = 'tshirt';

    function renderCustomizer(key) {
        activeKey = key;
        const data = customizerDb[key];
        if (!data) return;

        // Text updates
        if (custCategoryName) custCategoryName.textContent = data.category;
        if (custTitle) custTitle.textContent = data.title;
        if (custDesc) custDesc.textContent = data.desc;
        if (custPrice) custPrice.textContent = data.price;
        if (custOldPrice) custOldPrice.textContent = data.oldPrice;
        if (mainImg) mainImg.src = data.img;

        if (sizeSection) {
            sizeSection.style.display = data.hasSize ? 'block' : 'none';
        }

        // Render Fabrics
        if (fabricBox) {
            fabricBox.innerHTML = '';
            data.fabrics.forEach((fab, idx) => {
                const pill = document.createElement('button');
                pill.type = 'button';
                pill.className = `fabric-pill ${idx === 0 ? 'active' : ''}`;
                pill.textContent = fab;
                pill.addEventListener('click', () => {
                    document.querySelectorAll('.fabric-pill').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    if (selectedFabricName) selectedFabricName.textContent = fab;
                });
                fabricBox.appendChild(pill);
            });
            if (selectedFabricName) selectedFabricName.textContent = data.fabrics[0];
        }

        // Render Color Swatches
        if (colorGrid) {
            colorGrid.innerHTML = '';
            data.colors.forEach((col, idx) => {
                const swatch = document.createElement('div');
                swatch.className = `swatch-item ${idx === 0 ? 'active' : ''}`;
                swatch.innerHTML = `
                    <span class="swatch-circle" style="background-color: ${col.hex};"></span>
                    <span>${col.name}</span>
                `;
                swatch.addEventListener('click', () => {
                    document.querySelectorAll('.swatch-item').forEach(s => s.classList.remove('active'));
                    swatch.classList.add('active');
                    if (selectedColorName) selectedColorName.textContent = col.name;
                    if (mainImg) mainImg.src = col.img;
                });
                colorGrid.appendChild(swatch);
            });
            if (selectedColorName) selectedColorName.textContent = data.colors[0].name;
        }
    }

    // Category Tab Click Handler
    custTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            custTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const pKey = tab.dataset.product;
            renderCustomizer(pKey);
        });
    });

    // Initial render
    renderCustomizer('tshirt');
}


/* Shop Filters & Category Switching */
function initShopFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.products-grid--shop .product-card');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            products.forEach(prod => {
                if (filter === 'all' || prod.dataset.category === filter) {
                    prod.style.display = 'block';
                } else {
                    prod.style.display = 'none';
                }
            });
        });
    });
}

/* Checkout Page Render & Order Calculation */
function initCheckout() {
    const checkoutContainer = document.getElementById('checkout-order-items');
    if (!checkoutContainer) return;

    let cart = JSON.parse(localStorage.getItem('vk_cart') || '[]');

    if (cart.length === 0) {
        cart = [{
            id: '1',
            name: 'Premium Oversized T-Shirt',
            price: 1299,
            color: 'Black',
            size: 'L',
            img: 'images/black-tshirt.png',
            qty: 1
        }];
    }

    let subtotal = 0;
    checkoutContainer.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const row = document.createElement('div');
        row.className = 'order-item';
        row.innerHTML = `
            <div class="order-item__img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="order-item__info">
                <div class="order-item__name">${item.name}</div>
                <div class="order-item__meta">Color: ${item.color} | Size: ${item.size} | Qty: ${item.qty}</div>
            </div>
            <div class="order-item__price">₹${itemTotal.toLocaleString('en-IN')}</div>
        `;
        checkoutContainer.appendChild(row);
    });

    const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 0;
    const total = subtotal + shipping;

    const formattedTotal = `₹${total.toLocaleString('en-IN')}`;
    document.getElementById('checkout-subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('checkout-shipping').textContent = 'FREE';
    document.getElementById('checkout-total').textContent = formattedTotal;
    
    const modalAmt = document.getElementById('modal-amount-display');
    if (modalAmt) modalAmt.textContent = formattedTotal;

    // Payment Tab Selection Logic
    const paymentTabs = document.querySelectorAll('.payment-tab');
    const paymentPanels = document.querySelectorAll('.payment-panel');

    paymentTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            paymentTabs.forEach(t => t.classList.remove('active'));
            paymentPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const radio = tab.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            const val = radio.value;
            const targetPanel = document.getElementById(`panel-${val}`);
            if (targetPanel) targetPanel.classList.add('active');

            // Button label update
            const payBtn = document.getElementById('pay-now-btn');
            if (payBtn) {
                payBtn.textContent = val === 'cod' ? 'Place Order (Cash on Delivery)' : `Proceed to Pay ${formattedTotal}`;
            }
        });
    });

    // Copy UPI ID Button
    const copyBtn = document.getElementById('copy-upi-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('vkfashions@upi').then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy', 2000);
            });
        });
    }

    // Live Credit Card Input Mirroring
    const cardNumInput = document.getElementById('card-number');
    const cardHolderInput = document.getElementById('card-holder');
    const cardExpInput = document.getElementById('card-exp');

    const cardNumDisp = document.getElementById('card-num-disp');
    const cardNameDisp = document.getElementById('card-name-disp');
    const cardExpDisp = document.getElementById('card-exp-disp');

    if (cardNumInput) {
        cardNumInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 16);
            let formatted = val.match(/.{1,4}/g)?.join(' ') || '•••• •••• •••• ••••';
            cardNumInput.value = formatted;
            if (cardNumDisp) cardNumDisp.textContent = formatted;
        });
    }

    if (cardHolderInput) {
        cardHolderInput.addEventListener('input', (e) => {
            let val = e.target.value.toUpperCase() || 'RAHUL KUMAR';
            if (cardNameDisp) cardNameDisp.textContent = val;
        });
    }

    if (cardExpInput) {
        cardExpInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
            cardExpInput.value = val;
            if (cardExpDisp) cardExpDisp.textContent = val || '12/28';
        });
    }

    // Netbanking Bank Selection
    const bankOptions = document.querySelectorAll('.bank-option');
    bankOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            bankOptions.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Payment Form Submit & Razorpay / 3D-Secure Modal Flow
    const form = document.getElementById('checkout-form');
    const modal = document.getElementById('payment-modal');
    const stepProcessing = document.getElementById('modal-step-processing');
    const stepOtp = document.getElementById('modal-step-otp');
    const stepSuccess = document.getElementById('modal-step-success');

    if (form && modal) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const selectedMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'upi';

            // Open Modal
            modal.classList.add('active');
            stepProcessing.classList.add('active');
            stepOtp.classList.remove('active');
            stepSuccess.classList.remove('active');

            // Simulate Bank Processing -> OTP Screen
            setTimeout(() => {
                stepProcessing.classList.remove('active');
                if (selectedMethod === 'cod') {
                    // Direct Success for COD
                    showReceipt(selectedMethod, formattedTotal);
                } else {
                    // Show 3D Secure OTP verification
                    stepOtp.classList.add('active');
                }
            }, 1800);
        });

        // Verify OTP Button
        const verifyOtpBtn = document.getElementById('submit-otp-btn');
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', () => {
                stepOtp.classList.remove('active');
                stepProcessing.classList.add('active');

                // Authorize Payment
                setTimeout(() => {
                    stepProcessing.classList.remove('active');
                    const selectedMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'upi';
                    showReceipt(selectedMethod, formattedTotal);
                }, 1500);
            });
        }
    }

    function showReceipt(method, totalStr) {
        stepSuccess.classList.add('active');

        const orderId = '#VK-2026-' + Math.floor(1000 + Math.random() * 9000);
        const txId = 'PAY-' + Math.floor(1000000000 + Math.random() * 9000000000);

        const methodNames = {
            'upi': 'Instant UPI / GPay',
            'card': 'Credit / Debit Card',
            'netbanking': 'Net Banking',
            'cod': 'Cash on Delivery (COD)'
        };

        document.getElementById('receipt-order-id').textContent = orderId;
        document.getElementById('receipt-tx-id').textContent = txId;
        document.getElementById('receipt-method').textContent = methodNames[method] || 'Online Payment';
        document.getElementById('receipt-amount').textContent = totalStr;

        localStorage.removeItem('vk_cart');
        updateCartCount([]);
    }
}

