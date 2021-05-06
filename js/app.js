// ************** CORE CODE *******************
/* global theMovieDb */

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
    // ------ DATA
    data: {
        quizStep: 0,
        quizSkips: 0,
        answers: [],
        reloads: 0,
        animations: true,
        nextKeys: ['ArrowRight', 'KeyD', 'Enter'],
        cancelKeys: ['Backspace', 'Escape', 'Delete']
    },

    // ------ COMMON
    displayAnimations: (element) => {
        if (app.data.animations) {
            element.classList.add('display-fade');
        }
    },
    // --- GLITCH EFFECT
    glitch: (duration) => {
        // Animation check
        if (!app.data.animations) {
            return;
        }

        // Check duration (random if null)
        let timeoutDuration = Math.random() * 210;
        if (typeof duration !== 'undefined') {
            timeoutDuration = duration;
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
            container.style.backgroundImage = 'url(\'img/noise.gif\')';
            container.style.animation = '0';
            container.style.backgroundSize = 'cover';
        }, timeoutDuration);
    },

    
    // --- SPLASH
    displaySplash: () => {
        // HTML elements
        const launchButton = document.querySelector('button#launch-game');
        const container = document.querySelector('#container');
        container.style.visibility = 'hidden';

        const splashDiv = document.createElement('div');
        splashDiv.id = 'splash';
        document.body.prepend(splashDiv);

        // FIND-ME text
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

        // Skip Animations 
        const skipAnimationsP = document.createElement('p');
        skipAnimationsP.classList.add('skip-animations');
        skipAnimationsP.innerText = 'Skip Animations';
        splashDiv.appendChild(skipAnimationsP);

        // Event Listener :: Skip Animations
        const skipAnimations = (event) => {
            if (app.data.animations) {
                event.target.classList.toggle('skip-animations-active');
                app.data.animations = false;
                findMeDiv.removeAttribute('id');
                meText.removeAttribute('id');
                findText.removeAttribute('id');
            } else {
                event.target.classList.toggle('skip-animations-active');
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
                const typingH2 = document.querySelector('main h2 div');
                typingH2.classList.add('typing-effect');
                const typingLastH2 = document.querySelector('main h2 div:nth-child(2)');
                typingLastH2.classList.add('typing-effect', 'typing-last');
                app.html.mainSection.classList.add('delayed-display-fade');
                launchButton.classList.add('delayed-display-fade');
                app.html.appHeader.classList.add('delayed-display-fade', 'glitch', 'gl-5');
                app.html.playVhsString.classList.add('animate-flicker');
                app.glitch(500);

                // Wait for display-fade animation to end to fire EL :: keyup & click (to launch the game)
                setTimeout(() => {
                    app.nextAction('next', launchButton, app.reset);
                }, 8000);
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
                app.nextAction('next', launchButton, app.reset);
                // app.reset(); OLD EL
            }
        };

        // EL :: click on FIND ME text
        findMeDiv.addEventListener('click', findMeTrigger);
    },
    
    // --- INIT
    init: () => {

        // Display Splash
        app.displaySplash();

        // Fetch questions (JSON)
        fetch('data/locale/fr-FR/questions.json')
            .then(response => {
                return response.json();
            })
            .then(data => {
                app.data.question = data;
            });

        // OLD EL
        // const launchButton = document.querySelector('button#launch-game');
        // launchButton.addEventListener('click', app.reset);
    },
    // --- GAME RESERT (LAUNCH | REPLAY)
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

        // Fetch movies (JSON)
        fetch('data/movies.json')
            .then(response => {
                return response.json();
            })
            .then(data => {
                app.data.movies = Object.values(data);
            });

        // Init app data
        app.data.answers = [];
        app.data.quizStep = 0;
        app.data.reloads = 0;
        app.data.quizSkips = 0;

        // Begin
        app.askQuestion();
    },

    // **** QUIZ ROUTINE
    // ---- QUESTIONS AND ANSWERS DISPLAY
    askQuestion: () => {
        app.glitch();

        // HTML Elements
        
        const currentQuestion = app.data.question[app.data.quizStep];
        app.html.mainHeader.innerText = currentQuestion[0];
        const currentAnswers = currentQuestion.slice(1);
        const multiInfoP = document.createElement('p');
        multiInfoP.classList.add('multi-info');
        multiInfoP.innerText = 'Vous pouvez sélectionner plusieurs réponses.';
        app.html.mainHeader.parentNode.insertBefore(multiInfoP, app.html.mainHeader.nextSibling);
        console.log('Les réponses après la question', app.data.quizStep+1, ' : ', app.data.answers);

        
        // Si ce n'est pas la 1ère question
        if (app.data.quizStep === 0) {
            app.displayAnswers(currentAnswers);
        }
        else {
            // On récupère les films restants par rapport à la réponse précédente
            
            const moviesLeft = [];
            const currentFlags = app.data.answers[app.data.quizStep-1];

            for (const movie of app.data.movies) {
                for (const flag of currentFlags) { 
                    if( movie.flags.indexOf(flag) !== -1 ) {
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
                    if (movie.flags.flat().indexOf(answer[1]) === -1) {
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
        
        
    },
    displayAnswers: (answers) => {

        // Display buttons, innerText and values from question data
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
            });
        }

        // Display animation
        if (app.data.animations) {
            app.html.mainSection.style.visibility = 'hidden';
            app.html.mainSection.classList.add('display-fade');
        }

        // EL :: keyup & click to answer processing & next question loading
        app.nextAction('next', nextStepStr, app.nextQuestion);
    },
    
    // ---- DATA RECORD & NEW QUESTION | END QUESTIONS
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

        // Est-ce qu'on a fait le tour des questions à poser ? (nombre de questions + ne pas poser de question s'il n'y a qu'une réponse possible)
        if ( app.data.quizStep < (app.data.question.length -1) && app.data.movies.length !== 1 ) {
            app.html.mainSection.innerText = '';
            app.html.mainSection.classList.remove('display-fade');
            app.data.quizStep++;

            app.askQuestion();
        } else {
            const moviesLeft = [];
            const currentFlags = app.data.answers[app.data.quizStep];

            for (const movie of app.data.movies) {
                for (const flag of currentFlags) { 
                    if( movie.flags.flat().indexOf(flag) !== -1 && moviesLeft.find(movieLeft => movieLeft === movie) === undefined) {
                        moviesLeft.push(movie);
                    }
                }       
            }

            // Score sorting
            app.data.movies = moviesLeft.sort(function(a,b){
                return b.score - a.score;
            });

            // Display Ending Screen
            app.displayEndQuiz();
        }
    },
    // ---- TEMP END DISPLAY
    displayEndQuiz: () => {
        console.log('****** Mon résultat final :', app.data.movies);
        app.glitch();
        app.html.appHeader.appendChild(app.html.appTitle);

        app.html.mainHeader.innerText = 'Votre found footage est prêt.';
        app.html.mainHeader.classList.add('footage-ready');
        app.html.mainSection.innerText = '';

        // Si toutes les questions ont été passées, petit message personnalisé
        if (app.data.quizSkips === app.data.question.length) {
            const showEverythingP = document.createElement('p');
            showEverythingP.classList.add('show-everything');
            app.displayAnimations(showEverythingP);
            showEverythingP.innerText = '(Après, vous n\'avez mis aucun filtre, donc bon.)';
            app.html.mainSection.appendChild(showEverythingP);
        }

        // Display discover-results button
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

        // Display SVOD-VOD option
        let noStreamingCounter = 1;
        const noStreamingMovies = [];
        for (const movie of app.data.movies) {
            
            theMovieDb.movies.getProviders({ 'id': [movie.tmdb_id] }, (rawData) => {
                const data = JSON.parse(rawData);
                if (data.results.FR === undefined) {
                    noStreamingCounter++;
                    noStreamingMovies.push(movie.id);
                } 
            }, app.tmdbError);
        }

        if (noStreamingCounter !== app.data.movies.length) {
            // HTML elements
            const svodOptionP = document.createElement('p');
            svodOptionP.classList.add('vod-option');
            svodOptionP.innerText = 'Afficher les résultats indisponibles en SVOD/VOD';
            app.html.mainSection.appendChild(svodOptionP);

            // EL :: click to activate.deactivate svod-vod
            svodOptionP.addEventListener('click', (event) => {
                event.target.classList.toggle('vod-option-active');
            });
        }
        
        // EL :: keyup & click to launch display tmdb/movie results
        app.nextAction('next', displayButton, app.displayResults, noStreamingMovies);
    },

    // ------- QUIZ ENDING
    // ---- DISPLAY RESULT
    displayResults: (noStreamingMovies) => {
        app.glitch();

        // Catching SVOD-VOD button state and removing unavailable movies if need be
        const svodOption = document.querySelector('.vod-option-active');
        if (svodOption !== null) {
            app.data.movies = app.data.movies.filter(function(movie) {
                return !noStreamingMovies.includes(movie.id); 
            });
        }

        // Preparing / emptying the template
        app.html.mainSection.innerText = '';
        app.html.mainHeader.classList.remove('footage-ready');
        app.html.mainSection.classList.add('section-result');

        // HTML elements
        const movieHolder = document.createElement('div');
        movieHolder.id = 'movie-holder';
        const tmdbHolder = document.createElement('div');
        movieHolder.appendChild(tmdbHolder);
        app.displayAnimations(movieHolder);

        app.html.mainSection.appendChild(movieHolder);
        
        // TMDB display (movies | series)
        const tmdbData = app.tmdbCrawler(app.data.movies[0].id);
        tmdbData.flags.indexOf('series') !== -1 ? app.displayTmdbData(tmdbData, tmdbHolder, 'tv') : app.displayTmdbData(tmdbData, tmdbHolder, 'movies');

        // More (reload data/quiz) display
        app.displayMore(movieHolder);
    },

    // ---- DISPLAY TMDB DATA (API RESPONSE)
    displayTmdbData: (tmdbData, tmdbHolder, format) => {

        // HTML elements
        const dividerP = document.createElement('p');
        dividerP.classList.add('divider');

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
                    flagsHolder.innerText = tmdbData.flags.flat().sort().join(', ');
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

                // If no legal SVOD-VOD option
                if (data.results.FR === undefined) {
                    const targetH3 = document.createElement('h3');
                    targetH3.innerHTML = 'Indisponible en SVOD & VOD';
                    tmdbHolder.appendChild(targetH3);
                }
                // Provider display routine
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

    // ---- DISPLAY MORE
    displayMore: (moreHolder) => {
        // H3 header
        const moreResultsH3 = document.createElement('h3');
        moreResultsH3.innerText = 'Autres résultats';
        moreHolder.appendChild(moreResultsH3);

        // HTML elements
        const moreResultsP = document.createElement('p');
        const moreResultsA = document.createElement('a');
        moreResultsA.classList.add('reload-data');
        const reloadResultsA = document.createElement('a');
        reloadResultsA.innerHTML = '<br><br><span class="forward">▶▶</span> Relancer un test';

        // Display custom prompt regarding corresponding movie data
        if (app.data.movies.length === 1) {
            if (app.data.reloads === 0) {
                moreResultsP.innerHTML = 'Un seul résultat a correspondu à votre requête.<br><br>';
            } else {
                moreResultsP.innerHTML = 'Dernier résultat selon vos critères. <br><br>';
            }

        }
        // If 2+ results
        else {
            let resultPlural = 'autres résultats correspondent';
            if (app.data.movies.length === 2) {
                resultPlural = 'autre résultat correspond';
            }
            moreResultsP.innerHTML = `Déjà vu ?<br> ${app.data.movies.length - 1} ${resultPlural} à vos réponses. <br><br>`;
            moreResultsA.innerHTML = '<span class="forward">▶</span> Me proposer un autre résultat parmi les mêmes critères';
        }

        // Display processed HTML elements (via .reload-data)
        moreHolder.appendChild(moreResultsP);
        moreResultsP.appendChild(moreResultsA);
        moreResultsP.appendChild(reloadResultsA);

        // Reload Movie function (reload another movie with the same flags) & listener
        const reloadMovie = () => {
            app.data.movies.shift();
            app.data.reloads++;
            app.displayResults();
        };

        app.nextChoice(reloadMovie, app.reset, moreResultsA, reloadResultsA);

        // OLD EL
        // EL :: click (reloadMovie)
        // moreResultsA.addEventListener('click', (event) => {
        //     event.preventDefault();
        //     reloadMovie();            
        // });

        // EL :: click (reload another quiz)
        // reloadResultsA.addEventListener('click', (event) => {
        //     event.preventDefault();
        //     app.reset();
        // });
    },

    // ---- FETCH MOVIEDATA.ID WITH TMDB.DATA, RETURN CURRENT ID & FLAGS
    tmdbCrawler: (id) => {
        const currentMovie = app.data.movies.find(movie => movie.id === id);
        return { id: currentMovie.tmdb_id, flags: currentMovie.flags };
    },
    // ---- CALLBACK ERROR TMDB
    tmdbError: () => {
        app.html.mainHeader.innerText = 'Erreur API TMDB';
    },
    // ---- HANDLE KEYBOARDS & CLICK EVENTS & CALLBACKS
    nextAction: (action, clickTarget, callback, parameter) => {
        // Switch keys between selected action
        let keys;
        switch (action) {
        case 'next':
            keys = app.data.nextKeys;
            break;

        case 'cancel':
            keys = app.data.cancelKeys;
            break;
        
        default:
            break;
        }
        
        // Keyboard function
        const nextListener = (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (event.type === 'keyup') {
                for (const key of keys) {
                    if (event.code === key) {
                        callback(parameter);
                    }
                }
            } else if (event.type === 'click') {
                callback(parameter);
            }
            document.removeEventListener('keyup', nextListener);
            document.removeEventListener('click', nextListener);
        };

        // EL :: keyup & click
        clickTarget.addEventListener('click', nextListener);
        document.addEventListener('keyup', nextListener);

    },
    nextChoice: (callbackNext, callbackCancel, clickTargetNext, clickTargetCancel, parameter) => {
        const nextListener = (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (app.data.movies.length > 1) {
                if (event.type === 'keyup') {
                    for (const key of app.data.nextKeys) {
                        if (event.code === key) {
                            callbackNext(parameter);
                        }
                    }
                } else if (event.type === 'click') {
                    callbackNext(parameter);
                }
            }

            document.removeEventListener('keyup', nextListener);
            document.removeEventListener('click', nextListener);
            // document.removeEventListener('keyup', cancelListener);
            // document.removeEventListener('click', cancelListener);
        };

        const cancelListener = (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (app.data.movies.length >= 1) {
                if (event.type === 'keyup') {
                    for (const key of app.data.cancelKeys) {
                        if (event.code === key) {
                            callbackCancel(parameter);
                        }
                    }
                } else if (event.type === 'click') {
                    callbackCancel(parameter);
                }
            }

            document.removeEventListener('keyup', cancelListener);
            document.removeEventListener('click', cancelListener);
            document.removeEventListener('keyup', nextListener);
            document.removeEventListener('click', nextListener);
        };

        document.addEventListener('keyup', nextListener);
        document.addEventListener('keyup', cancelListener);
        clickTargetNext.addEventListener('click', nextListener);
        clickTargetCancel.addEventListener('click', cancelListener);
    }

};

// ------> LAUNCH
document.addEventListener('DOMContentLoaded', app.init);

// document.addEventListener('click', (event) => {
//     console.log(event);
// });

/*

V.beta02
- Navigation globale au clavier

v2
- FR & EN
- Add sounds (idle, click, display, glitch)
- ouvrir à tous les films d'horreur
- pouvoir ajouter à la bdd des films en front (sous contrôle)

*/




