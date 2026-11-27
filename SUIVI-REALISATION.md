# Suivi de réalisation du site BELMAVI

Ce document présente les étapes de création du site, le rôle de ses fichiers
et la façon dont le code a été rédigé. Il sert aussi de journal : mettez à jour
la progression après chaque nouvelle étape.

## État d'avancement

| Étape | Statut | Résultat |
|---|---|---|
| 1. Préparer les fichiers du site | Terminée | Structure HTML, CSS et JavaScript en place |
| 2. Construire le contenu de la page | Terminée | Accueil, informations chambres, présentation, contact et pied de page |
| 3. Créer le style visuel et l'adaptation mobile | Terminée | Thème vert et doré, grilles et règles pour petits écrans |
| 4. Ajouter les interactions | Terminée | Menu mobile protégé contre les éléments absents, images et année facultatives |
| 5. Rendre le code plus lisible | Terminée | Sections commentées et points de personnalisation indiqués |
| 6. Configurer le formulaire et les informations de l'hôtel | À faire | Créer le formulaire Formspree et renseigner les vraies coordonnées |
| 7. Tester le site final et le publier | À faire | Vérifier le formulaire, les mentions légales et les liens avant publication |

## Déroulement de la rédaction du code

### 1. Préparer la structure

La version actuelle du site se trouve à la racine du dépôt. La page principale
est [`index.html`](index.html). Les styles, scripts et images sont rangés ainsi :

- [`style.css`](style.css) : présentation et mise en page ;
- [`script.js`](script.js) : interactions ;
- [`images/`](images/) : images du site et favicon.

Utilisez ces fichiers à la racine comme source unique du site.

### 2. Construire la page HTML

Le HTML décrit le contenu et l'ordre des sections. La page a été organisée en
éléments distincts afin de retrouver facilement :

1. l'en-tête et le menu ;
2. la section d'accueil et son collage d'images ;
3. le bandeau des chambres ;
4. les informations pour préparer une demande de chambre ;
5. la présentation de l'hôtel ;
6. les coordonnées et le formulaire de contact ;
7. le pied de page et le bouton de retour en haut.

Les textes et images de démonstration peuvent être remplacés en conservant les
balises, identifiants et classes utilisés par le CSS et le JavaScript.

### 3. Définir l'apparence avec le CSS

Le CSS est organisé par thèmes : variables de couleurs et de polices, règles de
base, menu, sections, contact, pied de page et adaptations aux écrans mobiles.
Les variables au début du fichier permettent de modifier le thème à un seul
endroit. Les polices système et les SVG intégrés gardent le site visible hors
connexion.

Les règles `@media` adaptent la disposition aux écrans plus étroits. La règle
`prefers-reduced-motion` respecte les préférences d'accessibilité concernant
les animations.

### 4. Ajouter les comportements avec le JavaScript

Le JavaScript ajoute les interactions sans mélanger leur logique au contenu
HTML :

- ouverture et fermeture du menu mobile ;
- ombre de l'en-tête et affichage du bouton de retour en haut ;
- mise en évidence du lien correspondant à la section visible ;
- apparition progressive des blocs pendant le défilement ;
- image de remplacement lorsqu'une image ne se charge pas ;
- validation HTML accessible et formulaire de demande de séjour prêt à configurer avec Formspree ;
- mise à jour automatique de l'année du pied de page.

Le formulaire reste désactivé tant que l'identifiant Formspree n'est pas
renseigné dans `index.html`. Après configuration et test de l'envoi, retirez
l'attribut `disabled` du bouton et remplacez le message d'attente. Il utilise
un champ piège anti-robots et ne prétend pas confirmer un envoi qui n'a pas eu
lieu.

Les animations restent discrètes et sont désactivées lorsque le navigateur
signale une préférence pour la réduction des mouvements.

### 5. Clarifier le code

La mise en forme a été harmonisée pour rendre les blocs, les propriétés et les
attributs plus faciles à repérer. Les commentaires servent à expliquer les
sections et les valeurs à personnaliser. Cette étape visait à améliorer la
lecture sans modifier le fonctionnement attendu du site.

### 6. Contrôler les changements

Après une modification, vérifier que :

- les chemins vers le CSS et le JavaScript pointent vers les bons fichiers ;
- les identifiants attendus par le JavaScript sont toujours présents dans le
HTML ;
- les règles CSS et le JavaScript n'ont pas d'erreur de syntaxe ;
- le menu, les liens, les images et le formulaire fonctionnent sur ordinateur
  et sur téléphone.

Les contrôles réalisés lors de la mise en forme ont confirmé la présence des
identifiants HTML utilisés par le JavaScript et l'équilibre des accolades CSS
et JavaScript.

## Prochaines étapes de personnalisation

1. Remplacer les textes provisoires par les informations exactes de l'hôtel.
2. Ajouter les vraies photos dans `images/` et mettre à jour les
   attributs `src` correspondants.
3. Créer le formulaire Formspree, remplacer son identifiant dans `index.html`,
   régler l'adresse de réception dans son tableau de bord et retirer `disabled`
   du bouton d'envoi après un test concluant.
4. Ajouter la ville au titre/contenu, l'adresse, le téléphone, les réseaux,
   les liens de partage et l'URL de l'image Open Graph.
5. Ajouter des mentions légales et une politique de confidentialité adaptées
   avant de collecter des noms, emails et demandes de séjour.
6. Tester les liens, le formulaire, le menu mobile et les images dans un
   navigateur.
7. Choisir un hébergement HTTPS et publier le site.
8. Reporter les étapes terminées dans le tableau « État d'avancement » et
   noter ci-dessous les changements importants.

## Journal des mises à jour

| Date | Étape | Mise à jour |
|---|---|---|
| 2026-11-11 | Lisibilité du code | Mise en forme et commentaires du HTML, du CSS et du JavaScript clarifiés ; copies synchronisées et contrôles structurels effectués. |
| 2026-11-11 | Animations et accessibilité | Apparitions au défilement, mouvements légers au survol, prise en compte de la réduction des animations et commentaires explicatifs ajoutés. |
| 2026-11-11 | Chambres et mode hors ligne | Ajout d'une section de préparation du séjour, retrait des polices distantes et utilisation de polices système. |
