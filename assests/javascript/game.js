// Todo: fix style and background for maximum cool point 🆒🤘

// Game Controller Object - Sets/Hold User State and Game outcomes
const gameController = {
  state: {
    wins: 0,
    incorrect: 0,
    remaining: 0,
    outcome: '',
    loadWin: true,
    modalOpen: false,
    enteredValues: new Set(),
    incorrectValues: new Set(),
  },
  wordList: [
    'The Lion King',
    'Wicked',
    'Phantom of the Opera',
    'Mamma Mia',
    'Chicago',
    'Jersey Boys',
    'Book of Mormon',
    'Les Miserables',
    'Beauty and the Beast',
    'Bandstand',
  ],
  functions: {
    openModal(outcome, word) {
      const modal = document.querySelector('.modal');
      const close = modal.querySelector('.close');
      const playAgain = modal.querySelector('.action');

      gameController.state.modalOpen = true;

      document.getElementById('game-status').innerHTML = `${outcome}`;
      document.getElementById(
        'complete-word',
      ).innerHTML = `The word was: ${word}`;

      modal.classList.add('open');
      close.addEventListener('click', () => {
        gameController.state.modalOpen = false;
        modal.classList.remove('open');
        gameController.functions.restart();
      });

      playAgain.addEventListener('click', () => {
        gameController.state.modalOpen = false;
        modal.classList.remove('open');
        gameController.functions.checkOutCome();
        gameController.functions.keepPlaying();
      });
    },
    checkOutCome() {
      if (gameController.state.outcome === 'lose') {
        gameController.state.wins = 0;
      }
    },
    restart() {
      gameController.state.wins = 0;
      gameController.state.incorrect = '';
      gameController.state.remaining = '';
      gameController.state.loadWin = true;
      gameController.state.modalOpen = false;
      gameController.state.enteredValues = new Set();
      gameController.state.incorrectValues = new Set();
      gameController.program.started = false;
      document.querySelector('#letter-group').textContent =
        'Press any Key to Begin';
      gameController.functions.generateLayout();
    },
    keepPlaying() {
      gameController.state.incorrect = 0;
      gameController.state.loadWin = true;
      gameController.state.modalOpen = false;
      gameController.state.enteredValues = new Set();
      gameController.state.incorrectValues = new Set();
      gameController.functions.selectWord();
      gameController.functions.generateLayout();
    },
    selectWord() {
      gameController.selectedWord =
        gameController.wordList[
          Math.floor(Math.random() * gameController.wordList.length)
        ];

      gameController.state.remaining = gameController.selectedWord.length + 10;

      gameController.selectedWordArray = gameController.selectedWord.split('');
      gameController.functions.buildWord();
    },
    updateRemaining(e) {
      gameController.functions.generateLayout();

      if (!gameController.state.modalOpen) {
        if (gameController.state.remaining) {
          if (!gameController.state.enteredValues.has(e)) {
            gameController.state.remaining -= 1;
            gameController.state.enteredValues.add(e);
            gameController.functions.generateLayout();
          }
        }

        if (gameController.state.remaining === 0) {
          gameController.state.outcome = 'lose';
          gameController.functions.openModal(
            `Oh No! You didn't guess the word 😭`,
            gameController.selectedWord,
          );
        }
      }
    },
    isUnderScore(element) {
      if (element.textContent !== '_ ') {
        return true;
      }
      return false;
    },
    checkforWin(letters) {
      const res = Array.from(letters).every(item =>
        gameController.functions.isUnderScore(item),
      );

      if (gameController.state.loadWin) {
        if (res) {
          gameController.state.outcome = 'win';
          gameController.functions.openModal(
            '🤘Great Job!! You guessed the word 🤘',
            gameController.selectedWord,
          );
          gameController.state.wins += 1;
          gameController.functions.generateLayout();
          gameController.state.loadWin = false;
        }
      }
    },
    setIncorrect(e) {
      if (!gameController.state.modalOpen) {
        if (!gameController.state.incorrectValues.has(e)) {
          gameController.state.incorrectValues.add(e);
          gameController.state.incorrect += 1;
          gameController.functions.generateLayout();
        }
      }
    },
    showLetter(e) {
      // * How const letterSpan works
      // variable name = body(dom).select select all HTML elements inside it with the attribute of data-letter that equals the "keyCode" that was triggered by the key press
      const letterSpan = document.querySelectorAll(
        `[data-letter="${e.keyCode}"]`,
      );
      const allLetters = document.querySelectorAll(
        `span.letters:not([data-letter="32"])`,
      );
      // ? letterSpan and all Letters will return a object named NodeList - It is not an array at this time.

      if (letterSpan.length === 0) {
        gameController.functions.setIncorrect(e.keyCode);
      }

      //  * We need to select the underscore ("_") from the elements.
      // First we need to make an array from our NodeList that was returned from letterSpan. Then we need to iterate through it and update their innerHTML to equal their real text value. (converts keyCode to Letter)
      Array.from(letterSpan).map(
        items => (items.innerHTML = `${String.fromCharCode(e.keyCode)}`),
      );

      gameController.functions.checkforWin(allLetters);
    },
    buildWord() {
      // Get the app element
      const game = document.querySelector('#game');
      // Create markup
      game.innerHTML = `<div id="letter-group">${gameController.selectedWordArray
        .map(function(item) {
          return `<span class='letters' data-letter='${item
            .toUpperCase()
            .charCodeAt()}'>${item.replace(/.{1}/g, '_ ')}</span>`;
          // return `<span class='letters' data-letter='${item.toLowerCase()}'>${item}</span>`;
        })
        .join('')}</div>`;
    },
    generateLayout() {
      const winBox = document.getElementById('win');
      const remainingBox = document.getElementById('remaining');
      const incorrectBox = document.getElementById('incorrect');

      // Updates User State Boxes
      winBox.innerHTML = `Wins: ${gameController.state.wins}`;
      remainingBox.innerHTML = `Remaining: ${gameController.state.remaining}`;
      incorrectBox.innerHTML = `Incorrect: ${gameController.state.incorrect}`;
    },
  },
  selectedWord: '',
  selectedWordArray: '',
  program: {
    started: false,
  },
};

/* Event Listener Functions  */

// Keyboard Listener
window.addEventListener('keyup', function(e) {
  // Start Game If Not Started
  if (!gameController.program.started) {
    gameController.program.started = true;
    gameController.functions.selectWord();
    gameController.functions.generateLayout();
  }
});

window.addEventListener('keydown', function(e) {
  // Start Game After it has been started
  if (gameController.program.started) {
    // Registers which key was pressed. (A-Z)
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      gameController.functions.updateRemaining(e.keyCode);
      gameController.functions.showLetter(e);
    }
  }

  // Set to array
});
