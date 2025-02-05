const questions = [
    { question: "What cannot be shared will be...", answer: "lost" },
    { question: "The opposite of dark is...", answer: "light" },
    { question: "To be or not to be, that is the...", answer: "question" },
    { question: "The largest planet in our solar system?", answer: "jupiter" },
    { question: "The capital of France?", answer: "paris" },
    { question: "A color made by mixing red and blue?", answer: "purple" },
    { question: "The currency of the USA?", answer: "dollar" },
    { question: "A shape with three sides?", answer: "triangle" },
    { question: "The chemical symbol for water?", answer: "h2o" },
    { question: "The planet closest to the sun?", answer: "mercury" },
    { question: "The tallest animal on Earth?", answer: "giraffe" },
    { question: "A fruit that's yellow and curved?", answer: "banana" },
    { question: "The opposite of hot?", answer: "cold" },
    { question: "The smallest prime number?", answer: "two" },
    { question: "The color of the sky on a clear day?", answer: "blue" }
  ];
  
  let currentIndex = 0;
  let currentAnswer = [];
  let score = 0;
  let timer = 30;
  let interval;
  
  function startGame() {
    if (interval) {
        clearInterval(interval);
      }
    if (currentIndex >= questions.length) {
      stopGame("Congratulations! You won the game!");
      return;
    }
  
    // Reset timer and score display
    timer = 30;
    document.querySelector("#timer").innerText = timer;
  
    const { question, answer } = questions[currentIndex];
    document.querySelector("#question-text").innerHTML = question;
    document.querySelector(".answer-slots").innerHTML = "";
    document.querySelector("#letters-grid").innerHTML = "";
    document.querySelector("#feedback").innerText = "";
  
    currentAnswer = Array(answer.length).fill("");
  
    answer.split("").forEach((_, i) => {
      const slot = document.createElement("div");
      slot.className = "slot";
      slot.dataset.slotIndex = i;
      slot.addEventListener("click", () => removeLetter(slot));
      document.querySelector(".answer-slots").appendChild(slot);
    });
  
    const allLetters = [...answer.toUpperCase(), ...Array(10).fill(null).map(getRandomLetter)].sort(() => Math.random() - 0.5);
  
    allLetters.forEach(letter => {
      const btn = document.createElement("button");
      btn.className = "letter-btn";
      btn.innerText = letter;
      btn.addEventListener("click", () => selectLetter(btn, letter));
      document.querySelector("#letters-grid").appendChild(btn);
    });
  
    // Start the timer
    interval = setInterval(() => {
      timer--;
      document.querySelector("#timer").innerText = timer;
      if (timer === 0) {
        stopGame("Time's up! Game over.");
      }
    }, 1000);
  }
  
  function selectLetter(button, letter) {
    const emptyIndex = currentAnswer.findIndex(l => l === "");
    if (emptyIndex !== -1) {
      currentAnswer[emptyIndex] = letter;
      const slot = document.querySelector(`[data-slot-index='${emptyIndex}']`);
      slot.innerText = letter;
      slot.dataset.letter = letter;
      button.classList.add("used");
      button.disabled = true;
  
      if (currentAnswer.join("").toLowerCase() === questions[currentIndex].answer) {
        document.querySelectorAll(".slot").forEach(s => s.classList.add("correct"));
        score += 10;
        document.querySelector("#score").innerText = score;
        document.querySelector("#feedback").innerText = "Correct! Well done!";
        currentIndex++;
        setTimeout(() => {
          startGame();
          checkWin();
        }, 1000);
      } else if (!currentAnswer.includes("") && currentAnswer.join("").toLowerCase() !== questions[currentIndex].answer) {
        document.querySelectorAll(".slot").forEach(s => s.classList.add("incorrect"));
        document.querySelector("#feedback").innerText = "Incorrect! Try again.";
      }
    }
  }
  
  function removeLetter(slot) {
    const letter = slot.dataset.letter;
    if (letter) {
      currentAnswer[slot.dataset.slotIndex] = "";
      slot.innerText = "";
      slot.classList.remove("correct", "incorrect");
  
      const button = [...document.querySelectorAll(".letter-btn")].find(btn => btn.innerText === letter && btn.classList.contains("used"));
      if (button) {
        button.classList.remove("used");
        button.disabled = false;
      }
    }
  }
  
  function showHint() {
    const answer = questions[currentIndex].answer.toUpperCase();
    const hintLetter = answer[Math.floor(Math.random() * answer.length)];
    const hintIndex = answer.indexOf(hintLetter);
  
    if (currentAnswer[hintIndex] === "") {
      currentAnswer[hintIndex] = hintLetter;
      const slot = document.querySelector(`[data-slot-index='${hintIndex}']`);
      slot.innerText = hintLetter;
      slot.dataset.letter = hintLetter;
  
      const button = [...document.querySelectorAll(".letter-btn")].find(btn => btn.innerText === hintLetter && !btn.classList.contains("used"));
      if (button) {
        button.classList.add("used");
        button.disabled = true;
      }
    }
  }
  
  function clearAnswer() {
    currentAnswer = Array(questions[currentIndex].answer.length).fill("");
    document.querySelectorAll(".slot").forEach(slot => {
      slot.innerText = "";
      slot.classList.remove("correct", "incorrect");
    });
  
    document.querySelectorAll(".letter-btn").forEach(btn => {
      btn.classList.remove("used");
      btn.disabled = false;
    });
  
    document.querySelector("#feedback").innerText = "";
  }
  
  function stopGame(message) {
    clearInterval(interval);
    document.querySelector("#game-over-text").innerText = message;
    document.querySelector("#game-over-message").style.display = "block";
    document.querySelectorAll(".letter-btn").forEach(btn => btn.disabled = true);
    document.querySelectorAll(".slot").forEach(slot => slot.removeEventListener("click", removeLetter));
  }
  
  function restartGame() {
    currentIndex = 0;
    score = 0;
    document.querySelector("#score").innerText = score;
    document.querySelector("#game-over-message").style.display = "none";
    startGame();
  }
  
  function getRandomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }
  
  startGame();