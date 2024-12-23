// Função para criar os sparkles
function createSparkles() {
    const sparklesContainer = document.querySelector('.sparkles');
    if (!sparklesContainer) return;

    const numberOfSparkles = 20;
    for (let i = 0; i < numberOfSparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = (Math.random() * 2) + 's';
        sparklesContainer.appendChild(sparkle);
    }
}

// Inicialização principal
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicializa AOS com configurações otimizadas para mobile
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: false, // Mudado para false para permitir repetição
                offset: 100, // Reduzido o offset para triggerar mais cedo
                delay: 100, // Delay reduzido
                mirror: true, // Permite animações na rolagem para cima também
                disable: 'mobile', // Desativa em telas muito pequenas
                startEvent: 'DOMContentLoaded'
            });

            // Atualiza AOS quando o conteúdo é carregado
            window.addEventListener('load', () => {
                AOS.refresh();
            });

            // Atualiza AOS durante o scroll
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    AOS.refresh();
                }, 100);
            });
        }

        // Inicializa cartão raspável
        initScratchCard();

        // Efeito de revelar post-its
        const postIts = document.querySelectorAll('.post-it');
        if (postIts.length > 0) {
            let delay = 1000;
            function revealRandomPostIt() {
                const unrevealed = Array.from(postIts).filter(post => !post.classList.contains('revealed'));
                if (unrevealed.length === 0) return;

                const randomIndex = Math.floor(Math.random() * unrevealed.length);
                const postIt = unrevealed[randomIndex];
                
                postIt.classList.add('revealed');
                delay = Math.max(delay * 0.9, 500);
                
                if (unrevealed.length > 1) {
                    setTimeout(revealRandomPostIt, delay);
                }
            }
            setTimeout(revealRandomPostIt, 1000);
        }

        // Configurar envelopes
        setupEnvelopes();

        // Criar sparkles
        createSparkles();

        // Adicionar funcionalidade de revelar memória
        const memoryContent = document.querySelector('.memory-content');
        if (memoryContent) {
            memoryContent.addEventListener('click', () => {
                memoryContent.classList.add('revealed');
            });
        }

        // Inicializar Masonry se disponível
        const mural = document.querySelector('.mural');
        if (mural && typeof Masonry !== 'undefined') {
            const masonry = new Masonry(mural, {
                itemSelector: '.post-it',
                columnWidth: '.post-it',
                percentPosition: true
            });

            // Atualizar layout após carregar imagens
            if (typeof imagesLoaded !== 'undefined') {
                imagesLoaded(mural).on('progress', () => {
                    masonry.layout();
                });
            }
        }

    } catch (error) {
        console.warn('Erro na inicialização:', error);
    }
});

// Função para configurar envelopes
function setupEnvelopes() {
    const letters = {
        1: "Oioi Helozinha,\n\n💜 Espero que você nunca esqueça que é muito especial pra mim. Obrigada por todas as risadas, brincadeiras, ajudas... todos os momentos no geral \n <3 Quero continuar sendo sua amiga por anos e anos.\n\nBeijos,\nMilenny 🌟",
        2: "Querida Helo,\n\n⭐ Você é uma das pessoas mais legais que já conheci, e valorizo cada um dos momentos que vivemos juntos. Que nossa amizade não se acabe nunca. 😔🫶\n\nCom carinho,\nOtavio ✨",
        3: "Querida Helo,\n\n💙 Eu sou realmente péssimo com palavras, mas, cara, não consigo pensar em outra palavra além de sorte. Sorte por ter te conhecido e sorte por ter você na minha vida. Sério, a cada dia que passa, fica ainda mais claro que, sem você, minha vida perderia uns 200% da graça, kkkk. Quando estou com você, tudo parece ganhar mais cor, mais brilho. Não importa se estamos só conversando bosta, rindo de qualquer coisa, ou até mesmo ouvindo você reclamar de tudo e de todos (inclusive de mimkkkk). É engraçado pensar que vc chegou na minha vida tãooo... Do nada? kkkkkkk, ciclos completamente diferentes, mas, ao mesmo tempo, parece que sempre esteve aqui. É engraçado pensar que, antes de você, eu nem sabia o que estava perdendo. Hoje, vc é algo que eu não consigo imaginar sem. Não importa o que aconteça, vc sempre transforma qualquer dia ruim em algo suportável, e qualquer dia bom em algo ainda melhor. Eu admiro tanto você. Sua força, suas conquistas, suas opiniões (mesmo quando são bem.... ne kkk), seu jeito sincero de enxergar as coisas... tudo em você me inspira. E, a cada dia, você se torna alguém ainda mais especial na minha vida, como uma irmã que eu escolhi ter. Não tem como não te amar por tudo isso e muito mais. Helo, quero que você saiba que é muito importante pra mim, e eu espero que nunca, jamais, esqueça disso. Te amo de verdade, e sou muito grato por ter você na minha vida. ❤️.\n\nCom amor,\nKellyson 💫"
    };

    const authors = {
        1: "milenny",
        2: "otavio",
        3: "kellyson"
    };

    document.querySelectorAll('.envelope').forEach(envelope => {
        if (envelope) {
            envelope.addEventListener('click', () => {
                const letterId = envelope.dataset.letter;
                const content = letters[letterId];
                const letterContent = document.querySelector('.letter-content');
                const modalOverlay = document.querySelector('.modal-overlay');
                
                if (letterContent && modalOverlay && content) {
                    letterContent.innerText = content;
                    letterContent.dataset.author = authors[letterId]; // Adiciona o autor
                    modalOverlay.classList.add('active');
                    setTimeout(() => {
                        const letter = document.querySelector('.letter');
                        if (letter) letter.classList.add('show');
                    }, 100);
                }
            });
        }
    });

    const closeButton = document.querySelector('.letter-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const letter = document.querySelector('.letter');
            const modalOverlay = document.querySelector('.modal-overlay');
            
            if (letter) letter.classList.remove('show');
            if (modalOverlay) {
                setTimeout(() => {
                    modalOverlay.classList.remove('active');
                }, 500);
            }
        });
    }
}

// Funcionalidade do Cartão Raspável
function initScratchCard() {
    const containers = document.querySelectorAll('.scratch-card-container');
    
    containers.forEach(container => {
        const canvas = container.querySelector('.scratch-card');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastPoint;

        function setCanvasSize() {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            // Cores diferentes para cada cartão
            const colors = {
                'kellyson-message': '#1976d2',
                'milenny-message': '#7b1fa2',
                'otavio-message': '#f9a825'
            };
            
            const messageElement = container.querySelector('.scratch-message');
            const colorClass = Array.from(messageElement.classList)
                .find(cls => colors[cls]);
            
            ctx.fillStyle = colors[colorClass] || '#ba68c8';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function getPosition(event) {
            const rect = canvas.getBoundingClientRect();
            const point = event.type.includes('touch') ? event.touches[0] : event;
            return {
                x: point.clientX - rect.left,
                y: point.clientY - rect.top
            };
        }

        function drawLine(start, end) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 40;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Verificar área raspada
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let pixels = imageData.data;
            let total = pixels.length / 4;
            let transparent = 0;

            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] < 128) transparent++;
            }

            if (transparent > total * 0.5) {
                canvas.style.transition = 'opacity 0.5s ease';
                canvas.style.opacity = '0';
                setTimeout(() => canvas.style.display = 'none', 500);
            }
        }

        function startDrawing(event) {
            isDrawing = true;
            lastPoint = getPosition(event);
        }

        function draw(event) {
            if (!isDrawing) return;
            event.preventDefault();
            const currentPoint = getPosition(event);
            drawLine(lastPoint, currentPoint);
            lastPoint = currentPoint;
        }

        function stopDrawing() {
            isDrawing = false;
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchcancel', stopDrawing);

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
    });
}
