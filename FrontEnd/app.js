// URL de l'API
const apiUrlWorks = 'http://localhost:5678/api/works';
const apiUrlCategories = 'http://localhost:5678/api/categories';

// Variables globales pour stocker les projets et les catégories
let allWorks = [];
let categories = [];

// Fonction pour récupérer les projets
function fetchWorks() {
    fetch(apiUrlWorks)
        .then(response => response.json())  // Convertir la réponse en JSON
        .then(data => {
            allWorks = data;  // Sauvegarder les projets dans une variable globale
            displayWorks(allWorks);  // Afficher les projets dans la galerie
        })
        .catch(error => console.error('Erreur lors de la récupération des projets:', error));
}

// Fonction pour récupérer les catégories
function fetchCategories() {
    fetch(apiUrlCategories)
        .then(response => response.json())  // Convertir la réponse en JSON
        .then(data => {
            categories = data;  // Sauvegarder les catégories dans une variable globale
            displayCategories(categories);  // Afficher les catégories sous forme de boutons
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
}

// Fonction pour afficher les projets dans la galerie
function displayWorks(works) {
    const gallery = document.getElementById('gallery');
    
    // On vide la galerie avant d'ajouter les nouveaux projets
    gallery.innerHTML = '';

    // Pour chaque travail récupéré, on crée un élément HTML et on l'ajoute à la galerie
    works.forEach(work => {
        const figure = document.createElement('figure');
        
        // Créer l'image
        const image = document.createElement('img');
        image.src = work.imageUrl;
        image.alt = work.title;
        
        // Créer la légende
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title;
        
        // Ajouter l'image et la légende dans le figure
        figure.appendChild(image);
        figure.appendChild(figcaption);
        
        // Ajouter le figure à la galerie
        gallery.appendChild(figure);
    });
}

// Fonction pour afficher dynamiquement les filtres sous forme de boutons
function displayCategories(categories) {
    const categoryFilterContainer = document.getElementById('category-filter');
    
    // Vider le conteneur avant d'ajouter les nouveaux boutons
    categoryFilterContainer.innerHTML = '';
    
    // Créer un bouton "Tous" par défaut
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', () => filterWorksByCategory('all'));
    categoryFilterContainer.appendChild(allButton);
    
    // Ajouter un bouton pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.addEventListener('click', () => filterWorksByCategory(category.id));
        categoryFilterContainer.appendChild(button);
    });
}

// Fonction pour filtrer les projets par catégorie
function filterWorksByCategory(categoryId) {
    // Si "Tous les projets" est sélectionné, afficher tous les projets
    if (categoryId === 'all') {
        displayWorks(allWorks);  // Afficher tous les projets
    } else {
        // Filtrer les projets en fonction de la catégorie sélectionnée
        const filteredWorks = allWorks.filter(work => work.category.id == categoryId);
        displayWorks(filteredWorks);  // Afficher les projets filtrés
    }
}

// Appeler les fonctions dès que la page est prête
window.onload = function() {
    fetchCategories();  // Récupérer les catégories depuis l'API
    fetchWorks();  // Récupérer les projets depuis l'API
};
