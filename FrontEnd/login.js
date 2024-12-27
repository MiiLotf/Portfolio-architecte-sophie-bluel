// Récupérer les éléments du formulaire et du message d'erreur
const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// Fonction pour envoyer les données de connexion à l'API
async function authenticateUser(identifiants) {
    try {
        const chargeUtile = JSON.stringify(identifiants);
        
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: chargeUtile
        });

        if (!response.ok) {
            throw new Error('Erreur dans l\'identifiant ou le mot de passe');
        }

        const data = await response.json();
        console.log(data); // Afficher la réponse de l'API (dont le token)

        // Sauvegarder les informations dans localStorage ou sessionStorage
        localStorage.setItem('authToken', data.token); // Utilisation de localStorage pour une connexion persistante
        localStorage.setItem('user', identifiants.email); // Sauvegarder l'email de l'utilisateur
        localStorage.setItem('isUser', 'true'); // Marquer l'utilisateur comme authentifié

        // Rediriger vers la page d'accueil après la connexion
        window.location.href = 'index.html'; 
    }
    catch (error) {
        console.log(error);
        errorMessage.style.display = 'block'; // Afficher le message d'erreur
    }
}

// Ajouter un événement au formulaire de connexion
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le rechargement de la page lors de la soumission

    // Récupérer les valeurs des champs du formulaire
    const identifiants = {
        email: event.target.querySelector("[name=username]").value,
        password: event.target.querySelector("[name=password]").value
    };

    authenticateUser(identifiants);
});
