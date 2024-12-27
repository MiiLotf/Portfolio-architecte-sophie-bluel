// URL de l'API
const apiUrlWorks = 'http://localhost:5678/api/works';
const apiUrlCategories = 'http://localhost:5678/api/categories';

// Variables globales pour stocker les projets et les catégories
let allWorks = [];
let categories = [];

// Fonction générique pour effectuer des requêtes fetch
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    }
}

// Fonction pour récupérer les projets
async function fetchWorks() {
    const data = await fetchData(apiUrlWorks);
    if (data) {
        allWorks = data;
        console.log('Projets récupérés:', allWorks);  // Debug
        displayWorks(allWorks);  // Affiche tous les projets dans la galerie
    }
}

// Fonction pour récupérer les catégories
async function fetchCategories() {
    const data = await fetchData(apiUrlCategories);
    if (data) {
        categories = data;
        console.log('Catégories récupérées:', categories); // Debug pour vérifier les catégories
        displayCategories(categories);  // Affiche les boutons de catégories
    }
}

// Fonction pour afficher les projets dans la galerie
function displayWorks(works) {
    const gallery = document.getElementById('gallery');
    if (works.length === 0) {
        gallery.innerHTML = '<p>Aucun projet disponible.</p>';
    } else {
        gallery.innerHTML = works.map(work => `
            <figure data-id="${work.id}">
                <img src="${work.imageUrl}" alt="${work.title}" />
                <figcaption>${work.title}</figcaption>
            </figure>
        `).join('');
    }
}

// Fonction pour afficher les catégories sous forme de boutons
function displayCategories(categories) {
    const categoryFilterContainer = document.getElementById('category-filter');
    categoryFilterContainer.innerHTML = '';  // Vide les boutons de filtrage précédents

    // Crée un bouton "Tous"
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.classList.add('active');  // Marque "Tous" comme actif par défaut
    allButton.addEventListener('click', () => {
        displayWorks(allWorks);  // Affiche tous les projets
        setActiveButton(allButton);  // Marque "Tous" comme actif
    });
    categoryFilterContainer.appendChild(allButton);

    // Crée un bouton pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.addEventListener('click', () => {
            const filteredWorks = allWorks.filter(work => work.category.id === category.id);
            displayWorks(filteredWorks);  // Affiche les projets filtrés par catégorie
            setActiveButton(button);  // Marque le bouton de la catégorie comme actif
        });
        categoryFilterContainer.appendChild(button);
    });
}

// Fonction pour définir le bouton actif
function setActiveButton(activeButton) {
    const buttons = document.querySelectorAll('#category-filter button');
    buttons.forEach(button => {
        button.classList.remove('active');  // Retirer l'active de tous les boutons
    });
    activeButton.classList.add('active');  // Ajouter l'active au bouton sélectionné
}

// Fonction pour afficher les projets dans la modale
function setupModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.querySelector('.close-modal');
    const editButton = document.getElementById('editButton');

    // Vérifie si l'utilisateur est authentifié avant d'afficher le bouton "Modifier"
    if (isAuthenticated()) {
        editButton.style.display = 'inline-block';  // Affiche le bouton "Modifier" si authentifié
    } else {
        editButton.style.display = 'none';  // Cache le bouton "Modifier" si non authentifié
    }

    editButton.addEventListener('click', () => {
        modalOverlay.style.display = 'block';

        // Vérifier si les projets ont déjà été récupérés
        if (allWorks.length === 0) {
            fetchWorks().then(() => displayWorksInModal());  // Attendre la récupération des projets avant d'afficher
        } else {
            displayWorksInModal();  // Si les projets sont déjà disponibles, les afficher directement
        }
    });

    closeModalBtn.addEventListener('click', () => modalOverlay.style.display = 'none');
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.style.display = 'none';
    });
}

// Vérifie si l'utilisateur est authentifié
function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return token && token.length > 0;
}

// Fonction pour afficher les projets dans la modale
function displayWorksInModal() {
    const modalContent = document.getElementById('modalContent');
    const photoGallery = document.getElementById('photo-gallery');
    
    if (allWorks.length === 0) {
        photoGallery.innerHTML = '<p>Aucune photo disponible.</p>';
    } else {
        photoGallery.innerHTML = allWorks.map(work => `
            <div class="photo-item" data-id="${work.id}">
                <img src="${work.imageUrl}" alt="${work.title}" />
                <span class="delete-icon" onclick="deleteWork(${work.id})">🗑️</span>
            </div>
        `).join('');
    }

    // Ajouter l'événement pour le bouton "Ajouter une photo"
    document.getElementById('add-photo-button').addEventListener('click', showAddPhotoForm);
}

// Suppression d'un projet
async function deleteWork(id) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${apiUrlWorks}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        alert('Photo supprimée avec succès');
        fetchWorks();  // Recharger les projets après suppression
    } else {
        alert('Erreur lors de la suppression de la photo');
    }
}

setupModal();
fetchWorks();
fetchCategories();
