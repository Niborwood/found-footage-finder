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
        skipAnimationsP.addEventListener('click', (event) => {
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
            console.log(app.data.animations);
        });

        // Event Listener :: Init app
        findMeDiv.addEventListener('click', () => {
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
        });

        app.data.animations = true;
    },
    // --- GLITCH EFFECT
    glitch: () => {
        // Animation check
        if (!app.data.animations) {
            return;
        }

        const container = document.querySelector('div#container');
        const flexWrapper = document.querySelector('div#flex-wrapper');
        let bgIOriginal = container.style.backgroundImage;
        container.style.backgroundImage = 'url(\'img/noise2.png\')';
        container.style.backgroundSize = 'initial';
        flexWrapper.style.opacity = 0;
        container.style.animation = `animatedBackground ${Math.random()/2}s ease-in infinite`;

        setTimeout(() => {
            flexWrapper.style.opacity = 1;
            container.style.backgroundImage = bgIOriginal;
            container.style.animation = '0';
            container.style.backgroundSize = 'cover';
        }, Math.random()*210);
    },
    // --- INITIALISATION DU JEU, POUR LA PREMIERE OU POUR UN REPLAY
    reset: () => {
        // Init HTML elements
        app.html.playVhsString.innerText = '▶ PLAY';
        app.html.playVhsString.classList.remove('animate-flicker');
        app.html.appTitle.remove();
        app.html.mainSection.innerText = '';
        app.html.mainSection.classList.remove('section-result');
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
                app.data.movies = data;
            });
        app.data.answers = [];
        app.data.matchingResults = [];
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
        matchingResults: [],
        reloads:0,
        animations:true,

        // Data des questions
        question: [
            // Question 1 - format
            [
                'Quels types de films souhaitez-vous voir ?',
                ['Un found footage classique', 'ff'],
                ['Un faux-documentaire', 'mockumentary'],
                ['Un film à sketchs', 'sketch'],
                ['Une série épisodique', 'series'],
                ['Un film-écran', 'screen'],
            ],
            // Question 2 - Difficulty
            [
                'Chaud pour un film de niche, ou on y va doucement ?',
                ['Je veux un film que je n\'ai problablement pas vu', 'rare'],
                ['Un film un peu connu, c\'est ok', 'common']
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
            // Question 5 - theme
            [
                'Niveau horreur, vos kinks, c\'est plutôt...',
                ['Les thrillers', 'thriller'],
                ['Le paranormal', 'paranormal'],
                ['La science-fiction', 'sf'],
                ['Les monstres', 'monsters']
            ]
        ],

        // Data des films (target of movies.json)
        movies: []
    },

    // ------ QUIZ ROUTINE
    // ---- ROUTINE D'AFFICHAGE DE CHAQUE QUESTION/REPONSES
    askQuestion: () => {
        app.glitch();

        // Elements HTML générés
        const answerButton = document.createElement('button');
        answerButton.classList.add('answer-button');
        const answersWrapper = document.createElement('div');
        answersWrapper.setAttribute('id', 'answer-wrapper');
        app.html.mainSection.appendChild(answersWrapper);
        const nextStepStr = document.createElement('p');
        nextStepStr.classList.add('next-question');
        const skipQuestionString = 'Passer cette question (tout me va) <span class="forward">▶</span>';
        const nextQuestionString = 'Question suivante <span class="forward">▶▶</span>';
        nextStepStr.innerHTML = skipQuestionString;
        app.html.mainSection.appendChild(nextStepStr);
        

        // Génération de l'affichage des questions / réponses (avec flag values)
        const currentQuestion = app.data.question[app.data.quizStep];
        app.html.mainHeader.innerText = currentQuestion[0];
       
        const currentAnswers = currentQuestion.slice(1);
        currentAnswers.forEach(answer => {
            answerButton.innerText = answer[0];
            answerButton.value = answer[1];
            answersWrapper.appendChild(answerButton.cloneNode(true));
        });

        // Gestion de la réponse utilisateur et génération du bouton suivant
        const answerButtons = [...document.getElementsByClassName('answer-button')];
        
        answerButtons.forEach(button => {
            button.addEventListener('click', function (event) {
                event.target.classList.toggle('button-clicked');
                
                const buttonsClicked = document.getElementsByClassName('button-clicked');
                if ( nextStepStr.innerHTML === skipQuestionString && buttonsClicked.length !== 0 ) {
                    nextStepStr.classList.add('animate-flicker', 'flicker__fast');
                    nextStepStr.innerHTML = nextQuestionString;
                } 
                else if (nextStepStr.innerHTML === nextQuestionString && buttonsClicked.length === 0 ) {
                    nextStepStr.innerHTML = skipQuestionString;
                    nextStepStr.classList.remove('animate-flicker', 'flicker__fast');
                }        
            }); // Fin de l'EL au clic sur les boutons
        }); // Fin de la boucle de boutons réponses

        // Display animation
        // if (app.data.animations) {
        // app.html.mainSection.style.visibility = 'hidden';
        setTimeout(() => {
            // app.html.mainSection.style.visibility = 'visible';
            app.html.mainSection.classList.add('display-fade');
        }, 1);
        // }
        
        // On enregistre le flag/réponse, on efface tout et on relance la prochaine question
        nextStepStr.addEventListener('click', app.nextQuestion);
    },
    // ---- ROUTINE DE STOCKAGE DE REPONSE / GENERATION DE NOUVELLE QUESTION / APPEL DE RESULTATS
    nextQuestion: () => {
        // On enregistre la (les) réponse(s) dans le tableau des flags/réponses
        const userAnswers = [...document.getElementsByClassName('button-clicked')];
        const multiAnswers = (answers) => {
            let arrayValues = []; 
            for (const answer of answers) {
                arrayValues.push(answer.value);
            }
            app.data.answers.push(arrayValues);
        };

        if (userAnswers.length === 0) {
            const allAnswers = [...document.getElementsByClassName('answer-button')];
            multiAnswers(allAnswers);
            app.data.quizSkips++;
        }
        else {
            multiAnswers(userAnswers);
        }
       
        // Est-ce qu'on a fait le tour des questions à poser ?
        if (app.data.quizStep < app.data.question.length-1) {
            app.html.mainSection.classList.remove('display-fade');
            app.html.mainSection.innerText = '';
            app.data.quizStep++;
            app.askQuestion();
        } else {
            app.displayEndQuiz();
        }
    },
    // ---- ECRAN TEMPORAIRE DE FIN DE QUIZ
    displayEndQuiz: () => {
        app.glitch();
        app.html.appHeader.appendChild(app.html.appTitle);

        // Matching Engine between user answers and movie flags
        app.matchEngine();

        // S'il n'y a aucun match
        if (app.data.matchingResults.length === 0) {
            app.html.mainHeader.innerText = 'Aucun résultat suivant les critères donnés :('; 
            app.html.mainSection.innerText = '';
            app.displayMore(app.html.mainSection);
        } else {
            app.html.mainHeader.innerText = 'Votre found footage est prêt.';
            app.html.mainSection.innerText = '';
    
            // Si toutes les questions ont été passées, petit message personnalisé
            if (app.data.quizSkips === app.data.question.length) {
                const showEverythingP = document.createElement('p');
                showEverythingP.classList.add('show-everything');
                showEverythingP.innerText = '(Après, vous n\'avez mis aucun filtre, donc bon.)';
                app.html.mainSection.appendChild(showEverythingP);
            }
            
            const displayButton = document.createElement('button');
            displayButton.innerHTML = '&#9679; Découvrez-le. &#9679;';
            displayButton.classList.add('discover-button');
            app.html.mainSection.appendChild(displayButton);
            app.html.playVhsString.innerText = 'STOP';
            app.html.playVhsString.classList.add('animate-flicker');
    
            displayButton.addEventListener('click', app.displayResults);
        }

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
        app.html.mainSection.appendChild(movieHolder);

        // Lien matchingResult unique > TMDB
        const tmdbCrawler = (id) => {
            for (const movie of app.data.movies) {
                if (movie.id === id) {
                    return { id: movie.tmdb_id, flags: movie.flags };
                }
            }
        }; 
        const tmdbData = tmdbCrawler(app.data.matchingResults[0]);
        
        // TMDB display
        if (tmdbData.flags[0] === 'series') {
            app.displayTmdbData(tmdbData, tmdbHolder, dividerP, 'tv');
        } else {
            app.displayTmdbData(tmdbData, tmdbHolder, dividerP, 'movies');
        }

        // More (reload data/quiz) display
        app.displayMore(movieHolder);
    },
    // ---- MATCHING ENGINE RESULTS-DB
    matchEngine: () => {
        const movies = Object.values(app.data.movies);
        movies.forEach(movie => {
            // On check la correspondance entre les flags de l'utilisateur et ceux de la bdd            
            let match = true;
            const movieFlags = Object.values(movie.flags);

            app.data.answers.forEach((answer, index) => { 
                switch (answer.indexOf(movieFlags[index])) {
                case -1:
                    match = false; 
                    break;
                default:
                    break;
                }  
            });
            // S'il y a match(s) ET que ce n'est pas un reload de résultat, on renseigne les id de chaque match pour en retrouver plus tard les infos. Sinon, pas de résultat...
            if (match && app.data.reloads === 0) {
                app.data.matchingResults.push(movie.id);
            } 
        }); // Fin de la boucle de check des flags
    },
    // ---- AFFICHAGE DES INFOS TMDB
    displayTmdbData: (tmdbData, tmdbHolder, dividerP, format) => {

        const getTmdbGeneral = () => {
            return new Promise((success, failure) => {

                theMovieDb[format].getById({'id': tmdbData.id}, (rawData) => {  
                    app.html.mainHeader.remove();
                    let data = JSON.parse(rawData);
                    console.log(data);
                    // Image
                    const poster = document.createElement('img');
                    poster.src = `https://www.themoviedb.org/t/p/w300${data.poster_path}`;
                    const asidePoster = document.createElement('aside');
                    asidePoster.appendChild(poster);
                    app.html.mainSection.prepend(asidePoster);
        
                    // Titre, date
                    const titleData = document.createElement('h2');
                    if (format === 'movies') {
                        // Check film asiatique (affichage du nom latin)
                        if (tmdbData.flags.origin === 'asia') {
                            titleData.innerText = data.title;
                        } else {
                            titleData.innerText = data.original_title;
                        }
                        titleData.innerHTML += `&nbsp;-&nbsp;${data.release_date.substring(0,4)}`;
                    } else if (format === 'tv') {
                        titleData.innerText = data.original_name;
                        titleData.innerHTML += `&nbsp;-&nbsp;${data.first_air_date.substring(0,4)}`;
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
            theMovieDb[format].getProviders({'id': [tmdbData.id]}, (rawData) => {
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
                                        if (data.results.FR[provider].length-1 !== index) {
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
        // Film déjà vu ou propositions d'autres résultats si possible
        const moreResultsP = document.createElement('p');
        const moreResultsA = document.createElement('a');
        moreResultsA.classList.add('reload-data');
        // Affichage de l'intertitre seulement s'il y a eu match
        if (app.data.matchingResults.length !== 0) {
            const moreResultsH3 = document.createElement('h3');
            moreResultsH3.innerText = 'Autres résultats';
            moreHolder.appendChild(moreResultsH3);
        }
        
        // Si 0 ou 1 résultat
        if (app.data.matchingResults.length === 0) {
            moreResultsA.classList.add('reload-movie');
            moreResultsA.innerHTML = '<span class="forward">▶▶</span> Relancer un test';
        }
        else if (app.data.matchingResults.length === 1) {
            if (app.data.reloads === 0) {
                moreResultsP.innerHTML = 'Un seul résultat a correspondu à votre requête.<br><br>';
                moreResultsA.classList.add('reload-movie');
                moreResultsA.innerHTML = '<span class="forward">▶▶</span> Relancer un test';
                
            } else {
                moreResultsP.innerHTML = 'Dernier résultat selon vos critères. <br><br>';
                moreResultsA.innerHTML = '<span class="forward">▶▶</span> Relancer un test';
                moreResultsA.classList.add('reload-movie');
            }
            
        } 
        // Si 2+ autres résultats
        else {
            let resultPlural = 'autres résultats correspondent';
            if (app.data.matchingResults.length === 2) {
                resultPlural = 'autre résultat correspond';
            }
            moreResultsP.innerHTML = `Déjà vu ?<br> ${app.data.matchingResults.length-1} ${resultPlural} à vos réponses. <br><br>`;
            moreResultsA.innerHTML = '<span class="forward">▶</span> Me proposer autre chose';
        }

        // Affichage et traitement du résultat (via .reload-data)
        moreHolder.appendChild(moreResultsP);
        moreResultsP.appendChild(moreResultsA);

        // EL click (voir un autre film / reload)
        document.querySelector('a.reload-data').addEventListener('click', (event) => {
            event.preventDefault();

            if (event.target.classList.contains('reload-movie')) {
                app.reset();
            } else {
                app.data.matchingResults.shift();
                app.data.reloads++;
                app.displayResults();
            }
        });
    },
    // ---- CALLBACK ERROR TMDB
    tmdbError: () => {
        app.html.mainHeader.innerText = 'Erreur API TMDB';
    },

};

// ------> LAUNCH
document.addEventListener('DOMContentLoaded', app.init);

//  --- REAL TIME SLP [https://www.plus2net.com/javascript_tutorial/clock.php]
display_ct();
function display_c() {
    let refresh = 1000;
    let mytime = setTimeout('display_ct()', refresh); // eslint-disable-line
}
function display_ct() {
    let date = new Date();
    function zeroDigits(digit) {
        if (digit < 10) {
            return `0${digit}`;
        } else {
            return digit;
        }
    }
    let timeDisplay = zeroDigits(date.getHours()) + ':' + zeroDigits(date.getMinutes()) + ':' + zeroDigits(date.getSeconds());
    document.getElementById('current-time').innerHTML = timeDisplay;
    display_c();
}


// ************** TEST SANDBOX *******************


// ***************** TODO ************************

/* 
- créer les animations par question
- faire la page Credits (https://www.themoviedb.org/about/logos-attribution)


GO BETA !

- pouvoir skip les membres d'une même saga 
- créer une dernière étape de questionnement spécifique
- impossible de ne pas trouver de résultats

v2
- ouvrir à tous les films d'horreur
- pouvoir ajouter à la bdd des films en front (sous contrôle)
- FR & EN
*/




