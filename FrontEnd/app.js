// URL de l'API
const apiUrlWorks = 'http://localhost:5678/api/works';
const apiUrlCategories = 'http://localhost:5678/api/categories';

// Variables globales pour stocker les projets et les catégories
let allWorks = [];
let categories = [];

// Fonction pour récupérer les projets
function fetchWorks() {
    fetch(apiUrlWorks)
        .then(response => response.json())
        .then(data => {
            allWorks = data; // Sauvegarder les projets dans une variable globale
            displayWorks(allWorks); // Afficher les projets dans la galerie
        })
        .catch(error => console.error('Erreur lors de la récupération des projets:', error));
}

// Fonction pour récupérer les catégories
function fetchCategories() {
    return fetch(apiUrlCategories)
        .then(response => response.json())
        .then(data => {
            categories = data; // Sauvegarder les catégories dans une variable globale
            displayCategories(categories); // Afficher les catégories sous forme de boutons

            // Dynamiser les options du formulaire après récupération des catégories
            populateCategoryOptions();
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
}

// Fonction pour dynamiser les options du formulaire d'ajout de projet
function populateCategoryOptions() {
    const categorySelect = document.getElementById('project-category');
    categorySelect.innerHTML = ''; // Vider le menu déroulant avant d'ajouter de nouvelles options

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Fonction pour afficher les projets dans la galerie
function displayWorks(works) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // On vide la galerie avant d'ajouter les nouveaux projets

    works.forEach(work => {
        const figure = createWorkElement(work);
        gallery.appendChild(figure);
    });
}

// Fonction pour créer un élément HTML pour un projet
function createWorkElement(work) {
    const figure = document.createElement('figure');
    figure.dataset.id = work.id;

    const image = document.createElement('img');
    image.src = work.imageUrl;
    image.alt = work.title;

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;

    figure.appendChild(image);
    figure.appendChild(figcaption);

    return figure;
}

// Fonction pour afficher dynamiquement les filtres sous forme de boutons
function displayCategories(categories) {
    const categoryFilterContainer = document.getElementById('category-filter');
    categoryFilterContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter les nouveaux boutons

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
    if (categoryId === 'all') {
        displayWorks(allWorks); // Afficher tous les projets
    } else {
        const filteredWorks = allWorks.filter(work => work.category.id == categoryId);
        displayWorks(filteredWorks); // Afficher les projets filtrés
    }
}

// Sélectionnez les éléments nécessaires
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.querySelector('.close-modal');
const editButton = document.getElementById('editButton');

// Fonction pour ouvrir la modale
function openModal() {
  modalOverlay.style.display = 'block';
  displayWorksInModal();
}

// Fonction pour fermer la modale
function closeModal() {
  modalOverlay.style.display = 'none';
}

// Écouteurs d'événements pour la modale
editButton.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Fonction pour afficher les travaux dans la modale
function displayWorksInModal() {
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = ''; // Vider le contenu de la modale avant d'ajouter des éléments

  allWorks.forEach(work => {
      const workElement = createModalWorkElement(work);
      modalContent.appendChild(workElement);
  });
}

// Fonction pour créer un élément HTML pour un projet dans la modale
function createModalWorkElement(work) {
  const workElement = document.createElement('div');
  workElement.className = 'modal-work';
  workElement.dataset.id = work.id;

  const img = document.createElement('img');
  img.src = work.imageUrl;
  img.alt = work.title;

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.onclick = () => deleteWork(work.id);

  workElement.appendChild(img);
  workElement.appendChild(deleteBtn);

  return workElement;
}

// Fonction pour supprimer un travail via l'API et mettre à jour le DOM
function deleteWork(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      if (response.ok) {
          allWorks = allWorks.filter(work => work.id !== id); // Mettre à jour la liste globale
          displayWorks(allWorks); // Mettre à jour la galerie principale
          displayWorksInModal(); // Mettre à jour la modale
      } else {
          console.error('Erreur lors de la suppression');
      }
    })
    .catch(error => console.error('Erreur:', error));
}

// Fonction pour gérer la soumission du formulaire d'ajout de projet
function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('project-title').value;
    const category = document.getElementById('project-category').value;
    const image = document.getElementById('project-image').files[0];

    if (!title || !category || !image) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', image);

    fetch(apiUrlWorks, {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => response.json())
      .then(newWork => {
          allWorks.push(newWork); // Ajouter le nouveau projet à la liste globale
          displayWorks(allWorks); // Mettre à jour la galerie principale
          displayWorksInModal(); // Mettre à jour la modale
          closeModal(); // Fermer la modale après ajout
          document.getElementById('add-project-form').reset(); // Réinitialiser le formulaire
      })
      .catch(error => console.error('Erreur:', error));
}

// Appeler les fonctions dès que la page est prête
window.onload = function() {
    fetchCategories(); // Récupérer les catégories depuis l'API et remplir le formulaire + boutons filtres
    fetchWorks(); // Récupérer et afficher les projets depuis l'API

    // Ajouter un écouteur d'événements au formulaire d'ajout de projet
    document.getElementById('add-project-form').addEventListener('submit', handleFormSubmit);
};
