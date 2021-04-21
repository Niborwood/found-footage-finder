// ************** CORE CODE *******************


// PROTOTYPES
let Flags = function (genre, difficulty, origin, date, theme) {
    this.genre = genre;
    this.difficulty = difficulty;
    this.origin = origin;
    this.date = date;
    this.theme = theme;
};

// ----:::: GAME ::::----

let game = {
    // --- GLITCH EFFECT
    glitch: function () {
        let bgIOriginal = game.htmlElement.container.style.backgroundImage;
        game.htmlElement.container.style.backgroundImage = 'url(\'img/noise2.png\')';
        game.htmlElement.container.style.backgroundSize = 'initial';

        setTimeout(function () {
            game.htmlElement.container.style.backgroundImage = bgIOriginal;
            game.htmlElement.container.style.backgroundSize = 'cover';
        }, 100);
    },

    // --- ELEMENTS HTML
    htmlElement: {
        mainHeader: document.querySelector('main h2'),
        mainSection: document.querySelector('main section'),
        mainButton: document.querySelector('main button'),
        launchButton: document.querySelector('button#launch-game'),
        playVhsString: document.querySelector('.play-vhs'),
        appTitle: document.querySelector('#app-title'),
        container: document.querySelector('div#container')
    },

    // --- DATA
    data: {
        quizStep: 0,
        // Data des questions
        question: [
            // Question 1
            [
                'Quel type de film souhaitez-vous voir ?',
                'Un found footage',
                'Un mockumentaire',
                'Un film à sketchs',
                'Une série épisodique',
            ],
            // Question 2
            [
                'Found footage de niche ou tranquille ?',
                'Réponse 1',
                'Réponse 2'],
            // Question 3
            'De quelle origine ?',
            // Question 4
            'Quelle époque ?',
            // Question 5
            'C\'est qui, vos tueurs préférés ?'
            // Question 6
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
    init: function () {
        if (game.htmlElement.playVhsString.innerText === 'STOP') {
            game.htmlElement.playVhsString.innerText = '▶ PLAY';
        }
        game.htmlElement.appTitle.remove();
        game.htmlElement.mainSection.innerText = '';
        game.htmlElement.mainButton.remove();

        game.data.quizStep = 0;
    },

    // ---- ROUTINE DE QUESTIONS
    askQuestion: function () {
        game.glitch();

        let currentQuestion = game.data.question[game.data.quizStep];
        game.htmlElement.mainHeader.innerText = currentQuestion[0];

        let answerButton = document.createElement('button');
        answerButton.setAttribute('class', 'answer-button');
        let answersWrapper = document.createElement('div');
        answersWrapper.setAttribute('id', 'answer-wrapper');
        game.htmlElement.mainSection.appendChild(answersWrapper);

        currentQuestion.shift();
        currentQuestion.forEach(answer => {
            answerButton.innerText = answer;
            answersWrapper.appendChild(answerButton.cloneNode(true));
        });

        let answerButtons = [...document.getElementsByClassName('answer-button')];
        answerButtons.forEach(button => {
            button.addEventListener('click', function (event) {
                // Si n'importe quel bouton réponse est coché cliqué, on le déclique
                // On rajoute l'état cliqué au bouton cliqué
                let buttonClicked = document.getElementById('button-clicked');
                if (buttonClicked === null) {
                    event.target.setAttribute('id', 'button-clicked');
                    console.log('plop');
                } else {
                    buttonClicked.removeAttribute('id');
                    event.target.setAttribute('id', 'button-clicked');
                }
            });
        });

        let nextStepStr = document.createElement('p');
        nextStepStr.setAttribute('class', 'next-question');
        nextStepStr.innerHTML = 'Question suivante <span class="forward">▶▶</span>';
        game.htmlElement.mainSection.appendChild(nextStepStr);

        game.data.quizStep++;
    },

    // --- EXECUTION GLOBALE DU JEU
    play: function () {

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