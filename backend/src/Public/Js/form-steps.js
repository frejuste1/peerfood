/**
 * Gestion du formulaire multi-étapes
 */
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du formulaire
    const form = document.getElementById('newClientForm');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const progressBar = document.querySelector('.progress-bar');
    const steps = document.querySelectorAll('.step');
    
    // Boutons de navigation
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const saveBtn = document.getElementById('saveClient');
    
    // État actuel
    let currentStep = 1;
    const totalSteps = 2;
    
    // Gestionnaire pour le bouton Suivant
    nextBtn.addEventListener('click', function() {
        // Valider les champs de l'étape actuelle
        if (validateCurrentStep()) {
            goToStep(currentStep + 1);
        }
    });
    
    // Gestionnaire pour le bouton Précédent
    prevBtn.addEventListener('click', function() {
        goToStep(currentStep - 1);
    });
    
    // Gestionnaire pour le bouton Enregistrer
    saveBtn.addEventListener('click', function() {
        if (validateCurrentStep()) {
            saveClientData();
        }
    });
    
    // Fonction pour naviguer vers une étape spécifique
    function goToStep(stepNumber) {
        // Vérifier que l'étape est valide
        if (stepNumber < 1 || stepNumber > totalSteps) return;
        
        // Masquer l'étape actuelle
        if (currentStep === 1) {
            step1.style.display = 'none';
        } else if (currentStep === 2) {
            step2.style.display = 'none';
        }
        
        // Afficher la nouvelle étape
        if (stepNumber === 1) {
            step1.style.display = 'block';
            nextBtn.style.display = 'block';
            prevBtn.style.display = 'none';
            saveBtn.style.display = 'none';
            progressBar.style.width = '50%';
            progressBar.setAttribute('aria-valuenow', '50');
        } else if (stepNumber === 2) {
            step2.style.display = 'block';
            nextBtn.style.display = 'none';
            prevBtn.style.display = 'block';
            saveBtn.style.display = 'block';
            progressBar.style.width = '100%';
            progressBar.setAttribute('aria-valuenow', '100');
        }
        
        // Mettre à jour les indicateurs d'étape
        steps.forEach(function(step) {
            const stepIndex = parseInt(step.getAttribute('data-step'));
            step.classList.remove('active', 'completed');
            
            if (stepIndex === stepNumber) {
                step.classList.add('active');
            } else if (stepIndex < stepNumber) {
                step.classList.add('completed');
            }
        });
        
        // Mettre à jour l'étape actuelle
        currentStep = stepNumber;
    }
    
    // Fonction pour valider les champs de l'étape actuelle
    function validateCurrentStep() {
        let isValid = true;
        
        if (currentStep === 1) {
            // Valider les champs de l'étape 1
            const firstName = document.getElementById('clientFirstName');
            const lastName = document.getElementById('clientLastName');
            const phone = document.getElementById('clientPhone');
            const email = document.getElementById('clientEmail');
            
            // Vérifier que les champs requis sont remplis et valides
            if (!firstName.checkValidity()) {
                firstName.reportValidity();
                isValid = false;
            }
            
            if (!lastName.checkValidity()) {
                lastName.reportValidity();
                isValid = false;
            }
            
            if (!phone.checkValidity()) {
                phone.reportValidity();
                isValid = false;
            }
            
            if (!email.checkValidity()) {
                email.reportValidity();
                isValid = false;
            }
        } else if (currentStep === 2) {
            // Valider les champs de l'étape 2
            const customerId = document.getElementById('customerId');
            const username = document.getElementById('clientUsername');
            const password = document.getElementById('clientPassword');
            const role = document.getElementById('clientRole');
            
            // Vérifier que les champs requis sont remplis et valides
            if (!customerId.checkValidity()) {
                customerId.reportValidity();
                isValid = false;
            }
            
            if (!username.checkValidity()) {
                username.reportValidity();
                isValid = false;
            }
            
            if (!password.checkValidity()) {
                password.reportValidity();
                isValid = false;
            }
            
            if (role.value === '') {
                role.reportValidity();
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Fonction pour enregistrer les données du client
    function saveClientData() {
        // Récupérer toutes les données du formulaire
        const clientData = {
            firstName: document.getElementById('clientFirstName').value,
            lastName: document.getElementById('clientLastName').value,
            phone: document.getElementById('clientPhone').value,
            email: document.getElementById('clientEmail').value,
            customerId: document.getElementById('customerId').value,
            username: document.getElementById('clientUsername').value,
            password: document.getElementById('clientPassword').value,
            role: document.getElementById('clientRole').value
        };
        
        // Ici, vous pouvez ajouter le code pour envoyer les données au serveur
        
        
        // Simuler un enregistrement réussi
        alert('Client enregistré avec succès!');
        
        // Fermer le modal et réinitialiser le formulaire
        const modal = document.getElementById('newClientModal');
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-backdrop').remove();
        
        // Réinitialiser le formulaire
        form.reset();
        goToStep(1);
    }
    
    // Initialiser le formulaire à l'étape 1
    goToStep(1);
});