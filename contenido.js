document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fade-in animation for sections on scroll
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -100px 0px" // Adjust to trigger a bit earlier
    };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Scroll to section for CTA button
    window.scrollToSection = function(id) {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Modal functionality for Quizzes
    const quizModal = document.getElementById('quiz-modal');
    const quizCloseButton = quizModal.querySelector('.close-button');
    const videoQuizButtons = document.querySelectorAll('.video-quiz-button');
    const quizQuestionsContainer = document.getElementById('quiz-questions');
    const submitQuizButton = document.getElementById('submit-quiz-button');
    const quizResult = document.getElementById('quiz-result');

    const quizzes = {
        video1: [
            {
                question: "¿Cuál es la principal causa del cambio climático atribuido a actividades humanas?",
                options: ["Deforestación", "Uso de combustibles fósiles", "Erupciones volcánicas", "Ciclos solares"],
                answer: "Uso de combustibles fósiles"
            },
            {
                question: "¿Qué gas de efecto invernadero es el más abundante en la atmósfera debido a la actividad humana?",
                options: ["Metano", "Óxido nitroso", "Dióxido de carbono", "Ozono"],
                answer: "Dióxido de carbono"
            }
        ],
        video2: [
            {
                question: "¿Qué tipo de energía renovable se obtiene del calor interno de la Tierra?",
                options: ["Eólica", "Solar", "Hidroeléctrica", "Geotérmica"],
                answer: "Geotérmica"
            },
            {
                question: "¿Cuál de las siguientes es una práctica clave de la agricultura sostenible?",
                options: ["Monocultivo intensivo", "Uso excesivo de pesticidas", "Rotación de cultivos", "Quema de rastrojos"],
                answer: "Rotación de cultivos"
            }
        ]
    };

    videoQuizButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoId = button.dataset.videoId;
            loadQuizQuestions(quizzes[videoId]);
            quizModal.classList.add('show-modal');
        });
    });

    quizCloseButton.addEventListener('click', () => {
        quizModal.classList.remove('show-modal');
        quizResult.textContent = ''; // Limpiar resultado al cerrar
    });

    window.addEventListener('click', (event) => {
        if (event.target == quizModal) {
            quizModal.classList.remove('show-modal');
            quizResult.textContent = '';
        }
    });

    function loadQuizQuestions(questions) {
        quizQuestionsContainer.innerHTML = '';
        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('quiz-question-item');
            questionDiv.innerHTML = `
                <p><strong>${index + 1}. ${q.question}</strong></p>
                ${q.options.map((option, i) => `
                    <label>
                        <input type="radio" name="question${index}" value="${option}">
                        ${option}
                    </label>
                `).join('')}
            `;
            quizQuestionsContainer.appendChild(questionDiv);
        });
    }

    submitQuizButton.addEventListener('click', () => {
        let score = 0;
        let allAnswered = true;
        const currentQuizQuestions = quizzes[videoQuizButtons[0].dataset.videoId]; // Asumiendo que el quiz cargado es el del primer botón clickeado

        currentQuizQuestions.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            if (selectedOption) {
                if (selectedOption.value === q.answer) {
                    score++;
                }
            } else {
                allAnswered = false;
            }
        });

        if (!allAnswered) {
            quizResult.style.color = '#D32F2F'; // Rojo para advertencia
            quizResult.textContent = "Por favor, responde todas las preguntas antes de enviar.";
        } else {
            quizResult.style.color = var('--primary-color');
            quizResult.textContent = `Has obtenido ${score} de ${currentQuizQuestions.length} respuestas correctas. ¡Sigue aprendiendo!`;
        }
    });

    // Modal functionality for Games
    const gameModal = document.getElementById('game-modal');
    const gameCloseButton = gameModal.querySelector('.close-button');
    const gameButtons = document.querySelectorAll('.game-button');
    const gameTitle = document.getElementById('game-title');
    const gameContainer = document.getElementById('game-container');
    const gameInstructions = document.getElementById('game-instructions');
    const quizGameQuestionsContainer = document.getElementById('quiz-game-questions');
    const answerInput = document.getElementById('answer-input');
    const checkAnswerButton = document.getElementById('check-answer-button');
    const gameFeedback = document.getElementById('game-feedback');
    const nextQuestionButton = document.getElementById('next-question-button');
    const restartGameButton = document.getElementById('restart-game-button');

    let currentQuestionIndex = 0;
    let currentQuizGame = [];
    let gameType = ''; // 'quiz' or 'typing'

    const games = {
        'eco-clasificador': {
            title: "Eco-Clasificador: ¡Organiza tu Reciclaje!",
            instructions: "Clasifica los siguientes elementos en su contenedor correcto. Escribe 'orgánico', 'plástico', 'papel' o 'vidrio'.",
            type: 'typing',
            questions: [
                { item: "Cáscara de plátano", correct: "orgánico" },
                { item: "Botella de PET", correct: "plástico" },
                { item: "Periódico viejo", correct: "papel" },
                { item: "Botella de refresco de vidrio", correct: "vidrio" },
                { item: "Restos de comida", correct: "orgánico" },
                { item: "Envase de shampoo", correct: "plástico" }
            ]
        },
        'aventuras-sostenibles': {
            title: "Aventuras Sostenibles: El Quiz del Futuro",
            instructions: "Pon a prueba tus conocimientos sobre sostenibilidad con estas preguntas de opción múltiple.",
            type: 'quiz',
            questions: [
                {
                    question: "¿Qué significa la sigla ODS?",
                    options: ["Objetivos de Desarrollo Sostenible", "Organización de Desarrollo Sustentable", "Obras de Diseño Sostenible"],
                    answer: "Objetivos de Desarrollo Sostenible"
                },
                {
                    question: "¿Qué es la huella de carbono?",
                    options: ["La marca que dejas al caminar en la naturaleza", "La cantidad de gases de efecto invernadero emitidos", "Un tipo de contaminante del aire"],
                    answer: "La cantidad de gases de efecto invernadero emitidos"
                }
            ]
        }
    };

    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameId = button.dataset.gameId;
            const game = games[gameId];
            gameType = game.type;

            gameTitle.textContent = game.title;
            gameInstructions.textContent = game.instructions;
            currentQuizGame = game.questions;
            currentQuestionIndex = 0;
            gameFeedback.textContent = '';
            restartGameButton.style.display = 'none';

            if (gameType === 'typing') {
                answerInput.style.display = 'block';
                checkAnswerButton.style.display = 'block';
                quizGameQuestionsContainer.style.display = 'block'; // Asegura que se muestre el contenedor
                nextQuestionButton.style.display = 'none';
                loadTypingQuestion(currentQuestionIndex);
            } else if (gameType === 'quiz') {
                answerInput.style.display = 'none';
                checkAnswerButton.style.display = 'none';
                nextQuestionButton.style.display = 'block';
                loadQuizGameQuestion(currentQuestionIndex);
            }

            gameModal.classList.add('show-modal');
        });
    });

    gameCloseButton.addEventListener('click', () => {
        gameModal.classList.remove('show-modal');
        resetGameModal();
    });

    window.addEventListener('click', (event) => {
        if (event.target == gameModal) {
            gameModal.classList.remove('show-modal');
            resetGameModal();
        }
    });

    function resetGameModal() {
        gameFeedback.textContent = '';
        answerInput.value = '';
        quizGameQuestionsContainer.innerHTML = '';
        answerInput.style.display = 'none';
        checkAnswerButton.style.display = 'none';
        nextQuestionButton.style.display = 'none';
        restartGameButton.style.display = 'none';
    }

    function loadTypingQuestion(index) {
        if (index < currentQuizGame.length) {
            quizGameQuestionsContainer.innerHTML = `<p><strong>Clasifica: ${currentQuizGame[index].item}</strong></p>`;
            answerInput.value = '';
            gameFeedback.textContent = '';
            checkAnswerButton.style.display = 'block';
            nextQuestionButton.style.display = 'none';
            answerInput.focus();
        } else {
            quizGameQuestionsContainer.innerHTML = `<p>¡Juego Terminado! Has clasificado todos los elementos.</p>`;
            answerInput.style.display = 'none';
            checkAnswerButton.style.display = 'none';
            nextQuestionButton.style.display = 'none';
            restartGameButton.style.display = 'block';
        }
    }

    checkAnswerButton.addEventListener('click', () => {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswer = currentQuizGame[currentQuestionIndex].correct.toLowerCase();

        if (userAnswer === correctAnswer) {
            gameFeedback.style.color = '#4CAF50';
            gameFeedback.textContent = "¡Correcto! 🎉";
            nextQuestionButton.style.display = 'block';
            checkAnswerButton.style.display = 'none';
            answerInput.disabled = true; // Deshabilitar input hasta la siguiente pregunta
        } else {
            gameFeedback.style.color = '#D32F2F';
            gameFeedback.textContent = `Incorrecto. La respuesta correcta es "${currentQuizGame[currentQuestionIndex].correct}".`;
            nextQuestionButton.style.display = 'block';
            checkAnswerButton.style.display = 'none';
            answerInput.disabled = true;
        }
    });

    nextQuestionButton.addEventListener('click', () => {
        currentQuestionIndex++;
        answerInput.disabled = false; // Habilitar input para la siguiente pregunta
        if (gameType === 'typing') {
            loadTypingQuestion(currentQuestionIndex);
        } else if (gameType === 'quiz') {
            loadQuizGameQuestion(currentQuestionIndex);
        }
    });

    restartGameButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        gameFeedback.textContent = '';
        answerInput.value = '';
        answerInput.disabled = false;
        if (gameType === 'typing') {
            loadTypingQuestion(currentQuestionIndex);
            answerInput.style.display = 'block';
            checkAnswerButton.style.display = 'block';
        } else if (gameType === 'quiz') {
            loadQuizGameQuestion(currentQuestionIndex);
            nextQuestionButton.style.display = 'block';
        }
        restartGameButton.style.display = 'none';
    });

    function loadQuizGameQuestion(index) {
        if (index < currentQuizGame.length) {
            const q = currentQuizGame[index];
            quizGameQuestionsContainer.innerHTML = `
                <p><strong>${index + 1}. ${q.question}</strong></p>
                <div class="options-container">
                    ${q.options.map((option, i) => `
                        <label>
                            <input type="radio" name="game-question-${index}" value="${option}">
                            ${option}
                        </label>
                    `).join('')}
                </div>
            `;
            gameFeedback.textContent = '';
            nextQuestionButton.textContent = 'Siguiente Pregunta'; // Cambiar texto del botón
            nextQuestionButton.style.display = 'block';

            // Agregar evento para verificar la respuesta seleccionada
            document.querySelectorAll(`input[name="game-question-${index}"]`).forEach(radio => {
                radio.addEventListener('change', () => {
                    const selectedValue = document.querySelector(`input[name="game-question-${index}"]:checked`).value;
                    if (selectedValue === q.answer) {
                        gameFeedback.style.color = '#4CAF50';
                        gameFeedback.textContent = "¡Correcto! 🎉";
                    } else {
                        gameFeedback.style.color = '#D32F2F';
                        gameFeedback.textContent = `Incorrecto. La respuesta correcta es "${q.answer}".`;
                    }
                    // Deshabilitar todas las opciones después de la selección
                    document.querySelectorAll(`input[name="game-question-${index}"]`).forEach(r => r.disabled = true);
                });
            });

        } else {
            quizGameQuestionsContainer.innerHTML = `<p>¡Felicidades! Has completado el quiz de Aventuras Sostenibles.</p>`;
            nextQuestionButton.style.display = 'none';
            restartGameButton.style.display = 'block';
            gameFeedback.textContent = '';
        }
    }
});
