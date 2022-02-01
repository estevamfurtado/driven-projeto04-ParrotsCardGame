
// ------------------------------------
// ---------- Global variables --------
// ------------------------------------

let parrots = [
    "bobross", 
    "explody", 
    "fiesta",
    "metal", 
    "revertit", 
    "triplets", 
    "unicorn"  
]

let numOfTotalPairs = 0; // # of total pairs. Calculated after user inputs the # of cards
let boardParrots = []; // array with the parrots used in the game! used to generate cards' html and to check equality
let cardIsHidden = Array(14).fill(true); // defines which cards can be selected
let clickIsAble = false; // manages if any card can be selected at all

let numOfTries = 0; // tracks the # of tries
let numOfDiscoveredPairs = 0; // tracks de # of discovered pairs. used to check if the game is over.
let newGameIsReady = false; // controls if the game is ready to be be started.
let gameHasStarted = false; // controls if the game has started.
let startTime = Date.now(); // marks the beggining of the game.
let totalTime = 0.0; // used to set game's total time.

let firstCardID = -1; // the position of the first card selected in the boardParrots array
let secondCardID = -1; // the position of the second card selected in the boardParrots array
let firstCard = null; // the html element of the first card selected
let secondCard = null; // the html element of the second card selected

let timerElement = document.querySelector(".timer")
let boardElement = document.querySelector("#board")


// ------------------------------------
// --------------- GAME ---------------
// ------------------------------------

// Set up when page is loaded. 
clearCardsViews();
window.addEventListener("load", function () {
    createNewGame();
    setInterval(showTimer, 1000);
});



// ------------------------------------
// ------------ FUNCTIONS -------------
// ------------------------------------


// >> GAME FLOW FUNCTIONS

// Creates a new game
function createNewGame () {
    
    resetGame();

    numOfTotalPairs = askInput()/2;

    generateGame(numOfTotalPairs);

    clearCardsViews();
    createCardsViews();

    newGameIsReady = true;
}


// Set up game variables to initital config. Used to prepare for a new game.
function resetGame () {

    numOfTotalPairs = 0; // # of total pairs. Calculated after user inputs the # of cards
    boardParrots = []; // array with the parrots used in the game! used to generate cards' html and to check equality
    cardIsHidden = Array(14).fill(true); // defines which cards can be selected
    clickIsAble = false; // manages if any card can be selected at all

    numOfTries = 0; // tracks the # of tries
    numOfDiscoveredPairs = 0; // tracks de # of discovered pairs. used to check if the game is over.
    newGameIsReady = false; // controls if the game is ready to be be started.
    gameHasStarted = false; // controls if the game has started.
    startTime = Date.now(); // marks the beggining of the game.
    totalTime = 0.0; // used to set game's total time.

    firstCard = null;
    secondCard = null;
    firstCardID = -1;
    secondCardID = -1;
}


// Keeps asking the number of cards until there is a valid answer;
function askInput () {

    let playerInput = 0;
    playerInput = parseInt(prompt("Quantas cartas você deseja? (números pares de 4 a 14)"))
    
    if (playerInput < 4 || playerInput > 14 || playerInput%2 > 0) {
        playerInput = askInput();
    }

    return playerInput;
}

// prepares the board
function generateGame () {

    boardParrots = shuffle(parrots).slice(0, numOfTotalPairs);
    boardParrots = shuffle(boardParrots.concat(boardParrots));
}

// starts the game when called.
function startGame () {

    if (newGameIsReady === true) {
        startTime = Date.now();
        gameHasStarted = true;
        clickIsAble = true;
        newGameIsReady = false;
    }
}

function endGame() {
    
    clickIsAble = false;
    gameHasStarted = false;
    totalTime = Math.round((Date.now() - startTime)/1000);
}

// Used to allow for new tries.
function unselectCards () {

    firstCard = null;
    secondCard = null;
    firstCardID = -1;
    secondCardID = -1;
}

// Controls the game logic when a card is selected.

function selectCard (card, cardID) {

    // O contador começa após o primeiro clique.
    if (newGameIsReady === true && gameHasStarted === false) {
        startGame();
    }

    // If it ok to click and the card is hidden...
    if (gameHasStarted && clickIsAble === true && cardIsHidden[cardID] === true) {
        
        // If no other has been set as 1st selected card
        if (firstCardID === -1) {

            // set the 1st card and show it
            firstCardID = cardID;
            firstCard = card;
            cardIsHidden[firstCardID] = false;
            flipCard(firstCard);
        }
        
        // else, if the second card is not set
        else if (secondCardID === -1) {
            
            numOfTries += 1;

            secondCardID = cardID;
            secondCard = card;
            cardIsHidden[secondCardID] = false;
            flipCard(secondCard);

            clickIsAble = false;
            
            // If the 2 cards are equal...
            if (boardParrots[firstCardID] === boardParrots[secondCardID]) {

                cardIsHidden[firstCardID] = false;
                cardIsHidden[secondCardID] = false;

                numOfDiscoveredPairs += 1;

                if (numOfDiscoveredPairs === numOfTotalPairs) {

                    endGame();

                    setTimeout (function() {
                        let playAgain = prompt(`You won in ${totalTime} seconds with ${numOfTries} tries! Do you wanna play again? (Y / N)`);
                        if (playAgain === "Y") {
                            createNewGame();
                        }
                    }, 1000); // wait 1 second
                }

                unselectCards();
                clickIsAble = true;
            }
            else {

                setTimeout(function(){

                    flipCard(firstCard);
                    flipCard(secondCard); 
                
                    cardIsHidden[firstCardID] = true;
                    cardIsHidden[secondCardID] = true;
                    
                    unselectCards();

                    clickIsAble = true;

                }, 1500); // wait 1 second
                
            }
        }
    }
}


// >> DOM MANIPULATION FUNCTIONS

// clear the existing cards views.
function clearCardsViews () {
    boardElement.innerHTML = "";
}

// Dinamically creates cards views.
function createCardsViews() {

    for (let i = 0; i < numOfTotalPairs * 2; i++) {
        
        let cardParrot = boardParrots[i]

        let div = document.createElement('div');
        div.setAttribute('class', 'card');
        div.setAttribute('onclick', `selectCard(this, ${i})`);
        div.innerHTML = `
            <div class="face frontFace">
                <img src="./media/front.png" alt="Parrot">
            </div>

            <div class="face backFace">
                <img src="./media/${cardParrot}parrot.gif" alt="${cardParrot}">
            </div>
        `;

        boardElement.append(div);
    }
}


function flipCard (card) {

    card.getElementsByClassName("frontFace")[0].classList.toggle("hideFrontFace");
    card.getElementsByClassName("backFace")[0].classList.toggle("showBackFace");
}

// Updates the timer. Runned by a setInterval.
function showTimer() {
    const secs = Date.now() - startTime;
    if (gameHasStarted === true) {
        timerElement.innerHTML = Math.round(secs/1000)
    }
    else if (newGameIsReady) {
        timerElement.innerHTML = "0";
    }
}

// >> AUXILIAR FUNCTIONS

// shuffles array's elements. returns shuffled array.
function shuffle (array) {
    array.sort(() => Math.random() - 0.5);    
    return array;
}
