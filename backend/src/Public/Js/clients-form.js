/**
 * Gestion du formulaire client à deux étapes
 * Ce script remplace les validations existantes pour s'adapter au nouveau formulaire
 */
document.addEventListener('DOMContentLoaded', function() {
    // Références aux éléments du modal
    const modal = document.getElementById('newClientModal');
    const addClientBtn = document.querySelector('[data-action="add-client"]');
    const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');
    
    // Boutons de navigation
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const saveBtn = document.getElementById('saveClient');
    
    // Étapes du formulaire
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const progressBar = document.querySelector('.progress-bar');
    const steps = document.querySelectorAll('.step');
    
    // Champs du formulaire étape 1
    const clientFirstName = document.getElementById("clientFirstName");
    const clientLastName = document.getElementById("clientLastName");
    const clientPhone = document.getElementById("clientPhone");
    const clientEmail = document.getElementById("clientEmail");
    
    // Champs du formulaire étape 2
    const customerId = document.getElementById("customerId");
    const clientUsername = document.getElementById("clientUsername");
    const clientPassword = document.getElementById("clientPassword");
    const clientRole = document.getElementById("clientRole");
    
    // Messages d'aide
    const clientFirstNameHelp = document.getElementById("clientFirstNameHelp");
    const clientLastNameHelp = document.getElementById("clientLastNameHelp");
    const clientPhoneHelp = document.getElementById("clientPhoneHelp");
    const clientEmailHelp = document.getElementById("clientEmailHelp");
    const customerIdHelp = document.getElementById("customerIdHelp");
    const clientUsernameHelp = document.getElementById("clientUsernameHelp");
    const clientPasswordHelp = document.getElementById("clientPasswordHelp");
    
    // État actuel
    let currentStep = 1;
    const totalSteps = 2;
    
    // Ouvrir le modal
    addClientBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        modal.classList.add('show');
        document.body.classList.add('modal-open');
        
        // Ajouter un backdrop si nécessaire
        if (!document.querySelector('.modal-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.classList.add('modal-backdrop', 'fade', 'show');
            document.body.appendChild(backdrop);
        }
        
        // Réinitialiser le formulaire
        resetForm();
    });
    
    // Fermer le modal
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // Fonction pour fermer le modal
    function closeModal() {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
    }
    
    // Réinitialiser le formulaire
    function resetForm() {
        document.getElementById('newClientForm').reset();
        goToStep(1);
        
        // Réinitialiser les classes de validation
        const formInputs = document.querySelectorAll('#newClientForm input, #newClientForm select');
        formInputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
        
        // Réinitialiser les messages d'aide
        const helpTexts = document.querySelectorAll('#newClientForm .form-text');
        helpTexts.forEach(help => {
            help.textContent = help.getAttribute('data-default-text') || help.textContent;
        });
    }
    
    // ✅ Vérification du Prénom
    clientFirstName.addEventListener("input", () => {
        const value = clientFirstName.value.trim();
        if (!/^[a-zA-ZÀ-ÿ]+$/.test(value)) {
            clientFirstNameHelp.textContent = "⚠️ Le prénom doit contenir uniquement des lettres";
            clientFirstName.classList.add("is-invalid");
            clientFirstName.classList.remove("is-valid");
        } else {
            clientFirstNameHelp.textContent = "✅ Prénom valide";
            clientFirstName.classList.remove("is-invalid");
            clientFirstName.classList.add("is-valid");
        }
    });
    
    // ✅ Vérification du Nom
    clientLastName.addEventListener("input", () => {
        const value = clientLastName.value.trim();
        if (!/^[a-zA-ZÀ-ÿ]+$/.test(value)) {
            clientLastNameHelp.textContent = "⚠️ Le nom doit contenir uniquement des lettres";
            clientLastName.classList.add("is-invalid");
            clientLastName.classList.remove("is-valid");
        } else {
            clientLastNameHelp.textContent = "✅ Nom valide";
            clientLastName.classList.remove("is-invalid");
            clientLastName.classList.add("is-valid");
        }
    });
    
    // ✅ Vérification du Téléphone (format français)
    clientPhone.addEventListener("input", () => {
        const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!regex.test(clientPhone.value)) {
            clientPhoneHelp.textContent = "⚠️ Format invalide (ex: 06 12 34 56 78)";
            clientPhone.classList.add("is-invalid");
            clientPhone.classList.remove("is-valid");
        } else {
            clientPhoneHelp.textContent = "✅ Numéro valide";
            clientPhone.classList.remove("is-invalid");
            clientPhone.classList.add("is-valid");
        }
    });
    
    // ✅ Vérification de l'Email
    clientEmail.addEventListener("input", () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(clientEmail.value)) {
            clientEmailHelp.textContent = "⚠️ Format d'email invalide";
            clientEmail.classList.add("is-invalid");
            clientEmail.classList.remove("is-valid");
        } else {
            clientEmailHelp.textContent = "✅ Email valide";
            clientEmail.classList.remove("is-invalid");
            clientEmail.classList.add("is-valid");
        }
    });
    
    // ✅ Vérification de l'ID Client
    customerId.addEventListener("input", () => {
        const regex = /^[A-Z0-9]{3,10}$/;
        if (!regex.test(customerId.value)) {
            customerIdHelp.textContent = "⚠️ Format: 3 à 10 caractères (lettres majuscules, chiffres)";
            customerId.classList.add("is-invalid");
            customerId.classList.remove("is-valid");
        } else {
            customerIdHelp.textContent = "✅ ID Client valide";
            customerId.classList.remove("is-invalid");
            customerId.classList.add("is-valid");
        }
    });
    
    // ✅ Vérification du Nom d'Utilisateur
    clientUsername.addEventListener("input", () => {
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!regex.test(clientUsername.value)) {
            clientUsernameHelp.textContent = "⚠️ 3 à 20 caractères (lettres, chiffres, _)";
            clientUsername.classList.add("is-invalid");
            clientUsername.classList.remove("is-valid");
        } else {
            clientUsernameHelp.textContent = "✅ Nom d'utilisateur valide";
            clientUsername.classList.remove("is-invalid");
            clientUsername.classList.add("is-valid");
        }
    });
    
    // ✅ Vérification du Mot de passe
    clientPassword.addEventListener("input", () => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!regex.test(clientPassword.value)) {
            clientPasswordHelp.textContent = "⚠️ Minimum 8 caractères, au moins une lettre et un chiffre";
            clientPassword.classList.add("is-invalid");
            clientPassword.classList.remove("is-valid");
        } else {
            clientPasswordHelp.textContent = "✅ Mot de passe valide";
            clientPassword.classList.remove("is-invalid");
            clientPassword.classList.add("is-valid");
        }
    });
    
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
            if (!clientFirstName.checkValidity()) {
                clientFirstName.reportValidity();
                isValid = false;
            }
            
            if (!clientLastName.checkValidity()) {
                clientLastName.reportValidity();
                isValid = false;
            }
            
            if (!clientPhone.checkValidity()) {
                clientPhone.reportValidity();
                isValid = false;
            }
            
            if (!clientEmail.checkValidity()) {
                clientEmail.reportValidity();
                isValid = false;
            }
        } else if (currentStep === 2) {
            // Valider les champs de l'étape 2
            if (!customerId.checkValidity()) {
                customerId.reportValidity();
                isValid = false;
            }
            
            if (!clientUsername.checkValidity()) {
                clientUsername.reportValidity();
                isValid = false;
            }
            
            if (!clientPassword.checkValidity()) {
                clientPassword.reportValidity();
                isValid = false;
            }
            
            if (clientRole.value === '') {
                clientRole.reportValidity();
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Fonction pour enregistrer les données du client
    function saveClientData() {
        // Récupérer toutes les données du formulaire
        const clientData = {
            firstName: clientFirstName.value,
            lastName: clientLastName.value,
            phone: clientPhone.value,
            email: clientEmail.value,
            customerId: customerId.value,
            username: clientUsername.value,
            password: clientPassword.value,
            role: clientRole.value
        };
        
        // Ici, vous pouvez ajouter le code pour envoyer les données au serveur
        console.log('Données du client à enregistrer:', clientData);
        
        // Simuler un enregistrement réussi
        alert('Client enregistré avec succès!');
        
        // Fermer le modal et réinitialiser le formulaire
        closeModal();
        resetForm();
    }
    
    // Initialiser le formulaire à l'étape 1
    goToStep(1);
});