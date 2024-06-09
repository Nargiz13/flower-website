document.addEventListener("DOMContentLoaded", function() {
    const userIcon = document.getElementById('userIcon');
    const loginContainer = document.getElementById('loginContainer');

    userIcon.addEventListener('click', function(event) {
        event.preventDefault(); 
        if (loginContainer.style.display === 'none' || loginContainer.style.display === '') {
            loginContainer.style.display = 'block'; 
        } else {
            loginContainer.style.display = 'none'; 
        }
    });

    const searchIcon = document.getElementById('searchIcon');
    const searchFlowers = document.querySelector('.searchFlowers');

    function hideAndShow() {
        if (searchFlowers.style.display === 'none' || searchFlowers.style.display === '') {
            searchFlowers.style.display = 'block';
        } else {
            searchFlowers.style.display = 'none';
        }
    }

    searchIcon.addEventListener('click', function(event) {
        event.preventDefault(); 
        hideAndShow();
    });

    const favoriteButtons = document.querySelectorAll('.products .fas.fa-heart');

    favoriteButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.style.color = 'black'; // Change color to black on click
            const productName = button.getAttribute('data-name');
            const productImage = button.getAttribute('data-image');
            const productPrice = button.getAttribute('data-price');

            const product = { name: productName, image: productImage, price: productPrice };
            addToFavorites(product);
        });
    });

    const cartButtons = document.querySelectorAll('.cart-btn');
    const counter = document.getElementById('counter');

    let itemCount = 0;
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    counter.textContent = cartItems.length;

    cartButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.textContent = 'Added'; // Change text to 'Added'
            button.disabled = true; // Disable the button after adding

            const productName = button.getAttribute('data-name');
            const productImage = button.getAttribute('data-image');

            const product = { name: productName, image: productImage };

            const existingItem = cartItems.find(item => item.name === productName);
            if (existingItem) {
                existingItem.count++;
            } else {
                product.count = 1;
                cartItems.push(product);
            }

            itemCount = cartItems.reduce((total, item) => total + item.count, 0);
            counter.textContent = itemCount;

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        });
    });

    const infoButtons = document.querySelectorAll('.products .fas.fa-info-circle');
    const modal = document.getElementById("descriptionModal");
    const descriptionText = document.getElementById("descriptionText");
    const closeModal = document.getElementsByClassName("close")[0];

    infoButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const description = button.getAttribute('data-description');
            descriptionText.textContent = description;
            modal.style.display = "block";
        });
    });

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('fas') && event.target.classList.contains('fa-share')) {
            event.preventDefault();
            const flowerName = event.target.getAttribute('data-name');
            const closeModal = document.getElementsByClassName("close")[0];
            showFlowerInfo(flowerName);
        }
    });

    function showFlowerInfo(flowerName) {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                const flower = data.flowers.find(flower => flower.name === flowerName);
                if (flower) {
                    const descriptionCard = document.getElementById('description-card');
                    descriptionCard.innerHTML = `
                        <span class="close">&times;</span>
                        <h4>${flower.name}</h4>
                        <p>${flower.description}</p>
                        <p><strong>Habitat:</strong> ${flower.habitat}</p><br>
                        <p><strong>Species:</strong> ${flower.species}</p><br>
                        <p><strong>Care Tips:</strong> ${flower.careTips}</p>
                        
                    `;
                    descriptionCard.style.display = 'block';
                    const closeModalFlower = descriptionCard.querySelector('.close');
                    closeModalFlower.addEventListener('click', function() {
                        descriptionCard.style.display = "none";
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching description:', error);
            });
    }
});

function searchFlowers() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const flowersList = document.getElementById("flowersList");
            flowersList.innerHTML = ""; // Clear the list

            data.flowers.forEach(flower => {
                if (flower.name.toLowerCase().includes(searchInput) || flower.color.toLowerCase().includes(searchInput)) {
                    const flowerItem = document.createElement("div");
                    flowerItem.innerHTML = `
                        <div id="flower-container">
                            <img src="${flower.image}" alt="${flower.name}" style="width: 300px; height: 300px;">
                            <div id="addAndHeart">
                                <a id="heartBtn" class="fas fa-heart" href="#" data-name="${flower.name}" data-image="${flower.image}" data-price="${flower.price}"></a>
                                <button class="addToCartBtn">Add to Cart</button>
                                <a href="#" id="flwrinfo" class="fas fa-share" data-name="${flower.name}" data-description="${flower.description}"></a>
                            </div>
                            <div class="about-flower">
                                <h3>${flower.name}</h3>
                                <p>Color: ${flower.color}</p>
                                <p>Price: ${flower.price} $</p>
                            </div>
                        </div>
                    `;
                    flowersList.appendChild(flowerItem);
                }
            });

            if (flowersList.innerHTML.trim() === "") {
                flowersList.classList.add("empty");
            } else {
                flowersList.classList.remove("empty");
            }

            const heartButtons = document.querySelectorAll('.heartBtn');
            heartButtons.forEach(button => {
                button.addEventListener('click', () => {
                    button.style.color = 'black'; // Change color to black on click
                    const productName = button.getAttribute('data-name');
                    const productImage = button.getAttribute('data-image');
                    const productPrice = button.getAttribute('data-price');

                    const product = { name: productName, image: productImage, price: productPrice };
                    addToFavorites(product);
                });
            });

            const addToCartButtons = document.querySelectorAll('.addToCartBtn');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    button.textContent = 'Added'; // Change text to 'Added'
                    button.disabled = true; // Disable the button after adding

                    const productName = event.target.previousElementSibling.getAttribute('data-name');
                    const productImage = event.target.previousElementSibling.getAttribute('data-image');
                    const productPrice = event.target.previousElementSibling.getAttribute('data-price');

                    const product = { name: productName, image: productImage, price: productPrice };
                    addToCart(product);
                });
            });
        });
}

function filterByColor() {
    const selectedColor = document.getElementById("colorSelect").value.toLowerCase();
    const flowersList = document.getElementById("flowersList");
    const productBoxes = document.querySelectorAll('.products .box');

    // Filter flowers in the flowers list
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            flowersList.innerHTML = ""; // Clear the list

            data.flowers.forEach(flower => {
                if (selectedColor === 'all' || flower.color.toLowerCase() === selectedColor) {
                    const flowerItem = document.createElement("div");
                    flowerItem.innerHTML = `
                        <div id="flower-container">
                            <img src="${flower.image}" alt="${flower.name}" style="width: 300px; height: 300px;">
                            <div id="addAndHeart">
                                <a id="heartBtn" class="fas fa-heart" href="#" data-name="${flower.name}" data-image="${flower.image}" data-price="${flower.price}"></a>
                                <button class="addToCartBtn">Add to Cart</button>
                                <a href="#" id="flwrinfo" class="fas fa-share" data-name="${flower.name}" data-description="${flower.description}"></a>
                            </div>
                            <div class="about-flower">
                                <h3>${flower.name}</h3>
                                <p>Color: ${flower.color}</p>
                                <p>Price: ${flower.price} $</p>
                            </div>
                        </div>
                    `;
                    flowersList.appendChild(flowerItem);
                }
            });

            if (flowersList.innerHTML.trim() === "") {
                flowersList.classList.add("empty");
            } else {
                flowersList.classList.remove("empty");
            }

            const heartButtons = document.querySelectorAll('#heartBtn');
            heartButtons.forEach(button => {
                button.addEventListener('click', () => {
                    button.style.color = 'black'; 
                    const productName = button.getAttribute('data-name');
                    const productImage = button.getAttribute('data-image');
                    const productPrice = button.getAttribute('data-price');

                    const product = { name: productName, image: productImage, price: productPrice };
                    addToFavorites(product);
                });
            });

            const addToCartButtons = document.querySelectorAll('.addToCartBtn');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    button.textContent = 'Added'; 
                    button.disabled = true; 

                    const productName = event.target.previousElementSibling.getAttribute('data-name');
                    const productImage = event.target.previousElementSibling.getAttribute('data-image');
                    const productPrice = event.target.previousElementSibling.getAttribute('data-price');

                    const product = { name: productName, image: productImage, price: productPrice };
                    addToCart(product);
                });
            });
        });

    // Filter products in the products section
    productBoxes.forEach(box => {
        const productColor = box.getAttribute('data-color').toLowerCase();
        if (selectedColor === 'all' || productColor === selectedColor) {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    });
}

function addToCart(flower) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.name === flower.name);

    if (existingItem) {
        existingItem.count++;
    } else {
        flower.count = 1;
        cartItems.push(flower);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function addToFavorites(flower) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const existingItem = favorites.find(item => item.name === flower.name);

    if (existingItem) {
        existingItem.count++;
    } else {
        flower.count = 1;
        favorites.push(flower);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function showFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoritesList = document.getElementById("favoritesList");
    favoritesList.innerHTML = "";
    favorites.forEach(flower => {
        const flowerItem = document.createElement("div");
        flowerItem.innerHTML = `
            <div>
                <img src="${flower.image}" alt="${flower.name}" style="width: 300px; height: 300px;">
                <div class="about-flower">
                <h3>${flower.name}</h3>
                <p>Color: ${flower.color}</p>
                <p>Price: ${flower.price} $</p>
                </div>
            </div>
        `;
        favoritesList.appendChild(flowerItem);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const secondLabel = document.getElementById('second-label');
    const iconsDiv = document.querySelector('.icons');

    secondLabel.addEventListener('click', function() {
        iconsDiv.classList.toggle('show');
    });

    // Close the icons div when clicking outside of it
    window.addEventListener('click', function(event) {
        if (!iconsDiv.contains(event.target) && !secondLabel.contains(event.target)) {
            iconsDiv.classList.remove('show');
        }
    });
});
