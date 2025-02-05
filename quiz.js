class Question {
    constructor(text, points) {
      this.text = text;
      this.points = points;
    }
  }
  
  class MultipleChoiceQuestion extends Question {
    constructor(text, points, options, correctAnswer) {
      super(text, points);
      this.options = options; // Array of strings
      this.correctAnswer = correctAnswer; // Index (0-based)
    }
  
    checkAnswer(selectedIndex) {
      return selectedIndex === this.correctAnswer;
    }
  }
  
  class TrueFalseQuestion extends Question {
    constructor(text, points, correctAnswer) {
      super(text, points);
      this.correctAnswer = correctAnswer; // true/false
    }
  
    checkAnswer(selectedBool) {
      return selectedBool === this.correctAnswer;
    }
  }
  
  class Quiz {
    constructor(questions) {
      this.questions = questions;
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.timeLeft = 10;
      this.timerId = null;
    }
  
    startTimer() {
      this.timeLeft = 10;
      const timerElement = document.getElementById('timer');
      timerElement.textContent = this.timeLeft;
  
      this.timerId = setInterval(() => {
        this.timeLeft--;
        timerElement.textContent = this.timeLeft;
        if (this.timeLeft <= 0) {
          this.handleTimeOut();
        }
      }, 1000);
    }
  
    handleTimeOut() {
      clearInterval(this.timerId);
      this.nextQuestion();
    }
  
    displayQuestion() {
      const question = this.questions[this.currentQuestionIndex];
      const questionElement = document.getElementById('question');
      const optionsElement = document.getElementById('options');
      
      questionElement.innerHTML = question.text;
      optionsElement.innerHTML = '';
  
      if (question instanceof MultipleChoiceQuestion) {
        question.options.forEach((option, index) => {
          const button = document.createElement('button');
          button.className = 'option-btn';
          button.innerHTML = option;
          button.onclick = () => this.handleAnswer(index);
          optionsElement.appendChild(button);
        });
      } else if (question instanceof TrueFalseQuestion) {
        ['True', 'False'].forEach((option, index) => {
          const button = document.createElement('button');
          button.className = 'option-btn';
          button.innerHTML = option;
          button.onclick = () => this.handleAnswer(option === 'True');
          optionsElement.appendChild(button);
        });
      }
  
      this.startTimer();
      this.updateProgress();
    }
  
    handleAnswer(userAnswer) {
      clearInterval(this.timerId);
      const question = this.questions[this.currentQuestionIndex];
      const isCorrect = question.checkAnswer(userAnswer);
  
      // Visual feedback
      const options = document.querySelectorAll('.option-btn');
      options.forEach(btn => btn.disabled = true);
      if (isCorrect) {
        this.score += question.points;
        document.getElementById('score').textContent = this.score;
      } else {
        this.score = Math.max(0, this.score - question.points / 2);
        document.getElementById('score').textContent = this.score;
      }
  
      // Highlight correct/incorrect answers
      // (Add logic based on question type)
    }
  
    nextQuestion() {
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex < this.questions.length) {
        this.displayQuestion();
      } else {
        this.endQuiz();
      }
    }
  
    updateProgress() {
      const progress = (this.currentQuestionIndex / this.questions.length) * 100;
      document.querySelector('.progress').style.width = `${progress}%`;
    }
  
    endQuiz() {
      document.getElementById('question').innerHTML = `Quiz Over! Final Score: ${this.score}`;
      document.getElementById('options').innerHTML = '';
      document.getElementById('next-btn').style.display = 'none';
    }
  }
  
  // Sample Questions (in English)
  const questions = [
    new MultipleChoiceQuestion(
      "What is the capital of France?",
      10,
      ["London", "Berlin", "Paris", "Madrid"],
      2
    ),
    new TrueFalseQuestion(
      "The Earth is flat.",
      10,
      false
    )
  ];
  
  // Start the quiz
  const quiz = new Quiz(questions);
  quiz.displayQuestion();
  
  // Next button listener
  document.getElementById('next-btn').addEventListener('click', () => quiz.nextQuestion());