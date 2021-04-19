# Found Footage Finder

10 questions. Votre found footage dispo.

> **[DEMO](https://niborwood.github.io/found-footage-finder/)**

 Créé par [@RobinSouriau](https://twitter.com/RobinSouriau).  
 License GNU General Public License v3.0.

## Table des matières

1. [**Synopsis**](#1-synopsis)
2. [**Choix des technologies**](#2-choix-des-technologies)
3. [**Liste des fonctionnalités**](#3-liste-des-fonctionnalités)
4. [**Détail des fonctionnalités**](#4-détail-des-fonctionnalités)
5. [**Spécificités**](#5-spécificités)
6. [**Remerciements**](#6-ressources)

---

## 1. Synopsis

L'idée est de poser 10 questions au user pour qu'il puisse choisir son found footage à voir, parmi une liste de 100+ found footages.  

Nous appellerons désormais cette application :

- **[ &#8227; ] FOUND FOOTAGE FINDR.**
- L'URL finale sera : [https://www.found-fountage-finder.io](https://www.found-footage-finder.io).
- Le nom **FOUND FOOTAGE FINDER** peut être également raccourci en tant que : ( **[&#8227;FFF]** ).

## 2. Choix des technologies

L'application est créée via **HTML**, **CSS** et **JavaScript**, sans base de données.

## 3. Liste des fonctionnalités

### 3.1 Légende

- **[O]** : Obligatoire
- [I] : Important
- *[S]* : Secondaire

### 3.2 Fonctionnalités

1. **[O]** Poser des questions au user pour trouver un found footage qui correspond à ses envies
2. [O] Afficher le found footage suivant un modèle front
3. [I] Afficher les métadonnées du film grâce à une base de données externes

## 4. Détail des fonctionnalités

### 4.1 **[O]** Poser des questions au user pour trouver un found footage qui correspond à ses envies

L'application a pour but de poser 10 questions d'ordre général puis de plus en plus précises sur les goûts du user pour l'aiguiller vers une réponse unique.

Le questionnaire n'est pas fixe : suivant les réponses aux questions, les questions sont gérées dynamiquement. Cela se traduit par le fait que le user puisse utiliser un grand nombre de fois l'application sans tomber une seule fois sur le même questionnaire.

#### *Facultatif* : choix de la précision

Le user peut choisir la préciosité de son temps pour ajuster le nombre de questions posées. Typiquement :

- **Je suis pressé** : 7 questions ;
- **Je veux la version normale** : 10 questions ;
- **J'ai tout mon temps** : 15 questions ;
- **Trouve moi un film que je n'ai pas vu, sinon tu me dois 10 balles** : questionnaire porté sur un film inconnu du user

### 4.2 [I] Afficher le found footage suivant un modèle front

Une fois les questions répondues et analysées via l'algorithme de l'application, l'application affiche le film suivant un modèle esthétique agréable.

#### *Facultatif* : plateformes & SVOD

Le user doit pouvoir, en un clic, accéder aux plateformes légales françaises pour voir le film, suivant les API qui nous sont fournies.

### 4.3 [I] Afficher les métadonnées du film grâce à une base de données externes

L'application utilise une API externe pour accéder aux données des films. Cette API est celle de [The Movie Data Base](https://www.themoviedb.org/?language=fr), et plus spécifiquement, son portage JavaScript.

Un grand merci à [themoviedb-javascript-library](https://github.com/cavestri/themoviedb-javascript-library/) !

## 5. Spécificités

L'application a pour but de prendre un ton plutôt léger et n'est pas spécifiquement conçue comme une application "académique". L'ensemble doit être le plus ludique possible.

De même, on veille à ce qu'elle soit à la fois simple et esthétique dans son UI, notamment en passant par des transitions JS et animations CS.

**FFF** est une application mobile-first.

## 6. Ressources

- Police : [VCR OSD Mono](https://www.dafont.com/vcr-osd-mono.font)
