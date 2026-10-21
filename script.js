// NEXUS FINANCE
// O conteúdo está no index.html. Este arquivo cuida apenas das interações.
// querySelector encontra um elemento; querySelectorAll encontra uma lista.

// 1. MENU DO CELULAR
const botaoMenu = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
const iconeMenu = botaoMenu.querySelector('.icon');
const linksMenu = document.querySelectorAll('#menu a');

function fecharMenu() {
  menu.classList.remove('open');
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.setAttribute('aria-label', 'Abrir menu');
  iconeMenu.textContent = 'menu';
}

function alternarMenu() {
  if (menu.classList.contains('open')) {
    fecharMenu();
  } else {
    menu.classList.add('open');
    botaoMenu.setAttribute('aria-expanded', 'true');
    botaoMenu.setAttribute('aria-label', 'Fechar menu');
    iconeMenu.textContent = 'close';
  }
}

botaoMenu.addEventListener('click', alternarMenu);

for (const link of linksMenu) {
  link.addEventListener('click', fecharMenu);
}

document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape') {
    fecharMenu();
  }
});

// 2. PAUSAR E RETOMAR O FUNDO ANIMADO
const video = document.querySelector('#background-video');
const botaoAnimacao = document.querySelector('#motion-toggle');
const iconeAnimacao = botaoAnimacao.querySelector('.icon');
const textoAnimacao = botaoAnimacao.querySelector('span:last-child');

// Algumas pessoas configuram o aparelho para reduzir animações.
const preferenciaMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

function controlarAnimacao(pausar) {
  if (pausar) {
    video.pause();
    document.body.classList.add('motion-paused');
    botaoAnimacao.setAttribute('aria-pressed', 'true');
    iconeAnimacao.textContent = 'play_arrow';
    textoAnimacao.textContent = 'Ativar animação';
  } else {
    document.body.classList.remove('motion-paused');
    botaoAnimacao.setAttribute('aria-pressed', 'false');
    iconeAnimacao.textContent = 'pause';
    textoAnimacao.textContent = 'Pausar animação';

    // Se o navegador bloquear a reprodução, a imagem de fundo continua visível.
    video.play().catch(function () {
      controlarAnimacao(true);
    });
  }
}

botaoAnimacao.addEventListener('click', function () {
  const estaPausado = botaoAnimacao.getAttribute('aria-pressed') === 'true';
  controlarAnimacao(!estaPausado);
});

preferenciaMovimento.addEventListener('change', function () {
  controlarAnimacao(preferenciaMovimento.matches);
});

controlarAnimacao(preferenciaMovimento.matches);

// 3. TROCAR AS TELAS DEMONSTRATIVAS
// Cada botão aponta para um painel pelo atributo aria-controls do HTML.
const botoesTelas = document.querySelectorAll('.screen-tabs button');
const paineisTelas = document.querySelectorAll('.screen-panel');

function mostrarTela(botaoEscolhido) {
  for (const painel of paineisTelas) {
    painel.hidden = true;
  }

  for (const botao of botoesTelas) {
    botao.setAttribute('aria-selected', 'false');
    botao.tabIndex = -1;
  }

  const idPainel = botaoEscolhido.getAttribute('aria-controls');
  document.getElementById(idPainel).hidden = false;
  botaoEscolhido.setAttribute('aria-selected', 'true');
  botaoEscolhido.tabIndex = 0;
}

for (let numero = 0; numero < botoesTelas.length; numero++) {
  const botao = botoesTelas[numero];

  botao.addEventListener('click', function () {
    mostrarTela(botao);
  });

  // Permite usar as abas com as setas do teclado, além do mouse e do toque.
  botao.addEventListener('keydown', function (evento) {
    let proximaTela = numero;

    if (evento.key === 'ArrowRight' || evento.key === 'ArrowDown') {
      proximaTela = numero + 1;
    } else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowUp') {
      proximaTela = numero - 1;
    } else if (evento.key === 'Home') {
      proximaTela = 0;
    } else if (evento.key === 'End') {
      proximaTela = botoesTelas.length - 1;
    } else {
      return;
    }

    evento.preventDefault();

    if (proximaTela >= botoesTelas.length) {
      proximaTela = 0;
    }
    if (proximaTela < 0) {
      proximaTela = botoesTelas.length - 1;
    }

    mostrarTela(botoesTelas[proximaTela]);
    botoesTelas[proximaTela].focus();
  });
}

// 4. MOSTRAR OS ELEMENTOS SUAVEMENTE DURANTE A ROLAGEM
// IntersectionObserver avisa quando um elemento entra na área visível.
if ('IntersectionObserver' in window) {
  const observadorAnimacao = new IntersectionObserver(function (elementos) {
    for (const elemento of elementos) {
      if (elemento.isIntersecting) {
        elemento.target.classList.add('is-visible');
        observadorAnimacao.unobserve(elemento.target);
      }
    }
  }, { threshold: 0.08 });

  document.body.classList.add('js-ativo');

  const elementosAnimados = document.querySelectorAll('.reveal');
  for (const elemento of elementosAnimados) {
    observadorAnimacao.observe(elemento);
  }

  // 5. DESTACAR NO MENU A SEÇÃO QUE ESTÁ SENDO LIDA
  const observadorMenu = new IntersectionObserver(function (secoes) {
    for (const secao of secoes) {
      if (secao.isIntersecting) {
        for (const link of linksMenu) {
          if (link.getAttribute('href') === '#' + secao.target.id) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'location');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        }
      }
    }
  }, { rootMargin: '-15% 0px -60% 0px' });

  const secoes = document.querySelectorAll('section[id]');
  for (const secao of secoes) {
    observadorMenu.observe(secao);
  }
}
