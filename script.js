const startBtn = document.getElementById('start-btn');
const userFormScreen = document.getElementById('user-form-screen');
const startScreen = document.getElementById('start-screen');
const userForm = document.getElementById('user-form');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const quizImage = document.getElementById('quiz-image');
const answerButtons = document.querySelectorAll('.answer-btn');
const resultScore = document.getElementById('result-score');
const resultCorrect = document.getElementById('result-correct');
const progressBar = document.getElementById("progress-bar");
const progressCounter = document.getElementById("progress-counter");

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxOTLbmRENYKwfIXGwkPEzQ24PKqjA6uXZlcccUkw92wn6PID0S8NrKczfc2mQi72I6/exec';

const allImages = [
  'images/mikvah.jpg',
  'images/room.jpg',
  'images/office.jpg',
  'images/livingroom.jpg',
  'images/kitchen.jpg',
  'images/bathroom.jpg'
];

let images = [];
let currentQuestion = 0;
let userName = '';
let userEmail = '';
let firstName = '';
let answers = [];

startBtn.addEventListener('click', () => {
  startScreen.classList.remove('active');
  userFormScreen.classList.add('active');
});

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const firstNameInput = document.getElementById('first-name').value.trim();
  const lastNameInput = document.getElementById('last-name').value.trim();
  userName = `${firstNameInput} ${lastNameInput}`;
  firstName = firstNameInput;
  userEmail = document.getElementById('email').value.trim();

  images = shuffleArray(allImages).slice(0, 3);

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

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function loadQuestion() {
  quizImage.src = images[currentQuestion];
  
  const progressPercentage = ((currentQuestion + 1) / images.length) * 100;
  progressBar.style.width = progressPercentage + "%";
  progressCounter.innerText = `Question ${currentQuestion + 1} of ${images.length}`;
}

function showResults() {
  quizScreen.classList.remove('active');
  resultsScreen.classList.add('active');

  const correct = answers.filter(ans => ans === 'Real Image').length;

  resultCorrect.innerHTML = `Thanks for playing, <strong>${firstName}</strong>!<br>You got ${correct} correct answers!`;
  resultScore.innerText = `You’ve earned ${correct} entries in our giveaway!`;

  const submission = {
    name: userName,
    email: userEmail,
    correct: correct,
    total: images.length,
    answers: answers
  };

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

  setTimeout(() => location.reload(), 7000);
}

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('✅ Service Worker registered'))
    .catch((err) => console.error('❌ SW registration error:', err));
}
