// JavaScript principal pour Express Complete Project

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Express Complete Project - JavaScript chargé");

  // Animation fade-in pour les éléments
  const elements = document.querySelectorAll(".card, .jumbotron");
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add("fade-in");
    }, index * 100);
  });

  // Gestion des formulaires
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="spinner"></span> Envoi...';
        submitBtn.disabled = true;

        // Restaurer le bouton après 3 secondes (au cas où)
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  });

  // Gestion des liens API avec prévisualisation
  const apiLinks = document.querySelectorAll('a[href*="/api/"]');
  apiLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.target !== "_blank") {
        e.preventDefault();
        fetchApiData(this.href);
      }
    });
  });

  // Fonction pour récupérer et afficher les données API
  async function fetchApiData(url) {
    try {
      showLoader();
      const response = await fetch(url);
      const data = await response.json();
      showApiModal(data, url);
    } catch (error) {
      console.error("Erreur API:", error);
      showAlert("Erreur lors de la récupération des données API", "danger");
    } finally {
      hideLoader();
    }
  }

  // Affichage modal pour les données API
  function showApiModal(data, url) {
    const modalHtml = `
            <div class="modal fade" id="apiModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">🔌 Réponse API</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>URL:</strong> <code>${url}</code></p>
                            <pre class="bg-light p-3 rounded"><code>${JSON.stringify(
                              data,
                              null,
                              2
                            )}</code></pre>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                            <a href="${url}" target="_blank" class="btn btn-primary">Ouvrir dans un nouvel onglet</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Supprimer l'ancien modal s'il existe
    const existingModal = document.getElementById("apiModal");
    if (existingModal) {
      existingModal.remove();
    }

    // Ajouter le nouveau modal
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    const modal = new bootstrap.Modal(document.getElementById("apiModal"));
    modal.show();
  }

  // Affichage d'alertes
  function showAlert(message, type = "info") {
    const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    const container = document.querySelector(".container");
    if (container) {
      container.insertAdjacentHTML("afterbegin", alertHtml);

      // Auto-remove après 5 secondes
      setTimeout(() => {
        const alert = container.querySelector(".alert");
        if (alert) {
          alert.remove();
        }
      }, 5000);
    }
  }

  // Loader
  function showLoader() {
    const loader = document.createElement("div");
    loader.id = "globalLoader";
    loader.className = "position-fixed top-50 start-50 translate-middle";
    loader.innerHTML =
      '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div>';
    document.body.appendChild(loader);
  }

  function hideLoader() {
    const loader = document.getElementById("globalLoader");
    if (loader) {
      loader.remove();
    }
  }

  // Mise à jour de l'heure en temps réel (si présente)
  const timeElement = document.querySelector("[data-live-time]");
  if (timeElement) {
    setInterval(() => {
      timeElement.textContent = new Date().toLocaleString("fr-FR");
    }, 1000);
  }

  // Gestion des tooltips Bootstrap
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Log des interactions utilisateur
  document.addEventListener("click", function (e) {
    if (e.target.tagName === "A" || e.target.tagName === "BUTTON") {
      console.log(
        "🖱️ Interaction:",
        e.target.textContent.trim(),
        "sur",
        window.location.pathname
      );
    }
  });
});

// Fonction utilitaire pour copier du texte
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showAlert("Copié dans le presse-papiers!", "success");
    })
    .catch((err) => {
      console.error("Erreur de copie:", err);
      showAlert("Erreur lors de la copie", "danger");
    });
}

// Export des fonctions utilitaires
window.ExpressApp = {
  copyToClipboard,
  showAlert: function (message, type = "info") {
    const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    const container = document.querySelector(".container");
    if (container) {
      container.insertAdjacentHTML("afterbegin", alertHtml);
    }
  },
};
