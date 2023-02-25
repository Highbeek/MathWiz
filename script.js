// 'use strict';

let operand1, operand2, operator, result, score, interval, highScore;
const nextButton = document.getElementById('next-button');
const input = document.getElementById('input-field');

//generate random operand and operator
function generateQuestion() {
  operand1 = Math.floor(Math.random() * 10) + 1;
  operand2 = Math.floor(Math.random() * 10) + 1;
  operator = Math.floor(Math.random() * 4);
  switch (operator) {
    case 0:
      operator = '+';
      result = operand1 + operand2;
      break;
    case 1:
      operator = '-';
      do {
        operand2 = Math.floor(Math.random() * 10) + 1;
        if (operand1 >= operand2) {
          result = operand1 - operand2;
        } else {
          operand1 =
            operand2 + Math.floor(Math.random() * (10 - operand2 + 1)) + 1;
          result = operand1 - operand2;
        }
      } while (result === 0);
      break;

    case 2:
      operator = '*';
      result = operand1 * operand2;
      if (result > 100) {
        result = operand1 + operand2;
      }
      break;
    case 3:
      operator = '/';
      result = operand1 / operand2;
      if (result % 1 !== 0 || result < 0) {
        result = operand1 + operand2;
        operator = '+';
      }
      break;
  }
  document.getElementById('question').innerHTML =
    operand1 + '     ' + operator + '    ' + operand2 + ' = ';
}
const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

//color pop
function flashColor(color) {
  document.body.style.backgroundColor = color;
  setTimeout(() => {
    document.body.style.backgroundColor = '#011627';
  }, 500);
}

//highscore
let gameEnded = false;
// Save the high score to local storage
function setHighScore(score) {
  localStorage.setItem('highScore', score);
}
// Get the high score from local storage
function getHighScore() {
  return localStorage.getItem('highScore');
}

function updateHighScore(score) {
  if (!gameEnded) {
    return;
  }
  let highScore = getHighScore();
  if (score > highScore) {
    setHighScore(score);
    document.getElementById('high-score').innerHTML = score;
  }
}
let soundPlayed = false;



function endGame() {
  // Check if the game has already ended
  if (gameEnded) {
    return;
  }

  gameEnded = true;
  const score = parseInt(
    document.getElementById('score').textContent.split(': ')[1]
  );

  const message = `Hurray! Your final score is ${score}.`;
  displayMessage(message);
  document.querySelector('body').style.backgroundColor = 'darkgreen';

  // Play the sound effect if it hasn't been played yet
  const sound = new Audio('./sound/hurray.wav');
  sound.play();

  // Update the score display
  document.getElementById('score').textContent = message;
}


// retrieve the high score at the start of each new game
let startingScore = getHighScore();
if (startingScore === null) {
  startingScore = 0;
} else {
  startingScore = Number(startingScore);
}
//Read Out Results
const SpeechSynthesisUtterance =
  window.speechSynthesis.SpeechSynthesisUtterance;

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

let speech = new window.SpeechSynthesisUtterance();
// Get the list of available voices
let voices = window.speechSynthesis.getVoices();

// Find the index of the desired voice in the list of voices
let femaleVoiceIndex = voices.findIndex(
  voice => voice.name === 'Google UK English Female'
);

// Set the voice using its index
speech.voice = voices[femaleVoiceIndex];
//check user input
let incorrectAnswers = 0;

function checkAnswer() {
  document.getElementById('high-score').innerHTML = startingScore;

  let time = parseInt(
    document.getElementById('timer').innerHTML.split(' ')[2].split('s')[0]
  );
  if (time === 0) {
    displayMessage('⌛Time is up! You can no longer answer questions.');
    document.querySelector('body').style.bacgroundColor = 'darkred';
    // Update high score after game ends
    speech.voice = voices[femaleVoiceIndex];
    speech.text = 'Time is up! You can no longer answer questions.';
    speech.lang = 'en-US';
    speech.rate = 3;
    speechSynthesis.speak(speech);
    endGame();

    return;
  }

  let answer = parseInt(document.getElementById('answer').value);
  highScore = getHighScore(score);
  document.getElementById('high-score').innerHTML = highScore;
  if (!answer || !Number(answer)) {
    displayMessage('⛔No number! Insert a Number');
    flashColor('#333');
    speech.voice = voices[femaleVoiceIndex];
    speech.text = 'No number! Insert a Number';
    speech.lang = 'en-US';
    speech.rate = 3;
    speechSynthesis.speak(speech);
    return;
  }

  if (answer === result) {
    score += 2;
    document.getElementById('score').innerHTML = 'Score: ' + score;
    displayMessage('👏Correct, Keep going!');
    flashColor('green');
    generateQuestion();
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();

    // updateHighScore(score);

    speech.voice = voices[femaleVoiceIndex];
    speech.voiceURI = 'Google UK English Female';
    speech.text = 'Correct, Keep going!';
    speech.lang = 'en-US';
    speech.rate = 3;
    speechSynthesis.speak(speech);
  } else {
    incorrectAnswers++;
    document.getElementById('tries').innerHTML =
      'Tries left: ' + (3 - incorrectAnswers);
    flashColor('darkred');
    displayMessage('☹🤦‍♂️ Oops, try again!');
    speech.voice = voices[femaleVoiceIndex];
    speech.text = 'Oops, try again';
    speech.lang = 'en-US';
    speech.rate = 3;
    speechSynthesis.speak(speech);

    if (incorrectAnswers >= 3) {
      if (incorrectAnswers >= 3) {
        clearInterval(interval);
        document.getElementById('tries').innerHTML =
          'You have exceeded the maximum number of allowed incorrect answers. ';

        displayMessage('💥You Lost  the game.');
        // Update high score after game ends
        document.querySelector('body').style.backgroundColor = 'darkred';
        // updateHighScore(score);
        endGame();
        updateHighScore(score);
        speech.voice = voices[femaleVoiceIndex];
        speech.text = 'You Lost  the game';
        speech.lang = 'en-Us';
        speech.rate = 3;
        speechSynthesis.speak(speech);
        return;
      }

      return;
    }
  }
}

//start timer
function startTimer() {
  score = 0;

  document.getElementById('timer').innerHTML = 'Time remaining: 60s';

  interval = setInterval(function () {
    let time = parseInt(
      document.getElementById('timer').innerHTML.split(' ')[2].split('s')[0]
    );
    if (time === 0) {
      clearInterval(interval);
      displayMessage('⌛Time is up! Your score is ' + score);
      document.querySelector('body').style.backgroundColor = 'darkred';
      updateHighScore(score);
      document.getElementById('high-score').innerHTML = score;
      speech.voice = voices[femaleVoiceIndex];
      speech.text = 'Time is up! Your score is ' + score;
      speech.lang = 'en-US';
      speech.rate = 3;
      speechSynthesis.speak(speech);
      endGame();
      // Update high score after game ends
    } else {
      document.getElementById('timer').innerHTML =
        'Time remaining: ' + (time - 1) + 's';
    }
  }, 1000);

  generateQuestion();
}

setTimeout(function () {
  document.querySelector('#timer').style.color = 'darkred';
}, 50400);

//Basic styling from dom

document.getElementById('question').style.display = 'inline-flex';
document.getElementById('question').style.justifyContent = 'center';
document.getElementById('question').style.alignItems = 'center';

operand1 = document.createElement('div');
operand1.style.padding = '0 10px';
operand1.innerHTML = operand1;

operator = document.createElement('div');
operator.style.padding = '0 10px';
operator.innerHTML = operator;

operand2 = document.createElement('div');
operand2.style.padding = '0 10px';
operand2.innerHTML = operand2;

document.getElementById('question').innerHTML = '';
document.getElementById('question').appendChild(operand1);
document.getElementById('question').appendChild(operator);
document.getElementById('question').appendChild(operand2);
document.getElementById('question').innerHTML += ' = ';

// //Make enter button perform same task as next button
//refresh game
function refresh() {
  window.location.reload('Refresh');
}
