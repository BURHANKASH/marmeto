document.addEventListener('DOMContentLoaded', function () {
    fetchData('Men');
});

function fetchData(category) {
    const url = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data); // Log the entire API response

            const categoryData = data.categories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());

            if (categoryData && categoryData.category_products && Array.isArray(categoryData.category_products)) {
                const productsContainer = document.getElementById(`${category.toLowerCase()}Products`);
                productsContainer.innerHTML = '';

                categoryData.category_products.forEach(product => {
                    const productCard = createProductCard(product);
                    productsContainer.appendChild(productCard);
                });
            } else {
                console.error(`Invalid data format or category not found: ${category}`);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    const productImg = document.createElement('img');
    productImg.src = product.image;
    productImg.alt = product.title;
    productImg.classList.add('product-img');
    productCard.appendChild(productImg);

    const productInfoContainer = document.createElement('div');
    productInfoContainer.classList.add('product-info-container');
    productCard.appendChild(productInfoContainer);

    const productTitleContainer = document.createElement('div');
    productTitleContainer.classList.add('product-title-container');
    productInfoContainer.appendChild(productTitleContainer);

    const productTitle = document.createElement('div');
    productTitle.textContent = truncateTitle(product.title, 2); // Limit to 2 words
    productTitle.classList.add('product-title');
    productTitleContainer.appendChild(productTitle);

    const productBadge = document.createElement('div');
    productBadge.textContent = '\u2022'; // Unicode character for a black dot
    productBadge.classList.add('product-badge');
    productTitleContainer.appendChild(productBadge);

    const productDetails = document.createElement('div');
    productDetails.textContent = `${product.vendor}`;
    productDetails.classList.add('product-details');
    productTitleContainer.appendChild(productDetails);

    const discountPercent = calculateDiscount(product.price, product.compare_at_price);
    const productPrice = document.createElement('div');
    productPrice.innerHTML = `Rs: <span class="original-price">${product.price}</span> <span class="discounted-price">${product.compare_at_price}</span> <span class="discountPercent">${discountPercent}</span>% off`;
    productPrice.classList.add('product-price');
    productInfoContainer.appendChild(productPrice);

    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.classList.add('add-to-cart-btn');
    productCard.appendChild(addToCartBtn);

    return productCard;
}

// Function to truncate title after a specified number of words
function truncateTitle(title, wordLimit) {
    const words = title.split(' ');
    const truncatedTitle = words.slice(0, wordLimit).join(' ');
    return truncatedTitle + (words.length > wordLimit ? ' ...' : '');
}

function calculateDiscount(price, compareAtPrice) {
    const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
    return Math.round(discount);
}

function showProducts(category) {
    const allContainers = document.querySelectorAll('.product-container');
    allContainers.forEach(container => {
        container.style.display = 'none';
    });

    const formattedCategory = category.toLowerCase(); // Convert to lowercase for consistency
    const selectedContainer = document.getElementById(`${formattedCategory}Products`);

    if (selectedContainer) {
        selectedContainer.style.display = 'flex';
        fetchData(formattedCategory); // Fetch data for the selected category

        // Toggle the active class on the clicked tab
        const allTabs = document.querySelectorAll('.tab-btn');
        allTabs.forEach(tab => {
            tab.classList.remove('active');
        });

        const clickedTab = document.querySelector(`.tab-btn[data-category="${formattedCategory}"]`);
        if (clickedTab) {
            clickedTab.classList.add('active');
        } else {
            console.error(`Tab not found for category: ${formattedCategory}`);
        }
    } else {
        console.error(`Container not found for category: ${formattedCategory}`);
    }
}
