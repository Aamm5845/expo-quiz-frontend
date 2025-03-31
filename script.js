const startScreen = document.getElementById('start-screen');
const userFormScreen = document.getElementById('user-form-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');

const startBtn = document.getElementById('start-btn');
const userForm = document.getElementById('user-form');
const quizImage = document.getElementById('quiz-image');
const answerButtons = document.querySelectorAll('.answer-btn');
const resultScore = document.getElementById('result-score');

const images = [
  { src: 'images/mikvah.jpg', answer: 'Real Image' },
  { src: 'images/room.jpg', answer: 'Real Image' },
  { src: 'images/office.jpg', answer: 'Real Image' },
  { src: 'images/livingroom.jpg', answer: 'Real Image' },
  { src: 'images/kitchen.jpg', answer: 'Real Image' },
  { src: 'images/bathroom.jpg', answer: 'Real Image' }
];

let currentQuestion = 0;
let correctCount = 0;

startBtn.addEventListener('click', () => {
  startScreen.classList.remove('active');
  userFormScreen.classList.add('active');
});

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  userFormScreen.classList.remove('active');
  quizScreen.classList.add('active');
  loadQuestion();
});

function loadQuestion() {
  const current = images[currentQuestion];
  quizImage.src = current.src;
}

answerButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.getAttribute('data-answer');
    const correct = images[currentQuestion].answer;

    if (selected === correct) correctCount++;

    currentQuestion++;

    if (currentQuestion < images.length) {
      loadQuestion();
    } else {
      showResults();
    }
  });
});

function showResults() {
  quizScreen.classList.remove('active');
  resultsScreen.classList.add('active');

  resultScore.textContent = `You got ${correctCount} out of ${images.length} correct.`;

  setTimeout(() => {
    location.reload();
  }, 7000);
}
