const startBtn = document.getElementById('start-btn');
const userFormScreen = document.getElementById('user-form-screen');
const startScreen = document.getElementById('start-screen');
const userForm = document.getElementById('user-form');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const quizImage = document.getElementById('quiz-image');
const answerButtons = document.querySelectorAll('.answer-btn');
const resultScore = document.getElementById('result-score');

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxOTLbmRENYKwfIXGwkPEzQ24PKqjA6uXZlcccUkw92wn6PID0S8NrKczfc2mQi72I6/exec';

const images = ['images/mikvah.jpg', 'images/room.jpg', 'images/office.jpg', 'images/livingroom.jpg', 'images/kitchen.jpg', 'images/bathroom.jpg'];

let currentQuestion = 0;
let userName = '';
let userEmail = '';
let answers = [];

startBtn.addEventListener('click', () => {
  startScreen.classList.remove('active');
  userFormScreen.classList.add('active');
});

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  userName = document.getElementById('name').value;
  userEmail = document.getElementById('email').value;
  userFormScreen.classList.remove('active');
  quizScreen.classList.add('active');
  loadQuestion();
});

answerButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.getAttribute('data-answer');
    answers.push(answer);
    currentQuestion++;
    if (currentQuestion < images.length) {
      loadQuestion();
    } else {
      showResults();
    }
  });
});

function loadQuestion() {
  quizImage.src = images[currentQuestion];
}

function showResults() {
  quizScreen.classList.remove('active');
  resultsScreen.classList.add('active');
  const correct = answers.filter(ans => ans === 'Real Image').length;
  resultScore.textContent = `You got ${correct} out of ${images.length} correct.`;

  const submission = {
    name: userName,
    email: userEmail,
    answers: answers.join(', '),
    correct: correct,
    timestamp: new Date().toISOString()
  };

  // Submit to Google Sheets
  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(submission)
  })
  .then(() => console.log('✅ Submitted to Google Sheets'))
  .catch((err) => console.error('❌ Submission error:', err));

  // Auto restart after 7 seconds
  setTimeout(() => location.reload(), 7000);
}