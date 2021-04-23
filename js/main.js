// ************** CORE CODE *******************
// PROTOTYPES
const Flags = function (genre, difficulty, origin, date, theme) {
    this.genre = genre;
    this.difficulty = difficulty;
    this.origin = origin;
    this.date = date;
    this.theme = theme;
};

// ----:::: GAME ::::----
const game = {
    // --- GLITCH EFFECT
    glitch: () => {
        let bgIOriginal = game.htmlElement.container.style.backgroundImage;
        game.htmlElement.container.style.backgroundImage = 'url(\'img/noise2.png\')';
        game.htmlElement.container.style.backgroundSize = 'initial';
        game.htmlElement.container.style.animation = `animatedBackground ${Math.random()/2}s ease-in infinite`;

        setTimeout(() => {
            game.htmlElement.container.style.backgroundImage = bgIOriginal;
            game.htmlElement.container.style.animation = '0';
            game.htmlElement.container.style.backgroundSize = 'cover';
        }, Math.random()*110);
    },

    // --- ELEMENTS HTML
    htmlElement: {
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
        quizStep: 0,
        // Data des questions
        question: [
            // Question 1 - Genre
            [
                'Quel type de film souhaitez-vous voir ?',
                ['Un found footage', 'ff'],
                ['Un mockumentaire', 'mockumentary'],
                ['Un film à sketchs', 'sketch'],
                ['Une série épisodique', 'series'],
            ],
            // Question 2 - Difficulty
            [
                'Chaud pour un film de niche, ou on y va doucement ?',
                ['Je connais déjà mes classiques, go !', 'hardcore'],
                ['Sors-moi un truc regardable', 'casual']
            ],
            // Question 3 - origin
            [
                'Il doit venir d\'où, ce film ?',
                ['de France', 'france'],
                ['d\'Europe', 'europe'],
                ['des USA', 'usa'],
                ['d\'Asie', 'asia'],
                ['Rien de tout ça', 'other']
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
                ['Les slashers', 'slasher'],
                ['Le paranormal', 'supernatural'],
                ['Les aliens', 'aliens']
            ],
            // Question 6
            // [
            //     'Si je rajoute une question...',
            //     ['Oui', ''],
            //     ['Non', '']
            // ]
            
            // Question 7
            // Question 8
            // Question 9
            // Question 10
        ],


        // Data des films
        movies: [
            // Flags CheatSheet : genre, difficulty, origin, date, theme
            // 01 - C'EST ARRIVE PRES DE CHEZ VOUS
            {
                id: 1,
                movie_data: {
                    // tmdb_data: theMovieDb.movies.getById({"id":10086}, function() {return this.title}, function() {}),
                    flags: new Flags('mockumentary', 'hardcore', 'europe', '90s', 'slasher')
                }
            },
            // 02 - V/H/S 2
            {
                id: 2,
                movie_data: {
                    tmdb_data: {},
                    flags: new Flags('sketch', 'normal', 'usa', '10s', 'supernatural')
                }
            },
            // 03 - The Poughkeepsie Tapes
            {
                id: 3,
                movie_data: {
                    tmdb_data: {},
                    flags: new Flags('mockumentary', 'hardcore', 'usa', '00s', 'slasher')
                }
            },
            // 04 - The Blair Witch Project
            {
                id: 4,
                movie_data: {
                    tmdb_data: {},
                    flags: new Flags('ff', 'normal', 'usa', '90s', 'supernatural')
                }
            },
            // 05 - Cannibal Holocaust
            {
                id: 5,
                movie_data: {
                    tmdb_data: {},
                    flags: new Flags('mockumentary', 'normal', 'europe', '80s', 'slasher')
                }
            },
            // 06 - Marble Hornets
            {
                id: 6,
                movie_data: {
                    tmdb_data: {},
                    flags: new Flags('series', 'hardcore', 'usa', '10s', 'supernatural')
                }
            },
            // 07 - Trolljegeren 
            {
                id: 7,
                movie_data: {
                    tmdb_data: {},
                    flags: new Flags('mockumentary', 'normal', 'europe', '10s', 'supernatural')
                }
            },
            // 08 - Noroi: The Curse 
            {
                id: 8,
                movie_data: {
                    tmdb_data: {},
                    flags: new Flags('ff', 'normal', 'asia', '00s', 'supernatural')
                }
            },
            // 09 - Les Documents Interdits
            {
                id: 9,
                movie_data: {
                    tmdb_data: {},
                    flags: new Flags('series', 'hardcore', 'europe', '80s', 'supernatural')
                }
            },
            // 10 - Murder Deeath Koreatown
            {
                id: 10,
                movie_data: {
                    tmdb_data: {},
                    flags: new Flags('ff', 'hardcore', 'usa', '10s', 'supernatural')
                }
            }
        ],

        // Data des réponses
        answers: []
    },

    // --- INITIALISATION DU JEU, POUR LA PREMIERE OU POUR UN REPLAY
    init: () => {
        game.htmlElement.playVhsString.innerText = '▶ PLAY';
        game.htmlElement.playVhsString.classList.remove('animate-flicker');
        game.htmlElement.appTitle.remove();
        game.htmlElement.mainSection.innerText = '';
        game.htmlElement.mainButton.remove();

        game.data.quizStep = 0;
    },

    // ---- ROUTINE D'AFFICHAGE DE CHAQUE QUESTION/REPONSES
    askQuestion: () => {
        game.glitch();

        // Elements HTML générés
        const answerButton = document.createElement('button');
        answerButton.setAttribute('class', 'answer-button');
        const answersWrapper = document.createElement('div');
        answersWrapper.setAttribute('id', 'answer-wrapper');
        game.htmlElement.mainSection.appendChild(answersWrapper);
        const nextStepStr = document.createElement('p');
        nextStepStr.classList.add('next-question');
        const skipQuestionString = 'Passer cette question (tout me va) <span class="forward">▶</span>';
        const nextQuestionString = 'Question suivante <span class="forward">▶▶</span>';
        nextStepStr.innerHTML = skipQuestionString;
        game.htmlElement.mainSection.appendChild(nextStepStr);
        

        // Génération de l'affichage des questions / réponses (avec flag values)
        const currentQuestion = game.data.question[game.data.quizStep];
        game.htmlElement.mainHeader.innerText = currentQuestion[0];
        currentQuestion.shift();
        currentQuestion.forEach(answer => {
            answerButton.innerText = answer[0];
            answerButton.value = answer[1];
            answersWrapper.appendChild(answerButton.cloneNode(true));
        });

        // Gestion de la réponse utilisateur et génération du bouton suivant
        const answerButtons = [...document.getElementsByClassName('answer-button')];
        
        answerButtons.forEach(button => {
            button.addEventListener('click', function (event) {
                const buttonClicked = document.getElementById('button-clicked');

                if (buttonClicked === null) {
                    event.target.setAttribute('id', 'button-clicked');
                    
                } else if (event.target.id === 'button-clicked') {
                    buttonClicked.removeAttribute('id');
                }
                else {
                    buttonClicked.removeAttribute('id');
                    event.target.setAttribute('id', 'button-clicked');
                }

                if (nextStepStr.innerHTML === skipQuestionString && event.target.id === 'button-clicked') {
                    nextStepStr.classList.add('animate-flicker', 'flicker__fast');
                    nextStepStr.innerHTML = nextQuestionString;
                } 
                else if (nextStepStr.innerHTML === nextQuestionString && event.target.id !== 'button-clicked') {
                    nextStepStr.innerHTML = skipQuestionString;
                    nextStepStr.classList.remove('animate-flicker', 'flicker__fast');
                }        
            }); // Fin de l'EL au clic sur les boutons
        }); // Fin de la boucle de boutons réponses
        
        // On enregistre le flag/réponse, on efface tout et on relance la prochaine question
        nextStepStr.addEventListener('click', game.nextQuestion);
    },

    // ---- ROUTINE DE REPONSE A QUESTION / GENERATION DE NOUVELLE QUESTION / APPEL DE RESULTATS
    nextQuestion: () => {
        // On enregistre la (les) réponse(s) dans le tableau des flags/réponses
        const userAnswer = document.getElementById('button-clicked');
        if (userAnswer !== null) {     
            game.data.answers.push(userAnswer.value);
        } else {
            const allAnswers = [...document.getElementsByClassName('answer-button')];
            allAnswers.forEach(element => {
                game.data.answers.push(element.value);
            });
        }
       
        // Est-ce qu'on a fait le tour des questions à poser ?
        if (game.data.quizStep < game.data.question.length-1) {
            game.htmlElement.mainSection.innerText = '';
            game.data.quizStep++;
            game.askQuestion();
        } else {
            game.displayEndQuiz();
        }
    },

    // ---- ECRAN TEMPORAIRE DE FIN DE QUIZ
    displayEndQuiz: () => {
        game.glitch();

        // Gestion des éléments HTML
        game.htmlElement.appHeader.appendChild(game.htmlElement.appTitle);
        game.htmlElement.mainHeader.innerText = 'Votre found footage est prêt.';
        game.htmlElement.mainSection.innerText = '';
        const displayButton = document.createElement('button');
        displayButton.innerHTML = '&#9679; Découvrez-le. &#9679;';
        displayButton.classList.add('discover-button');
        game.htmlElement.mainSection.appendChild(displayButton);
        game.htmlElement.playVhsString.innerText = 'STOP';
        game.htmlElement.playVhsString.classList.add('animate-flicker');

        displayButton.addEventListener('click', game.displayResults);

    },

    // ---- AFFICHAGE DU RESULTAT
    displayResults: () => {
        console.log(game.data.answers);
        

    },

    // --- EXECUTION GLOBALE DU JEU
    play: () => {

        game.init();
        game.askQuestion();
    },
};

game.htmlElement.launchButton.addEventListener('click', game.play);


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
    let x1 = zeroDigits(date.getHours()) + ':' + zeroDigits(date.getMinutes()) + ':' + zeroDigits(date.getSeconds());
    document.getElementById('current-time').innerHTML = x1;
    display_c();
}

game.data.answers = ['mockumentary', 'hardcore', 'europe', '90s', 'slasher'];

// let movieFlagsData = game.data.movies[0].movie_data.flags;
// let movieFlags = Object.values(movieFlagsData);

// // console.log('Flags de la Data', movieFlags);
// // console.log('Réponse utilisateur', game.data.answers);


// // let matchingResults = [];


// // ...check if element indexOf => movieFlags 
// game.data.answers.forEach(element => {
//     if (movieFlags.indexOf(element) === -1) {
//         // moviesMatch.push(index);           
//     } 
// });

