const products = [
    { id: 1, name: 'iPhone 14 Pro', category: 'phones', price: 999, image: 'images/iphone-14-pro.png', description: 'The latest Pro iPhone with advanced features.', rating: 4.8 },
    { id: 2, name: 'iPhone 14', category: 'phones', price: 799, image: 'images/iphone-14.png', description: 'The powerful iPhone 14 for everyday use.', rating: 4.7 },
    { id: 3, name: 'iPad Pro', category: 'tablets', price: 799, image: 'images/ipad-pro.png', description: 'Powerful tablet for professionals.', rating: 4.9 },
    { id: 4, name: 'iPad Air', category: 'tablets', price: 599, image: 'images/ipad-air.png', description: 'Lightweight and powerful tablet for creatives.', rating: 4.7 },
    { id: 5, name: 'MacBook Pro', category: 'laptops', price: 1299, image: 'images/macbook-pro.png', description: 'High-performance laptop for professionals.', rating: 4.8 },
    { id: 6, name: 'MacBook Air', category: 'laptops', price: 999, image: 'images/macbook-air.png', description: 'Ultra-thin, ultra-capable laptop.', rating: 4.7 },
    { id: 7, name: 'Apple Watch Series 8', category: 'watches', price: 399, image: 'images/apple-watch-8.png', description: 'Advanced health features and fitness tracking.', rating: 4.6 },
    { id: 8, name: 'AirPods Pro', category: 'accessories', price: 249, image: 'images/airpods-pro.png', description: 'Immersive sound with active noise cancellation.', rating: 4.7 },
    { id: 9, name: 'iMac', category: 'desktops', price: 1299, image: 'images/imac.png', description: 'All-in-one desktop computer with stunning display.', rating: 4.8 },
    { id: 10, name: 'Mac Mini', category: 'desktops', price: 699, image: 'images/mac-mini.png', description: 'Compact desktop computer with powerful performance.', rating: 4.6 }
];

let cart = [];


const formatPrice = (price) => `$${price.toFixed(2)}`;

const displayProducts = (category = 'all') => {
    const productsContainer = document.getElementById('products-grid');
    productsContainer.innerHTML = '';
    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-card-content">
                <h3>${product.name}</h3>
                <p>${formatPrice(product.price)}</p>
                <p>Rating: ${product.rating}/5</p>
                <button onclick="addToCart(${product.id})" class="btn-primary">Add to Cart</button>
                <button onclick="showProductDetails(${product.id})" class="btn-secondary">View Details</button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
};

const displayFeaturedProducts = () => {
    const featuredProductsContainer = document.querySelector('.featured-products-grid');
    const featuredProducts = products.slice(0, 4); 
    
    featuredProductsContainer.innerHTML = '';
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-card-content">
                <h3>${product.name}</h3>
                <p>${formatPrice(product.price)}</p>
                <button onclick="addToCart(${product.id})" class="btn-primary">Add to Cart</button>
            </div>
        `;
        featuredProductsContainer.appendChild(productCard);
    });
};

const showProductDetails = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const productModal = document.getElementById('product-modal');
    const productDetail = document.getElementById('product-detail');
    productDetail.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="max-width: 100%; height: auto;">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Price: ${formatPrice(product.price)}</p>
        <p>Rating: ${product.rating}/5</p>
        <button onclick="addToCart(${product.id})" class="btn-primary">Add to Cart</button>
    `;
    productModal.style.display = 'block';
};

const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartDisplay();
    showNotification('Product added to cart');
};

const updateCartDisplay = () => {
    const cartItemCount = document.getElementById('cart-item-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCount.textContent = totalItems;
};

const displayCart = () => {
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = '';
    let subtotal = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div>
                            <h3>${item.name}</h3>
                            <p>${formatPrice(item.price)} each</p>
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <p>${formatPrice(itemTotal)}</p>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
        });
    }
    
    const tax = subtotal * 0.1; 
    const total = subtotal + tax;
    
    cartSubtotal.textContent = `Subtotal: ${formatPrice(subtotal)}`;
    cartTax.textContent = `Tax (10%): ${formatPrice(tax)}`;
    cartTotal.textContent = `Total: ${formatPrice(total)}`;
    
    cartModal.style.display = 'block';
};

const updateCartItemQuantity = (productId, newQuantity) => {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        if (newQuantity > 0) {
            cartItem.quantity = newQuantity;
        } else {
            removeFromCart(productId);
        }
        updateCartDisplay();
        displayCart();
    }
};

const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    displayCart();
    showNotification('Product removed from cart');
};

const searchProducts = () => {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const matchingProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
    );
    displayProducts('all', matchingProducts);
};

const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeButton(isDarkMode);
};

const updateDarkModeButton = (isDarkMode) => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
};


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-button').addEventListener('click', searchProducts);
    document.getElementById('search-bar').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    
    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayProducts(button.getAttribute('data-category'));
        });
    });
    
    document.getElementById('cart-icon').addEventListener('click', displayCart);
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    
    
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });

    
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    
    displayFeaturedProducts();
    displayProducts();
    updateCartDisplay();

    
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        updateDarkModeButton(true);
    }

    
    AOS.init({
        duration: 1000,
        once: true
    });
});

const addToCartAnimation = (button) => {
    const cart = document.querySelector('.cart-icon');
    const productCard = button.closest('.product-card');
    const productImage = productCard.querySelector('img');
    
    const productImageClone = productImage.cloneNode();
    productImageClone.style.position = 'fixed';
    productImageClone.style.height = '50px';
    productImageClone.style.width = '50px';
    productImageClone.style.opacity = '0.8';
    productImageClone.style.zIndex = '100';
    
    const rect = productImage.getBoundingClientRect();
    productImageClone.style.top = rect.top + 'px';
    productImageClone.style.left = rect.left + 'px';
    
    document.body.appendChild(productImageClone);
    
    const cartRect = cart.getBoundingClientRect();
    const cartX = cartRect.left + cartRect.width / 2;
    const cartY = cartRect.top + cartRect.height / 2;
    
    productImageClone.style.transition = 'all 0.8s ease-in-out';
    productImageClone.style.transform = `translate(${cartX - rect.left - 25}px, ${cartY - rect.top - 25}px) scale(0.1)`;
    productImageClone.style.opacity = '0';
    
    setTimeout(() => {
        productImageClone.remove();
    }, 800);
};

document.addEventListener('click', (e) => {
    if (e.target.matches('button') && e.target.textContent === 'Add to Cart') {
        addToCartAnimation(e.target);
    }
});
