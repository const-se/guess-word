class Game {
    constructor() {
        this.word = new Word();
        this.unknownWord = new UnknownWord();
        this.guessElement = document.getElementById('guess');
        this.guesses = new Guesses();
        this.intro = document.getElementById('intro');
        this.winModal = new bootstrap.Modal(document.getElementById('win'));
        this.initialize();
    }

    initialize() {
        document.getElementById('clear-history').addEventListener('click', (event) => {
            event.preventDefault();
            this.word.clear();
            this.guessElement.innerHTML = '';
            this.guesses.clear();
            this.intro.classList.remove('d-none');
        });
        document.getElementById('toggle-history-visibility').addEventListener('click', (event) => {
            event.preventDefault();
            document.querySelectorAll('.guess .guess-word').forEach(guess => {
                guess.classList.toggle('blur');
            });
        });
        document.getElementById('game-number').textContent = this.getGameNumber().toString();
        document.getElementById('form').addEventListener('submit', (event) => {
            event.preventDefault();

            document.querySelectorAll('.guess').forEach(guess => {
                guess.classList.add('old');
                guess.querySelector('.guess-word').classList.remove('blur');
            });

            const word = this.word.getWord();
            if (word.length === 0) {
                return;
            }

            if (!this.unknownWord.test(word)) {
                const guess = this.guesses.addGuess(word);
                this.guessElement.innerHTML = '';
                this.guessElement.append(guess.getElement());

                if (guess.rate === 1) {
                    document.querySelectorAll('.guess .guess-word').forEach(guess => {
                        guess.classList.add('blur');
                    });
                    this.winModal.show();
                }
            }

            this.word.clear();
            this.intro.classList.add('d-none');
        });
    }

    getGameNumber = () => {
        const min = 200000;
        const max = 300000;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

class Word {
    constructor() {
        this.element = document.getElementById('word');
        this.initialize();
    }

    initialize() {
        this.element.addEventListener('keydown', (event) => {
            if (!/[а-яa-z]/.test(event.key.toLowerCase())) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
        this.element.focus();
    }

    getWord() {
        return this.element.value.toLowerCase();
    }

    clear() {
        this.element.value = '';
        this.element.focus();
    }
}

class UnknownWord {
    constructor() {
        this.element = document.getElementById('unknown-word');
        this.alertElement = document.getElementById('alert-unknown-word');
    }

    test(word) {
        this.hide();
        if (word.length > 0 && !/^[а-яa-z]+$/i.test(word)) {
            this.show(word);
            return true;
        }

        return false;
    }

    show(word) {
        this.element.textContent = word;
        this.alertElement.classList.remove('d-none');
    }

    hide() {
        this.alertElement.classList.add('d-none');
    }
}

class Guess {
    constructor(word, rate, template) {
        this.word = word;
        this.rate = rate;
        this.template = template;
    }

    getElement() {
        const element = this.template.cloneNode(true);
        element.querySelector('.guess-word').textContent = this.word;
        element.querySelector('.guess-rate').textContent = this.rate;

        return element;
    }
}

class Guesses {
    constructor() {
        this.element = document.getElementById('guesses');
        this.attemptsElement = document.getElementById('attempts');
        this.guessTemplate = document.getElementById('guess-template').content.querySelector('.guess');
        this.guesses = [];
        this.rate = 0;
    }

    addGuess(word) {
        let guess = this.guesses.find(guess => guess.word === word);
        if (guess) {
            return guess;
        }

        guess = new Guess(word, ++this.rate, this.guessTemplate);
        this.guesses.push(guess);
        this.element.append(guess.getElement());
        this.attemptsElement.textContent = this.guesses.length.toString();
        this.show();

        return guess;
    }

    show() {
        this.element.classList.remove('d-none');
    }

    hide() {
        this.element.classList.add('d-none');
    }

    clear() {
        this.guesses = [];
        this.element.innerHTML = '';
        this.attemptsElement.textContent = '0';
        this.rate = 0;
        this.hide();
    }
}

new Game();
