// Function to toggle the visibility of menu item details
function toggleDetails(item) {
    const details = item.querySelector('.details');
    const isVisible = details.style.display === 'block';
    details.style.display = isVisible ? 'none' : 'block';
}

// Function to create menu item elements
function createMenuItem(item) {
    const menuItem = document.createElement('article');
    menuItem.className = 'menu-item';
    menuItem.onclick = () => toggleDetails(menuItem);

    const itemInfo = document.createElement('div');
    itemInfo.className = 'item-info';

    const image = document.createElement('img');
    image.src= item.image;
    itemInfo.appendChild(image);

    const name = document.createElement('h3');
    name.textContent = item.name;
    itemInfo.appendChild(name);

    const description = document.createElement('p');
    description.textContent = item.description;
    itemInfo.appendChild(description);

    const details = document.createElement('div');
    details.className = 'details';
    details.innerHTML = `<p>Ingredients: ${item.ingredients}</p>`;
    itemInfo.appendChild(details);

    menuItem.appendChild(itemInfo);

    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = item.price;
    menuItem.appendChild(price);

    return menuItem;
}

// Function to populate the menu with data from JSON
function populateMenu(menuData, category = 'all') {
    const menu = document.getElementById('menu');
    menu.innerHTML = '';

    for (const cat in menuData) {
        if (category === 'all' || category === cat) {
            const section = document.createElement('section');
            section.className = 'menu-category';
            section.id = cat;

            const header = document.createElement('h2');
            header.textContent = cat.replace(/([A-Z])/g, ' $1').trim();
            section.appendChild(header);

            menuData[cat].forEach(item => {
                const menuItem = createMenuItem(item);
                section.appendChild(menuItem);
            });

            menu.appendChild(section);
        }
    }
}

// Function to filter menu items by search term
function searchMenuItems(menuData, searchTerm) {
    const filteredData = {};
    for (const category in menuData) {
        filteredData[category] = menuData[category].filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return filteredData;
}

// Fetching menu data and populating the menu
fetch('menuData.json')
    .then(response => response.json())
    .then(data => {
        // Initial population of the menu
        populateMenu(data);

        // Adding event listeners to category list items
        const categoryList = document.getElementById('category-list');
        categoryList.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                document.querySelectorAll('#category-list li').forEach(li => li.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.getAttribute('data-category');
                populateMenu(data, category);
            }
        });

        // Adding event listener to search input
        const searchInput = document.getElementById('search');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            const filteredData = searchMenuItems(data, searchTerm);
            populateMenu(filteredData);
        });
    })
    .catch(error => console.error('Error fetching menu data:', error));
