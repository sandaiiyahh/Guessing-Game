generateWinningNumber = () => {
    return Math.floor((Math.random() * 100) + 1); // returns random number from 1-100
}

shuffle = (array) => {
    var elem = array.length, t, i;
    while (elem) {
        i = Math.floor(Math.random() * elem--);
        t = array[elem];
        array[elem] = array[i];
        array[i] = t;
    }
    return array;
}

class Game {
    constructor() {
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
        this.win = false;
    }
    difference() {
        return Math.abs(this.playersGuess - this.winningNumber);
    }
    isLower() {
        return this.playersGuess < this.winningNumber ? true : false;
    }
    playersGuessSubmission(num) {
        if (num < 1 || num > 100 || isNaN(num) || num === undefined) {
            document.querySelector('input').value = ''; // i'm repeating here
            const result = 'That is an invalid guess.' // is this necessary with throw?
            const header = document.getElementById('text-changer');
            header.innerHTML = result;
            throw 'That is an invalid guess.'
        } else {
            this.playersGuess = num;
            return this.checkGuess();
        }
    }
    checkGuess() {
        if (Number(this.playersGuess) === this.winningNumber) {
            this.win = true;
            return `You Win! The answer was ${this.winningNumber}`;
        } if (this.pastGuesses.includes(this.playersGuess)) {
            return 'You have already guessed that number.'
        } if (!this.pastGuesses.includes(this.playersGuess) || this.playersGuess !== this.winningNumber) {
            this.pastGuesses.push(this.playersGuess);
            this.displayGuesses();
        }
        if (this.pastGuesses.length === 5) {
            document.querySelector('input').disabled = true;
            return `You Lose. The answer was ${this.winningNumber}`;
        }
        if (this.difference() < 10) {
            return "You're burning up!";
        }
        else if (this.difference() < 25) {
            return "You're lukewarm.";
        }
        else if (this.difference() < 50) {
            return "You're a bit chilly.";
        }
        else if (this.difference() < 100) {
            return "You're ice cold!";
        }
    }
    provideHint() {
        const hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
        return shuffle(hintArray);
    }
    displayGuesses() {
        let guessList = document.querySelectorAll('li');
        for (let i = 0; i < guessList.length; i++) {
            if (this.pastGuesses[i] === undefined) {
                guessList[i].innerHTML = '';
            } else {
                guessList[i].innerHTML = this.pastGuesses[i];
            }
        }
    }
}

newGame = () => {
    return new Game();
}

playGame = () => {
    const game = newGame();
    const button = document.getElementById('submit');
    button.addEventListener('click', function() {
        const inputGuess = document.querySelector('input'); // save input into a variable

        const num = inputGuess.value;  // convert guess into a num
        const result = game.playersGuessSubmission(num); // save returned result into a variable
        const header = document.getElementById('text-changer'); // get header element
        header.innerHTML = result; // change header element's innertext to result

        const higherOrLower = game.isLower() ? 'higher' : 'lower';
        const guide = document.getElementById('hint-giver');
        guide.innerHTML = `Guess ${higherOrLower}!`;
        if (game.pastGuesses.length === 5 || game.win === true) guide.innerHTML = '';

        inputGuess.value = '';


        if (game.pastGuesses.length === 5 || game.win === true) button.disabled = true; // feels weird to put here but it works
    });

    const reset = document.getElementById('reset');
    reset.addEventListener('click', function() {
        location.reload();
    });

    const hint = document.getElementById('hint'); 
    hint.addEventListener('click', function() {
        const header = document.getElementById('text-changer');
        header.innerHTML = `The number is among: ${game.provideHint()}!`;
        hint.disabled = true;
        return header;
    });
}

playGame();