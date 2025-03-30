const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const userFormScreen = document.getElementById('user-form-screen');
const quizScreen = document.getElementById('quiz-screen');
const userForm = document.getElementById('user-form');
const quizImage = document.getElementById('quiz-image');
const answerButtons = document.querySelectorAll('.answer-btn');
const progressDots = document.getElementById('progress-dots');

let userAnswers = [];
let currentQuestion = 0;
let correctAnswers = 0;
let userInfo = { name: '', email: '' };

const questions = [
  { image: 'images/mikvah.jpg', correct: 'Real Image' },
  { image: 'images/room.jpg', correct: 'Real Image' },
  { image: 'images/kitchen.jpg', correct: 'Real Image' },
  { image: 'images/office.jpg', correct: 'Real Image' },
  { image: 'images/livingroom.jpg', correct: 'Real Image' },
  { image: 'images/bathroom.jpg', correct: 'Real Image' }
];

function showQuestion(index) {
  quizImage.src = questions[index].image || '';
  updateProgressDots(index);
}

function updateProgressDots(index) {
  progressDots.innerHTML = '';
  for (let i = 0; i < questions.length; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === index) dot.classList.add('active');
    progressDots.appendChild(dot);
  }
}

function showResults() {
  quizScreen.innerHTML = `
    <h2>All images are real images of projects designed by Meisner Interiors.</h2>
    <p>You got ${correctAnswers} out of ${questions.length} correct.</p>
    <p>Thank you for participating!</p>
    <button onclick="location.reload()">Restart Quiz</button>
  `;

  // Submit to Google Sheets
  fetch('https://script.google.com/macros/s/AKfycbxOTLbmRENYKwfIXGwkPEzQ24PKqjA6uXZlcccUkw92wn6PID0S8NrKczfc2mQi72I6/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: userInfo.name,
      email: userInfo.email,
      correct: correctAnswers,
      total: questions.length,
      answers: userAnswers
    })
  })
    .then(res => {
      console.log('✅ Submitted to Google Sheet');
      return res.text();
    })
    .then(console.log)
    .catch(err => {
      console.error('❌ Failed to submit:', err);
    });
}

startBtn.addEventListener('click', () => {
  startScreen.classList.remove('active');
  userFormScreen.classList.add('active');
});

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (name && email) {
    userInfo.name = name;
    userInfo.email = email;
    userFormScreen.classList.remove('active');
    quizScreen.classList.add('active');
    showQuestion(currentQuestion);
  } else {
    alert('Please fill in both fields.');
  }
});

answerButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const answer = btn.getAttribute('data-answer');
    userAnswers.push(answer);
    if (answer === questions[currentQuestion].correct) {
      correctAnswers++;
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion(currentQuestion);
    } else {
      showResults();
    }
  });
});
