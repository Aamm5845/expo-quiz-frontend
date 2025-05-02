document.addEventListener("DOMContentLoaded", () => {
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
  const progressDots = document.getElementById("progress-dots");

  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxOTLbmRENYKwfIXGwkPEzQ24PKqjA6uXZlcccUkw92wn6PID0S8NrKczfc2mQi72I6/exec';

  const allImages = [
    'images/dining-room1.jpg',
    'images/hallway1.jpg',
    'images/kitchen0.jpg',
    'images/kitchen2.jpg',
    'images/kitchen.jpg',
    'images/mikvah.jpg',
    'images/room1.jpg'
  ];

  let images = [];
  let currentQuestion = 0;
  let userName = '';
  let firstNameOnly = '';
  let userEmail = '';
  let answers = [];

  startBtn.addEventListener('click', () => {
    startScreen.classList.remove('active');
    userFormScreen.classList.add('active');

    setTimeout(() => {
      document.getElementById('first-name').focus();
    }, 300);
  });

  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    userName = `${firstName} ${lastName}`;
    firstNameOnly = firstName;
    userEmail = document.getElementById('email').value.trim();

    images = shuffleArray(allImages).slice(0, 3);
    currentQuestion = 0;
    answers = [];

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

    progressDots.innerHTML = '';
    for (let i = 0; i < images.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      if (i === currentQuestion) {
        dot.classList.add('active');
      }
      progressDots.appendChild(dot);
    }
  }

  function showResults() {
    quizScreen.classList.remove('active');
    resultsScreen.classList.add('active');

    const correct = answers.filter(ans => ans === 'Real Image').length;

    resultCorrect.innerText = `Thanks for playing, ${firstNameOnly}!`;
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission)
    })
    .then(() => console.log('✅ Submitted to Google Sheets'))
    .catch((err) => console.error('❌ Submission error:', err));

    setTimeout(() => location.reload(), 30000); // Show results for 30 seconds
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('✅ Service Worker registered'))
      .catch(err => console.error('❌ SW registration error:', err));
  }
});
