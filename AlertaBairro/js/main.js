/* ============================================================
   main.js
   Código comum a todas as páginas:
   - menu no celular
   - acessibilidade: tamanho da fonte e alto contraste
   ============================================================ */

(function () {
  const html = document.documentElement;
  html.classList.add("js");

  // ---------- Menu no celular ----------
  const botaoMenu = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu-principal");

  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", function () {
      const aberto = menu.classList.toggle("aberto");
      botaoMenu.setAttribute("aria-expanded", String(aberto));
    });

    // Fecha o menu com a tecla Esc
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && menu.classList.contains("aberto")) {
        menu.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.focus();
      }
    });
  }

  // ---------- Preferências de acessibilidade ----------
  const NIVEL_MIN = 0;
  const NIVEL_MAX = 4;
  let nivelFonte = 1;
  let altoContraste = false;

  const botaoMais = document.getElementById("fonte-mais");
  const botaoMenos = document.getElementById("fonte-menos");
  const botaoContraste = document.getElementById("alto-contraste");

  // Lê preferências salvas (se o navegador permitir)
  try {
    const salvoFonte = localStorage.getItem("ab-fonte");
    const salvoContraste = localStorage.getItem("ab-contraste");
    if (salvoFonte !== null) {
      const lido = Number(salvoFonte);
      // aceita só níveis válidos (0 a 4)
      if (Number.isInteger(lido) && lido >= NIVEL_MIN && lido <= NIVEL_MAX) {
        nivelFonte = lido;
      }
    }
    altoContraste = salvoContraste === "sim";
  } catch (erro) {
    // sem localStorage: segue com os valores padrão
  }

  function aplicarPreferencias() {
    for (let i = NIVEL_MIN; i <= NIVEL_MAX; i++) {
      html.classList.remove("fonte-" + i);
    }
    html.classList.add("fonte-" + nivelFonte);
    html.classList.toggle("alto-contraste", altoContraste);

    if (botaoContraste) {
      botaoContraste.setAttribute("aria-pressed", String(altoContraste));
    }
    if (botaoMais) {
      botaoMais.disabled = nivelFonte >= NIVEL_MAX;
    }
    if (botaoMenos) {
      botaoMenos.disabled = nivelFonte <= NIVEL_MIN;
    }

    try {
      localStorage.setItem("ab-fonte", String(nivelFonte));
      localStorage.setItem("ab-contraste", altoContraste ? "sim" : "nao");
    } catch (erro) {
      // ignora
    }
  }

  if (botaoMais) {
    botaoMais.addEventListener("click", function () {
      if (nivelFonte < NIVEL_MAX) {
        nivelFonte = nivelFonte + 1;
        aplicarPreferencias();
      }
    });
  }
  if (botaoMenos) {
    botaoMenos.addEventListener("click", function () {
      if (nivelFonte > NIVEL_MIN) {
        nivelFonte = nivelFonte - 1;
        aplicarPreferencias();
      }
    });
  }
  if (botaoContraste) {
    botaoContraste.addEventListener("click", function () {
      altoContraste = !altoContraste;
      aplicarPreferencias();
    });
  }

  aplicarPreferencias();
})();
