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

const images = [
  'images/mikvah.jpg',
  'images/room.jpg',
  'images/office.jpg',
  'images/livingroom.jpg',
  'images/kitchen.jpg',
  'images/bathroom.jpg'
];

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

  resultScore.innerText = `You’ve earned ${correct} entries in our giveaway!`;
document.getElementById("result-correct").innerText = `You got ${correct} correct answers`;

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

  // Auto-restart quiz after 7 seconds
  setTimeout(() => location.reload(), 7000);
}

// ✅ Register service worker for PWA fullscreen support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('✅ Service Worker registered'))
    .catch(err => console.error('❌ SW registration error:', err));
}
