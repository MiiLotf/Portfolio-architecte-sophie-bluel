// Récupérer les éléments du formulaire et du message d'erreur
const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// Fonction pour envoyer les données de connexion à l'API
async function authenticateUser(username, password) {
    try {
        await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur dans l\'identifiant ou le mot de passe');
            }
            return response.json();  // On récupère les données de la réponse (notamment le token)
        })
        .then(data => {
            console.log(data)
            sessionStorage.setItem('user', username); // garder en mémoire l'user
            sessionStorage.setItem('isUser', 'true'); // permet de se connecter


            // Si la connexion est réussie, sauvegarder le token et rediriger
            sessionStorage.setItem('authToken', data.token); // Sauvegarder le token dans le localStorage
            window.location.href = 'index.html'; // Rediriger vers la page d'accueil (index.html)
        })
    }

    catch(error){
        console.log(error)
        errorMessage.style.display = 'block'; // Afficher le message d'erreur

    }

}

// Ajouter un événement au formulaire de connexion
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le rechargement de la page lors de la soumission

    // Récupérer les valeurs des champs du formulaire
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

authenticateUser(username, password)

});

