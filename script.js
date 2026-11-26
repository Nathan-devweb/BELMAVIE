/*
 * Interactions de la page BELMAVI.
 * Chaque bloc s'occupe d'un comportement précis pour faciliter les futures
 * modifications. Les textes et les coordonnées restent à personnaliser.
 */

/*
 * À renseigner avant la mise en ligne. Tant que cette valeur reste vide, le
 * formulaire affiche un message explicite au lieu d'ouvrir un mailto fictif.
 */
const EMAIL_HOTEL = "";

/* Le menu mobile ne se replie que si le navigateur exécute ce fichier. */
document.documentElement.classList.add("js");

/* Raccourcis vers les éléments de la page */
const entete = document.querySelector("header");
const menu = document.getElementById("menu");
const boutonMenu = document.getElementById("menu-bouton");
const boutonHaut = document.getElementById("haut");

/* =========================================================
   1. MENU HAMBURGER (téléphone)
   ========================================================= */
function fermerMenu() {
  menu.classList.remove("ouvert");
  boutonMenu.setAttribute("aria-expanded", "false");
  boutonMenu.setAttribute("aria-label", "Ouvrir le menu");
}

boutonMenu.addEventListener("click", () => {
  const ouvert = menu.classList.toggle("ouvert");
  boutonMenu.setAttribute("aria-expanded", String(ouvert));
  boutonMenu.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
});

// Un menu ouvert sur téléphone ne doit pas réapparaître si on réduit ensuite la fenêtre.
window.addEventListener("resize", () => {
  if (window.innerWidth > 700) fermerMenu();
});

/* Le menu se ferme quand on clique sur un lien, ou sur la touche Échap */
menu.querySelectorAll("a").forEach(lien => {
  lien.addEventListener("click", fermerMenu);
});

document.addEventListener("keydown", evenement => {
  if (evenement.key === "Escape") fermerMenu();
});

/* =========================================================
   2. OMBRE DU MENU + BOUTON "RETOUR EN HAUT"
   ========================================================= */
function surDefilement() {
  entete.classList.toggle("ombre", window.scrollY > 10);
  boutonHaut.classList.toggle("visible", window.scrollY > 500);
}

window.addEventListener("scroll", surDefilement, { passive: true });
surDefilement();

boutonHaut.addEventListener("click", () => {
  // Le défilement fluide est coupé si la personne demande moins de mouvement.
  const preferenceMouvementReduit = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  window.scrollTo({
    top: 0,
    behavior: preferenceMouvementReduit ? "auto" : "smooth"
  });
});

/* =========================================================
   3. APPARITION DES BLOCS AU DÉFILEMENT
   Les blocs deviennent visibles quand ils entrent dans l'écran. Le CSS porte
   l'animation; ici, on ne fait qu'ajouter la classe qui la déclenche.
   ========================================================= */
const elementsANePasMasquer = document.querySelectorAll("[data-reveal]");
const preferenceMouvementReduit = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!("IntersectionObserver" in window) || preferenceMouvementReduit) {
  // Sans l'observateur, ou si l'animation est désactivée, tout reste visible.
  elementsANePasMasquer.forEach(element => element.classList.add("visible"));
} else {
  const observateurApparition = new IntersectionObserver((entrees, observateur) => {
    entrees.forEach(entree => {
      if (!entree.isIntersecting) return;

      entree.target.classList.add("visible");
      // Chaque élément n'a besoin d'être animé qu'une seule fois.
      observateur.unobserve(entree.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  elementsANePasMasquer.forEach(element => {
    observateurApparition.observe(element);
  });
}

/* =========================================================
   4. LIEN ACTIF : souligne le menu de la section visible
   Pour ajouter une section au suivi, donnez-lui un id et un lien dans le menu.
   ========================================================= */
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const observateurSections = new IntersectionObserver(entrees => {
    entrees.forEach(entree => {
      if (!entree.isIntersecting) return;

      menu.querySelectorAll("a").forEach(lien => {
        const lienCorrespond = lien.getAttribute("href") === `#${entree.target.id}`;
        lien.classList.toggle("actif", lienCorrespond);

        if (lienCorrespond) {
          lien.setAttribute("aria-current", "location");
        } else {
          lien.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(section => observateurSections.observe(section));
}

/* =========================================================
   5. IMAGES DE SECOURS
   Si vous remplacez une photo par un mauvais chemin (ex. images/photo.jpg
   qui n'existe pas), un fond vert s'affiche au lieu d'une image cassée.
   ========================================================= */
const IMAGE_SECOURS =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23a9cdb5'/%3E%3C/svg%3E";

function secours(img) {
  if (img.src !== IMAGE_SECOURS) img.src = IMAGE_SECOURS;
}

document.querySelectorAll("img").forEach(img => {
  img.addEventListener("error", () => secours(img));

  if (img.complete && img.naturalWidth === 0) secours(img);
});

/* =========================================================
   6. FORMULAIRE DE CONTACT
   Vérifie les champs, puis ouvre la messagerie du visiteur avec
   le message déjà écrit (envoi à EMAIL_HOTEL, défini en haut du fichier).
   ========================================================= */
const formulaire = document.getElementById("formulaire");
const retour = document.getElementById("form-message");

formulaire.addEventListener("submit", evenement => {
  evenement.preventDefault();

  if (!formulaire.checkValidity()) {
    formulaire.reportValidity();
    return;
  }

  if (!EMAIL_HOTEL) {
    retour.textContent = "Le formulaire de contact n'est pas encore configuré.";
    return;
  }

  const nom = formulaire.nom.value.trim();
  const email = formulaire.email.value.trim();
  const message = formulaire.message.value.trim();

  const sujet = `Message de ${nom} depuis le site BELMAVI`;
  const corps = `${message}\n\n${nom}\n${email}`;

  // encodeURIComponent protège les accents et les espaces dans le lien.
  window.location.href =
    `mailto:${EMAIL_HOTEL}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;

  retour.textContent = `Merci ${nom} ! Votre messagerie s'ouvre pour envoyer le message.`;
  formulaire.reset();
});

/* =========================================================
   7. ANNÉE AUTOMATIQUE DU PIED DE PAGE
   ========================================================= */
document.getElementById("annee").textContent = new Date().getFullYear();
