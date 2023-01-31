let operand1, operand2, operator, result, score, interval, highScore;

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
  }, 0500);
}

//highscore
// Save the high score to local storage
function setHighScore(score) {
  localStorage.setItem('highScore', score);
}
// Get the high score from local storage
function getHighScore() {
  return Number(localStorage.getItem('highScore')) || 0;
}

function updateHighScore(score) {
 let  highScore = getHighScore();
  if ( score > highScore) {
    setHighScore(score);
    document.getElementById('high-score').innerHTML = highScore;
  }
}

//check user input
let incorrectAnswers = 0;

function checkAnswer() {
  let time = parseInt(
    document.getElementById('timer').innerHTML.split(' ')[2].split('s')[0]
  );
  if (time === 0) {
    displayMessage('⌛Time is up! You can no longer answer questions.');
    document.querySelector('body').style.bacgroundColor = 'darkred';
    // Update high score after game ends

    return;
  }

  let answer = parseInt(document.getElementById('answer').value);
  highScore= getHighScore()
  document.getElementById('high-score').innerHTML= highScore
  if (!answer) {
    displayMessage('⛔No number! Insert a Number');
    flashColor('#333');
    return;
  }

  if (answer === result) {
    score += 2;
    document.getElementById('score').innerHTML = 'Score: ' + score;
    displayMessage('👏Correct, Keep going!');
    flashColor('green');
    document.getElementById('answer').value = '';
    generateQuestion();
    updateHighScore(score);
  } else {
    incorrectAnswers++;
    document.getElementById('tries').innerHTML =
      'Tries left: ' + (3 - incorrectAnswers);
    flashColor('darkred');

    if (incorrectAnswers >= 3) {
      if (incorrectAnswers >= 3) {
        clearInterval(interval);
        document.getElementById('tries').innerHTML =
          'You have exceeded the maximum number of allowed incorrect answers. ';

        clearInterval(interval);
        displayMessage('💥You Lost  the game.');
        // Update high score after game ends
        document.querySelector('body').style.backgroundColor = 'darkred';
        updateHighScore(score);
        return;
      }

      clearInterval(interval);
      displayMessage('💥You Lost  the game.');
      flashColor('darkred');
      // Update high score after game ends
      updateHighScore(score);
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

// ...

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
