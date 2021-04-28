/* global theMovieDb */
// ************** CORE CODE *******************

// ----:::: APP/GAME ::::----
const app = {

    // --- GLITCH EFFECT
    glitch: () => {
        let bgIOriginal = app.htmlElement.container.style.backgroundImage;
        app.htmlElement.container.style.backgroundImage = 'url(\'img/noise2.png\')';
        app.htmlElement.container.style.backgroundSize = 'initial';
        app.htmlElement.container.style.animation = `animatedBackground ${Math.random()/2}s ease-in infinite`;

        setTimeout(() => {
            app.htmlElement.container.style.backgroundImage = bgIOriginal;
            app.htmlElement.container.style.animation = '0';
            app.htmlElement.container.style.backgroundSize = 'cover';
        }, Math.random()*110);
    },

    // --- ELEMENTS HTML
    htmlElement: {
        main: document.querySelector('main'),
        mainHeader: document.querySelector('main h2'),
        mainSection: document.querySelector('main section'),
        mainButton: document.querySelector('main button'),
        launchButton: document.querySelector('button#launch-game'),
        playVhsString: document.querySelector('.play-vhs'),
        appHeader: document.querySelector('h1'),
        appTitle: document.querySelector('#app-title'),
        container: document.querySelector('div#container')
    },

    // --- DATA
    data: {
        // Data des réponses
        quizStep: 0,
        quizSkips: 0,
        answers: [],
        matchingResults: [],
        reloads:0,

        // Data des questions
        question: [
            // Question 1 - format
            [
                'Quel type de film souhaitez-vous voir ?',
                ['Un found footage classique', 'ff'],
                ['Un faux-documentaire', 'mockumentary'],
                ['Un film à sketchs', 'sketch'],
                ['Une série épisodique', 'series'],
                ['Un film-écran', 'screen'],
            ],
            // Question 2 - Difficulty
            [
                'Chaud pour un film de niche, ou on y va doucement ?',
                ['Je connais déjà mes classiques, go !', 'rare'],
                ['Sors-moi un truc regardable', 'common']
            ],
            // Question 3 - origin
            [
                'Il doit venir d\'où, ce film ?',
                ['de France', 'france'],
                ['d\'Europe', 'europe'],
                ['des USA / Canada', 'usa'],
                ['d\'Asie', 'asia'],
                ['ou d\'ailleurs encore', 'other']
            ],
            // Question 4 - date
            [
                'On part piocher à quelle époque ?',
                ['les 70/80s', '70-80s'],
                ['les 90s', '90s'],
                ['les années 2000', '00s'],
                ['de 2010 à aujourd\'hui', '10s']
            ],
            // Question 5 - theme
            [
                'Niveau horreur, votre kink, c\'est plutôt...',
                ['Les thrillers', 'thriller'],
                ['Le paranormal', 'paranormal'],
                ['La science-fiction', 'sf'],
                ['Les monstres', 'monsters']
            ]
        ],

        // Data des films (target of movies.json)
        movies: []
    },

    // ---- ROUTINE D'AFFICHAGE DE CHAQUE QUESTION/REPONSES
    askQuestion: () => {
        app.glitch();

        // Elements HTML générés
        const answerButton = document.createElement('button');
        answerButton.setAttribute('class', 'answer-button');
        const answersWrapper = document.createElement('div');
        answersWrapper.setAttribute('id', 'answer-wrapper');
        app.htmlElement.mainSection.appendChild(answersWrapper);
        const nextStepStr = document.createElement('p');
        nextStepStr.classList.add('next-question');
        const skipQuestionString = 'Passer cette question (tout me va) <span class="forward">▶</span>';
        const nextQuestionString = 'Question suivante <span class="forward">▶▶</span>';
        nextStepStr.innerHTML = skipQuestionString;
        app.htmlElement.mainSection.appendChild(nextStepStr);
        

        // Génération de l'affichage des questions / réponses (avec flag values)
        const currentQuestion = app.data.question[app.data.quizStep];
        app.htmlElement.mainHeader.innerText = currentQuestion[0];
        
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
            app.htmlElement.mainSection.innerText = '';
            app.data.quizStep++;
            app.askQuestion();
        } else {
            app.displayEndQuiz();
        }
    },
    // ---- ECRAN TEMPORAIRE DE FIN DE QUIZ
    displayEndQuiz: () => {
        app.glitch();
        app.htmlElement.appHeader.appendChild(app.htmlElement.appTitle);

        // Matching Engine between user answers and movie flags
        app.matchEngine();

        // S'il n'y a aucun match
        if (app.data.matchingResults.length === 0) {
            app.htmlElement.mainHeader.innerText = 'Aucun résultat suivant les critères donnés :('; 
            app.htmlElement.mainSection.innerText = '';
            app.displayMore(app.htmlElement.mainSection);
        } else {
            app.htmlElement.mainHeader.innerText = 'Votre found footage est prêt.';
            app.htmlElement.mainSection.innerText = '';
    
            // Si toutes les questions ont été passées, petit message personnalisé
            if (app.data.quizSkips === app.data.question.length) {
                const showEverythingP = document.createElement('p');
                showEverythingP.classList.add('show-everything');
                showEverythingP.innerText = '(Après, vous n\'avez mis aucun filtre, donc bon.)';
                app.htmlElement.mainSection.appendChild(showEverythingP);
            }
            
            const displayButton = document.createElement('button');
            displayButton.innerHTML = '&#9679; Découvrez-le. &#9679;';
            displayButton.classList.add('discover-button');
            app.htmlElement.mainSection.appendChild(displayButton);
            app.htmlElement.playVhsString.innerText = 'STOP';
            app.htmlElement.playVhsString.classList.add('animate-flicker');
    
            displayButton.addEventListener('click', app.displayResults);
        }

    },

    // ---- AFFICHAGE DU RESULTAT
    displayResults: () => {
        app.glitch();
        app.htmlElement.mainSection.classList.add('section-result');

        // Gestion des éléments HTML
        app.htmlElement.mainSection.innerText = '';
        const dividerP = document.createElement('p');
        dividerP.classList.add('divider');
        const movieHolder = document.createElement('div');
        movieHolder.id = 'movie-holder';
        const tmdbHolder = document.createElement('div');
        movieHolder.appendChild(tmdbHolder);
        app.htmlElement.mainSection.appendChild(movieHolder);

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
        if (tmdbData.flags.format === 'series') {
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
                    app.htmlElement.mainHeader.remove();
                    let data = JSON.parse(rawData);
                    console.log(data);
                    // Image
                    const poster = document.createElement('img');
                    poster.src = `https://www.themoviedb.org/t/p/w300${data.poster_path}`;
                    const asidePoster = document.createElement('aside');
                    asidePoster.appendChild(poster);
                    app.htmlElement.mainSection.prepend(asidePoster);
        
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
                app.init();
            } else {
                app.data.matchingResults.shift();
                app.data.reloads++;
                app.displayResults();
            }
        });
    },
    // ---- CALLBACK ERROR TMDB
    tmdbError: () => {
        app.htmlElement.mainHeader.innerText = 'Erreur API TMDB';
    },

    // --- INITIALISATION DU JEU, POUR LA PREMIERE OU POUR UN REPLAY
    init: () => {
        // Init HTML elements
        app.htmlElement.playVhsString.innerText = '▶ PLAY';
        app.htmlElement.playVhsString.classList.remove('animate-flicker');
        app.htmlElement.appTitle.remove();
        app.htmlElement.mainSection.innerText = '';
        app.htmlElement.mainSection.classList.remove('section-result');
        app.htmlElement.mainButton.remove();

        if (app.data.quizStep !== 0) {
            app.htmlElement.main.prepend(app.htmlElement.mainHeader);
        }

        // Init app data
        fetch('/data/movies.json')
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

};

// LAUNCH
app.htmlElement.launchButton.addEventListener('click', app.init);


// ************** ADDITIONAL CODE *******************

//  ---- REAL TIME ---- 
// [https://www.plus2net.com/javascript_tutorial/clock.php]
document.body.onload = display_ct();

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
// TESTS TMDB

// theMovieDb.movies.getById({'id': 694}, (data) => {
//     let movie = JSON.parse(data);
//     console.log(movie);
  
// }, () => {
//     console.log('plop');
// }); // Fin d'appel TMDB

// VAR TESTS


// ***************** TODO ************************

/* 
- rajouter les overviews de : full Marble Hornets
- gérer les animations par question
- créer un splash (avec option no-anim)
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




