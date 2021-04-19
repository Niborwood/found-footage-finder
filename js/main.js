// ************** CORE CODE *******************


// PROTOTYPES
let Flags = function (genre, difficulty, origin, date) {
    this.genre = genre;
    this.difficulty = difficulty;
    this.origin = origin;
    this.date = date;
};

// ----:::: GAME ::::----

let game = {
    // --- ELEMENTS HTML
    htmlElement: {
        mainHeader: document.querySelector('main h2'),
        mainSection: document.querySelector('main section'),
        mainButton: document.querySelector('main button'),
        launchButton: document.querySelector('button#launch-game'),
        playVhsString: document.querySelector('.play-vhs'),
        appTitle: document.querySelector('#app-title'),
    },

    // --- INITIALISATION DU JEU, POUR LA PREMIERE OU POUR UN REPLAY
    init: function() {
        if (game.htmlElement.playVhsString.innerText === 'STOP') {
            game.htmlElement.playVhsString.innerText = '▶ PLAY';
        }
        game.htmlElement.appTitle.remove();
        game.htmlElement.mainSection.innerText = "";
        game.htmlElement.mainButton.remove();

    },

    // --- DATA
    data: {
        // Data des questions
        questions: [
            // Question 1
            "Vous êtes dans un couloir d'hôpital. Vide. Personne. Les lumières s'éteignent une à une face à vous.",
            // Question 2
            "Question 2",
            // Question 3
            // Question 4
            // Question 5
            // Question 6
            // Question 7
            // Question 8
            // Question 9
            // Question 10
        ],

        // Data des films
        movies: [
            // 01 - C'EST ARRIVE PRES DE CHEZ VOUS
            {
                id: 1,
                movie_data: {
                    tmdb_data: {},
                    flags: new Flags('mockumentary', 'hardcore', 'european', '90s')
                }
            },
            // 02 - V/H/S 2
            {
                id: 2,
                movie_data: {
                    tmdb_data: {},
                    flags: new Flags('sketch', 'normal', 'usa', '10s')
                }
            }
        ],

        // Data des réponses
        answers: {}
    },

    // ---- ROUTINE DE QUESTIONS
    askQuestion: function() {
        game.htmlElement.mainHeader.innerText = game.data.questions[0];
    },

    // --- EXECUTION GLOBALE DU JEU
    play: function () {

        game.init();
        game.askQuestion();
    },
}

game.htmlElement.launchButton.onclick = game.play;


// ************** ADDITIONAL CODE *******************

//  ---- REAL TIME ---- 
// [https://www.plus2net.com/javascript_tutorial/clock.php]
document.body.onload = display_ct();

function display_c() {
    let refresh = 1000;
    mytime = setTimeout('display_ct()', refresh)
}
function display_ct() {
    let date = new Date();
    function zeroDigits(digit) {
        if (digit < 10) {
            return `0${digit}`
        } else {
            return digit;
        }
    }
    let x1 = date.getHours() + ":" + zeroDigits(date.getMinutes()) + ":" + zeroDigits(date.getSeconds());
    document.getElementById('current-time').innerHTML = x1;
    display_c();
}





