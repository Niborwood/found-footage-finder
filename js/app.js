/* global theMovieDb */
// ************** CORE CODE *******************

// ----:::: APP/GAME ::::----
const app = {
    // ------ ELEMENTS HTML
    html: {
        main: document.querySelector('main'),
        mainHeader: document.querySelector('main h2'),
        mainSection: document.querySelector('main section'),
        mainButton: document.querySelector('main button'),
        playVhsString: document.querySelector('.play-vhs'),
        appHeader: document.querySelector('h1'),
        appTitle: document.querySelector('#app-title'),
    },

    // ------ COMMON
    // --- INITIALISATION
    init: () => {
        const launchButton = document.querySelector('button#launch-game');

        // Display Splash
        app.displaySplash();

        // Play The Game
        launchButton.addEventListener('click', app.reset);
    },
    // --- SPLASH
    displaySplash: () => {
        // Création du HTML
        const container = document.querySelector('#container');
        container.style.visibility = 'hidden';

        const splashDiv = document.createElement('div');
        splashDiv.id = 'splash';
        document.body.prepend(splashDiv);

        const findMeDiv = document.createElement('div');
        findMeDiv.id = 'find-me';
        const findText = document.createElement('span');
        findText.id = 'find';
        findText.innerText = 'Find ';
        const meText = document.createElement('span');
        meText.id = 'me';
        meText.innerText = 'me';
        findMeDiv.appendChild(findText);
        findMeDiv.appendChild(meText);
        splashDiv.appendChild(findMeDiv);

        const skipAnimationsP = document.createElement('p');
        skipAnimationsP.classList.add('skip-animations');
        skipAnimationsP.innerText = '[ ] Skip Animations';
        splashDiv.appendChild(skipAnimationsP);

        // Event Listener :: Skip Animations
        const skipAnimations = (event) => {
            if (app.data.animations) {
                event.target.innerText = '[x] Skip Animations';
                app.data.animations = false;
                findMeDiv.removeAttribute('id');
                meText.removeAttribute('id');
                findText.removeAttribute('id');
            } else {
                event.target.innerText = '[ ] Skip Animations';
                app.data.animations = true;
                findMeDiv.setAttribute('id', 'find-me');
                findText.setAttribute('id', 'find');
                meText.setAttribute('id', 'me');
            }
        };
        skipAnimationsP.addEventListener('click', skipAnimations);

        // Event Listener :: Init app
        const findMeTrigger = () => {
            // Remove Animations
            findMeDiv.removeEventListener('click', findMeTrigger);
            skipAnimationsP.removeEventListener ('click', skipAnimations);

            // Animations Trigger
            const triggerAnimations = () => {
                const launchButton = document.querySelector('button#launch-game');
                const typingH2 = document.querySelector('main h2 div');
                typingH2.classList.add('typing-effect');
                const typingLastH2 = document.querySelector('main h2 div:nth-child(2)');
                typingLastH2.classList.add('typing-effect', 'typing-last');
                app.html.mainSection.classList.add('delayed-display-fade');
                launchButton.classList.add('delayed-display-fade');
                app.html.appHeader.classList.add('delayed-display-fade', 'glitch', 'gl-5');
                app.html.playVhsString.classList.add('animate-flicker');
                app.glitch();
            };

            // Si animations
            if (app.data.animations) {
                skipAnimationsP.classList.add('fade-out');

                setTimeout(() => {
                    findMeDiv.style.visibility = 'hidden';
                }, 1800);

                setTimeout(() => {
                    findMeDiv.style.visibility = 'visible';
                    findText.innerText = 'FOUND ';
                }, 2000);

                setTimeout(() => {
                    findText.innerText = 'FOUND';
                    meText.innerText = 'YOU';
                }, 5000);

                setTimeout(() => {
                    findMeDiv.removeAttribute('id');
                    findMeDiv.id = 'find-me-noanim';
                    meText.removeAttribute('id');
                    findText.removeAttribute('id');
                }, 5800);

                setTimeout(() => {
                    container.style.visibility = 'visible';
                    splashDiv.remove();
                    triggerAnimations();
                }, 6000);
            }
            // Si pas d'animations
            else {
                container.style.visibility = 'visible';
                splashDiv.remove();
            }
        };
        findMeDiv.addEventListener('click', findMeTrigger);
    },
    displayAnimations: (element) => {
        if (app.data.animations) {
            element.classList.add('display-fade');
        }
    },
    // --- GLITCH EFFECT
    glitch: () => {
        // Animation check
        if (!app.data.animations) {
            return;
        }

        const container = document.querySelector('div#container');
        const flexWrapper = document.querySelector('div#flex-wrapper');
        const backgrounds = ['url(\'img/noise4.jpg\')', 'url(\'img/noise2.png\')'];
        container.style.backgroundImage = backgrounds[Math.floor(Math.random()*2)];
        container.style.backgroundSize = 'initial';
        flexWrapper.style.opacity = 0;
        container.style.animation = `animatedBackground ${Math.random() / 2}s ease-in infinite`;

        setTimeout(() => {
            flexWrapper.style.opacity = 1;
            container.style.backgroundImage = 'url(../img/noise.gif)';
            container.style.animation = '0';
            container.style.backgroundSize = 'cover';
        }, Math.random() * 210);
    },
    // --- INITIALISATION DU JEU, POUR LA PREMIERE OU POUR UN REPLAY
    reset: () => {
        // Init HTML elements
        app.html.playVhsString.innerText = '▶ PLAY';
        app.html.playVhsString.classList.remove('animate-flicker');
        app.html.appTitle.remove();
        app.html.mainSection.innerText = '';
        app.html.mainSection.classList.remove('section-result', 'delayed-display-fade');
        app.html.mainButton.remove();

        if (app.data.quizStep !== 0) {
            app.html.main.prepend(app.html.mainHeader);
        }

        // Init app data
        fetch('data/movies.json')
            .then(response => {
                return response.json();
            })
            .then(data => {
                app.data.movies = Object.entries(data);
            });
        app.data.answers = [];
        app.data.quizStep = 0;
        app.data.reloads = 0;
        app.data.quizSkips = 0;

        // Begin
        app.askQuestion();
    },

    // ------ DATA
    data: {
        // Data des réponses
        quizStep: 0,
        quizSkips: 0,
        answers: [],
        reloads: 0,
        animations: true,

        // Data des questions
        question: [
            // Question 1 - theme
            [
                'Niveau horreur, vos kinks, c\'est plutôt...',
                ['Les thrillers', 'thriller'],
                ['Le paranormal', 'paranormal'],
                ['La science-fiction', 'sf'],
                ['Les monstres', 'monsters']
            ],
            // Question 2 - format
            [
                'Quels types de films souhaitez-vous voir ?',
                ['Un found footage classique', 'ff'],
                ['Un faux-documentaire', 'mockumentary'],
                ['Un film à sketchs', 'sketch'],
                ['Une série', 'series'],
                ['Un film-écran', 'screen'],
            ],
            // Question 3 - origin
            [
                'Il doit venir d\'où, ce film ?',
                ['de France', 'france'],
                ['d\'Europe', 'europe'],
                ['des USA / Canada', 'usa'],
                ['d\'Asie', 'asia'],
                ['d\'ailleurs encore', 'other']
            ],
            // Question 4 - date
            [
                'On part piocher à quelles époques ?',
                ['les 70/80s', '70-80s'],
                ['les 90s', '90s'],
                ['les années 2000', '00s'],
                ['de 2010 à aujourd\'hui', '10s']
            ],
            // Question 5 - Difficulty
            [
                'Chaud pour un film de niche, ou on y va doucement ?',
                ['Je veux un film que je n\'ai problablement pas vu', 'rare'],
                ['Un film un peu connu, c\'est ok', 'common']
            ],
            
        ],

        // Data des films (target of movies.json)
        movies: []
    },

    // ------ QUIZ ROUTINE
    // ---- ROUTINE D'AFFICHAGE DE CHAQUE QUESTION/REPONSES
    askQuestion: () => {
        app.glitch();

        // Génération de l'affichage des questions / réponses (avec flag values)
        
        const currentQuestion = app.data.question[app.data.quizStep];
        app.html.mainHeader.innerText = currentQuestion[0];
        const currentAnswers = currentQuestion.slice(1);
        const multiInfoP = document.createElement('p');
        multiInfoP.classList.add('multi-info');
        multiInfoP.innerText = 'Vous pouvez sélectionner plusieurs réponses.';
        app.html.mainHeader.parentNode.insertBefore(multiInfoP, app.html.mainHeader.nextSibling);
        console.log('Les réponses après la question', app.data.quizStep+1, ' : ', app.data.answers);

        
        // Si ce n'est pas la 1ère question
        if (app.data.quizStep !== 0) {
            // On récupère les films restants par rapport à la réponse précédente
            
            const moviesLeft = [];
            const currentFlags = app.data.answers[app.data.quizStep-1];

            for (const movie of app.data.movies) {
                for (const flag of currentFlags) { 
                    if( movie[1].flags.indexOf(flag) !== -1 ) {
                        moviesLeft.push(movie);
                    }
                }       
            }

            app.data.movies = moviesLeft;

            console.table('*********Les datas des films qu\'il me reste :', app.data.movies);

            // ON RECUPERE LA LISTE DES REPONSES PERTINENTES POUR L'UTILISATEUR
            const relevantAnswers = [];
            for (const answer of currentAnswers) {
                let uselessCounter = 0;
                for (const movie of moviesLeft) {
                    if (movie[1].flags.indexOf(answer[1]) === -1) {
                        uselessCounter++;
                    }
                }
                if (moviesLeft.length !== uselessCounter) {
                    relevantAnswers.push(answer);
                }
            }

            // S'il n'y a qu'une seule réponse, pas la peine de la poser
            if (relevantAnswers.length === 1) {
                app.nextQuestion('skip', relevantAnswers);
            } 
            // S'il y a plusieurs réponses, on affiche la question à l'utilisateur
            else {
                app.displayAnswers(relevantAnswers);
            }
        } 
        // Si c'est la 1ere question uniquement (pas de réponse précédente)
        else {
            app.displayAnswers(currentAnswers);
        }
    },
    displayAnswers: (answers) => {

        // Routine d'affichage des boutons & values
        const answerButton = document.createElement('button');
        answerButton.classList.add('answer-button');
        const answersWrapper = document.createElement('div');
        answersWrapper.setAttribute('id', 'answer-wrapper');
        app.html.mainSection.appendChild(answersWrapper);

        answers.forEach(answer => {
            answerButton.innerText = answer[0];
            answerButton.value = answer[1];
            answersWrapper.appendChild(answerButton.cloneNode(true));
        });
        // Gestion de la réponse utilisateur et génération du bouton suivant

        const nextStepStr = document.createElement('p');
        nextStepStr.classList.add('next-question');
        const skipQuestionString = 'Passer cette question (tout me va) <span class="forward">▶</span>';
        const nextQuestionString = 'Question suivante <span class="forward">▶▶</span>';
        nextStepStr.innerHTML = skipQuestionString;
        app.html.mainSection.appendChild(nextStepStr);

        const buttons = [...document.getElementsByClassName('answer-button')];
        for (const button of buttons) {
            button.addEventListener('click', function (event) {
                event.target.classList.toggle('button-clicked');
                const buttonsClicked = document.getElementsByClassName('button-clicked');
                if (nextStepStr.innerHTML === skipQuestionString && buttonsClicked.length !== 0) {
                    nextStepStr.classList.add('animate-flicker', 'flicker__fast');
                    nextStepStr.innerHTML = nextQuestionString;
                }
                else if (nextStepStr.innerHTML === nextQuestionString && buttonsClicked.length === 0) {
                    nextStepStr.innerHTML = skipQuestionString;
                    nextStepStr.classList.remove('animate-flicker', 'flicker__fast');
                }
            }); // Fin de l'EL au clic sur les boutons
        }

        // Display animation
        if (app.data.animations) {
            app.html.mainSection.style.visibility = 'hidden';
            // setTimeout(() => {
            app.html.mainSection.classList.add('display-fade');
            // }, 100);
        }

        // On enregistre le flag/réponse, on efface tout et on relance la prochaine question
        nextStepStr.addEventListener('click', app.nextQuestion);
    },
    
    // ---- ROUTINE DE STOCKAGE DE REPONSE / GENERATION DE NOUVELLE QUESTION / APPEL DE RESULTATS
    nextQuestion: (state, relevantAnswers) => {
        // On retire l'info de multi-réponses pour éviter son clonage
        document.querySelector('.multi-info').remove();

        // On enregistre la (les) réponse(s) dans le tableau des flags/réponses
        const userAnswers = [...document.getElementsByClassName('button-clicked')];
        const multiAnswers = (answers) => {
            let arrayValues = [];
            for (const answer of answers) {
                arrayValues.push(answer.value);
            }
            app.data.answers.push(arrayValues);
        };

        // Si la question est sautée par algorithme
        if (state === 'skip') {
            let arrayValues = [];
            for (const answer of relevantAnswers) {
                console.log('La question', app.data.quizStep+1, 'a été passée.');
                arrayValues.push(answer[1]);
            }
            app.data.answers.push(arrayValues);
        } else {
            // Si la question est sautée par l'utilisateur (toutes les réponses)
            if (userAnswers.length === 0) {
                const allAnswers = [...document.getElementsByClassName('answer-button')];
                multiAnswers(allAnswers);
                app.data.quizSkips++;
            }
            // Si la question comporte une ou plusieurs (mais pas toutes) réponses par l'utilisateur
            else {
                multiAnswers(userAnswers);
            }
            
        }

        // Est-ce qu'on a fait le tour des questions à poser ?
        if ( app.data.quizStep < (app.data.question.length -1) ) {
            app.html.mainSection.innerText = '';
            app.html.mainSection.classList.remove('display-fade');
            app.data.quizStep++;

            app.askQuestion();
        } else {
            const moviesLeft = [];
            const currentFlags = app.data.answers[app.data.quizStep];

            for (const movie of app.data.movies) {
                for (const flag of currentFlags) { 
                    if( movie[1].flags.indexOf(flag) !== -1 ) {
                        moviesLeft.push(movie);
                    }
                }       
            }
            app.data.movies = moviesLeft;
            console.log(moviesLeft);

            app.displayEndQuiz();
        }
    },
    // ---- ECRAN TEMPORAIRE DE FIN DE QUIZ
    displayEndQuiz: () => {
        app.glitch();
        app.html.appHeader.appendChild(app.html.appTitle);

        app.html.mainHeader.innerText = 'Votre found footage est prêt.';
        app.html.mainSection.innerText = '';

        // Si toutes les questions ont été passées, petit message personnalisé
        if (app.data.quizSkips === app.data.question.length) {
            const showEverythingP = document.createElement('p');
            showEverythingP.classList.add('show-everything');
            app.displayAnimations(showEverythingP);
            showEverythingP.innerText = '(Après, vous n\'avez mis aucun filtre, donc bon.)';
            app.html.mainSection.appendChild(showEverythingP);
        }

        // Affichage du bouton
        if (app.data.animations) {
            app.html.mainSection.style.visibility = 'hidden';
            app.html.mainSection.classList.add('display-fade');
        }

        const displayButton = document.createElement('button');
        displayButton.classList.add('discover-button');
        displayButton.innerHTML = '&#9679; Découvrez-le. &#9679;';
        app.html.mainSection.appendChild(displayButton);
        app.html.playVhsString.innerText = 'STOP';
        app.html.playVhsString.classList.add('animate-flicker');
        app.displayAnimations(app.html.playVhsString);

        // EL :: click pour afficher le résultat (DECOUVREZ LE)
        displayButton.addEventListener('click', app.displayResults);
    },

    // ------- QUIZ ENDING
    // ---- AFFICHAGE DU RESULTAT
    displayResults: () => {
        app.glitch();
        app.html.mainSection.classList.add('section-result');

        // Gestion des éléments HTML
        app.html.mainSection.innerText = '';
        const dividerP = document.createElement('p');
        dividerP.classList.add('divider');
        const movieHolder = document.createElement('div');
        movieHolder.id = 'movie-holder';
        const tmdbHolder = document.createElement('div');
        movieHolder.appendChild(tmdbHolder);
        app.displayAnimations(movieHolder);

        app.html.mainSection.appendChild(movieHolder);

        // Lien matchingResult unique > TMDB
        const tmdbCrawler = (id) => {
            for (const movie of app.data.movies) {
                if (movie[1].id === id) {
                    return { id: movie[1].tmdb_id, flags: movie[1].flags };
                }
            }
        };
        const tmdbData = tmdbCrawler(app.data.movies[0][1].id);

        // TMDB display
        tmdbData.flags[0] === 'series' ? app.displayTmdbData(tmdbData, tmdbHolder, dividerP, 'tv') : app.displayTmdbData(tmdbData, tmdbHolder, dividerP, 'movies');

        // More (reload data/quiz) display
        app.displayMore(movieHolder);
    },

    // ---- AFFICHAGE DES INFOS TMDB
    displayTmdbData: (tmdbData, tmdbHolder, dividerP, format) => {

        const getTmdbGeneral = () => {
            return new Promise((success, failure) => {

                theMovieDb[format].getById({ 'id': tmdbData.id }, (rawData) => {
                    app.html.mainHeader.remove();
                    let data = JSON.parse(rawData);

                    // Image
                    const poster = document.createElement('img');
                    poster.src = `https://www.themoviedb.org/t/p/w300${data.poster_path}`;
                    const asidePoster = document.createElement('aside');
                    asidePoster.appendChild(poster);
                    app.html.mainSection.prepend(asidePoster);

                    // Tags
                    const flagsHolder = document.createElement('div');
                    flagsHolder.classList.add('flags');
                    flagsHolder.innerText = tmdbData.flags.flat().join(', ');
                    asidePoster.appendChild(flagsHolder);

                    // Titre, date
                    const titleData = document.createElement('h2');
                    if (format === 'movies') {
                        // Check film asiatique (affichage du nom latin)
                        if (tmdbData.flags.origin === 'asia') {
                            titleData.innerText = data.title;
                        } else {
                            titleData.innerText = data.original_title;
                        }
                        titleData.innerHTML += `&nbsp;-&nbsp;${data.release_date.substring(0, 4)}`;
                    } else if (format === 'tv') {
                        titleData.innerText = data.original_name;
                        titleData.innerHTML += `&nbsp;-&nbsp;${data.first_air_date.substring(0, 4)}`;
                    }
                    tmdbHolder.appendChild(titleData);

                    // Saisons, épisodes (format:tv)
                    if (format === 'tv') {
                        const nbSeasonsP = document.createElement('p');
                        nbSeasonsP.classList.add('data-subinfo');
                        let seasonPlural = 'saison';
                        if (data.number_of_seasons > 1) {
                            seasonPlural += 's';
                        }
                        nbSeasonsP.innerText = `${data.number_of_seasons} ${seasonPlural}, ${data.number_of_episodes} épisodes`;
                        tmdbHolder.appendChild(nbSeasonsP);
                    }

                    // Saga (format:movie)
                    if (format === 'movies' && data.belongs_to_collection !== null) {
                        const sagaP = document.createElement('p');
                        sagaP.classList.add('data-subinfo');
                        sagaP.innerText = `Collection : ${data.belongs_to_collection.name}`;
                        tmdbHolder.appendChild(sagaP);
                    }

                    // Résumé
                    const overviewP = document.createElement('p');
                    overviewP.innerText = data.overview;
                    tmdbHolder.appendChild(overviewP);
                    // Divider
                    tmdbHolder.appendChild(dividerP);
                    success();
                },
                failure); // Fin d'appel TMDB.getById
            });
        };

        const getTmdbProviders = () => {
            // Données providers (SVOD + Location)
            theMovieDb[format].getProviders({ 'id': [tmdbData.id] }, (rawData) => {
                const data = JSON.parse(rawData);

                // Si aucune option légale
                if (data.results.FR === undefined) {
                    const targetH3 = document.createElement('h3');
                    targetH3.innerHTML = 'Indisponible en SVOD & VOD';
                    tmdbHolder.appendChild(targetH3);
                }
                // Routine d'affichage des providers
                else {
                    const displayProviders = (providers) => {
                        const providersHolder = document.createElement('div');
                        if (format === 'movies') {
                            providersHolder.id = 'providers';
                        }
                        tmdbHolder.appendChild(providersHolder);

                        providers.forEach(provider => {
                            let targetHolder = document.createElement('div');
                            providersHolder.appendChild(targetHolder);

                            const targetH3 = document.createElement('h3');
                            if (provider === 'flatrate') {
                                targetH3.innerText = 'SVOD & Abonnement';
                            } else if (provider === 'rent' && format === 'movies') {
                                targetH3.innerText = 'VOD & Location SD-HD';
                            }
                            targetHolder.appendChild(targetH3);
                            const svodListing = document.createElement('p');
                            svodListing.classList.add('provider-infos');
                            if (data.results.FR[provider] !== undefined) {
                                if (data.results.FR[provider].length === 1) {
                                    svodListing.innerText = data.results.FR[provider][0].provider_name;
                                } else {
                                    data.results.FR[provider].forEach((element, index) => {
                                        svodListing.innerText += `${element.provider_name}`;
                                        if (data.results.FR[provider].length - 1 !== index) {
                                            svodListing.innerText += ', ';
                                        }
                                    });
                                }

                            } else {
                                if (format === 'movies') {
                                    svodListing.innerText = 'Non disponible';
                                }

                            }
                            targetHolder.appendChild(svodListing);
                        });
                    };
                    const providers = ['flatrate', 'rent'];
                    displayProviders(providers);
                } // Divider
                tmdbHolder.appendChild(dividerP.cloneNode(true));
            }, app.tmdbError); // Fin d'appel TMDB.providers
        };
        
        getTmdbGeneral().then(getTmdbProviders, app.tmdbError);

    },
    // ---- AFFICHAGE DU RESULTAT
    displayMore: (moreHolder) => {
        // Affichage de l'intertitre
        const moreResultsH3 = document.createElement('h3');
        moreResultsH3.innerText = 'Autres résultats';
        moreHolder.appendChild(moreResultsH3);

        // Film déjà vu ou propositions d'autres résultats si possible
        const moreResultsP = document.createElement('p');
        const moreResultsA = document.createElement('a');
        moreResultsA.classList.add('reload-data');
        const reloadResultsA = document.createElement('a');
        reloadResultsA.innerHTML = '<br><br><span class="forward">▶▶</span> Relancer un test';

        // Affichage d'un texte personnalisé pour le dernier des autres résultats (ou le seul)
        if (app.data.movies.length === 1) {
            if (app.data.reloads === 0) {
                moreResultsP.innerHTML = 'Un seul résultat a correspondu à votre requête.<br><br>';
            } else {
                moreResultsP.innerHTML = 'Dernier résultat selon vos critères. <br><br>';
            }

        }
        // Si 2+ autres résultats
        else {
            let resultPlural = 'autres résultats correspondent';
            if (app.data.movies.length === 2) {
                resultPlural = 'autre résultat correspond';
            }
            moreResultsP.innerHTML = `Déjà vu ?<br> ${app.data.movies.length - 1} ${resultPlural} à vos réponses. <br><br>`;
            moreResultsA.innerHTML = '<span class="forward">▶</span> Me proposer un autre résultat parmi les mêmes critères';
        }

        // Affichage et traitement du résultat (via .reload-data)
        moreHolder.appendChild(moreResultsP);
        moreResultsP.appendChild(moreResultsA);
        moreResultsP.appendChild(reloadResultsA);

        // EL :: click (voir un autre film des mêmes critères)
        moreResultsA.addEventListener('click', (event) => {
            event.preventDefault();
            app.data.movies.shift();
            app.data.reloads++;
            app.displayResults();
        });

        // EL :: click (relancer un quiz)
        reloadResultsA.addEventListener('click', (event) => {
            event.preventDefault();
            app.reset();
        });
    },
    // ---- CALLBACK ERROR TMDB
    tmdbError: () => {
        app.html.mainHeader.innerText = 'Erreur API TMDB';
    },

};

// ------> LAUNCH
document.addEventListener('DOMContentLoaded', app.init);


// ************** SANDBOX *******************

/*

GO BETA !

- afficher les tags des films sous le poster
- créer une dernière étape de questionnement spécifique
- pouvoir skip les membres d'une même saga


v2
- FR & EN
- ouvrir à tous les films d'horreur
- pouvoir ajouter à la bdd des films en front (sous contrôle)

*/




