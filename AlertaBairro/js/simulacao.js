/* ============================================================
   simulacao.js
   Simulação interativa: o usuário informa a chuva prevista e o
   sistema calcula o risco de cada bairro (array "bairros") e
   mostra o resultado na página pelo DOM.
   ============================================================ */

(function () {
  const formSimulacao = document.getElementById("form-simulacao");
  if (!formSimulacao) {
    return;
  }

  const selBairro = document.getElementById("sel-bairro");
  const inputChuva = document.getElementById("chuva");
  const saidaChuva = document.getElementById("chuva-valor");
  const checkRio = document.getElementById("rio-alto");
  const selFiltro = document.getElementById("filtro-nivel");
  const selOrdem = document.getElementById("ordem");
  const botaoLimpar = document.getElementById("btn-limpar");
  const resumo = document.getElementById("resumo");
  const lista = document.getElementById("lista-bairros");
  const painel = document.getElementById("painel-bairro");

  // Guarda os dados da última simulação (usado pelo painel de orientações)
  let ultimaChuva = 0;
  let ultimoRioAlto = false;

  // Preenche o select de bairros a partir do array
  function preencherBairros() {
    for (let i = 0; i < bairros.length; i++) {
      const opcao = document.createElement("option");
      opcao.value = String(bairros[i].id);
      opcao.textContent = bairros[i].nome;
      selBairro.appendChild(opcao);
    }
  }

  // Preenche o filtro de níveis a partir do array de níveis
  function preencherNiveis() {
    for (let i = 0; i < niveis.length; i++) {
      const opcao = document.createElement("option");
      opcao.value = niveis[i].id;
      opcao.textContent = niveis[i].nome;
      selFiltro.appendChild(opcao);
    }
  }

  // Monta a mensagem curta que seria enviada por SMS/WhatsApp
  function montarMensagem(bairro, pontos, nivel, chuva) {
    return "ALERTA " + nivel.nome.toUpperCase() + " - " + bairro.nome +
      ": chuva de " + chuva + " mm em 24h (risco " + pontos + "/100). " +
      "Ponto de apoio: " + bairro.pontoApoio + ". Emergência: 199.";
  }

  // Mostra o painel com orientações de um bairro
  function mostrarPainel(item) {
    painel.textContent = "";

    const titulo = document.createElement("h3");
    titulo.textContent = item.nome + " — nível " + item.nivel.nome;
    painel.appendChild(titulo);

    const subtitulo = document.createElement("p");
    subtitulo.textContent = "O que fazer agora:";
    painel.appendChild(subtitulo);

    const ul = document.createElement("ul");
    for (let i = 0; i < item.nivel.orientacoes.length; i++) {
      const li = document.createElement("li");
      li.textContent = item.nivel.orientacoes[i];
      ul.appendChild(li);
    }
    painel.appendChild(ul);

    const apoio = document.createElement("p");
    apoio.textContent = "Ponto de apoio mais próximo: " + item.pontoApoio + ".";
    painel.appendChild(apoio);

    const titMsg = document.createElement("p");
    titMsg.textContent = "Mensagem enviada por SMS (funciona sem internet):";
    painel.appendChild(titMsg);

    const msg = document.createElement("p");
    msg.className = "mensagem-alerta";
    msg.textContent = montarMensagem(item, item.pontos, item.nivel, ultimaChuva);
    painel.appendChild(msg);

    painel.focus();
  }

  // Cria o cartão de um bairro
  function criarCartao(item) {
    const cartao = document.createElement("article");
    cartao.className = "cartao-bairro nivel-" + item.nivel.id;

    const titulo = document.createElement("h3");
    titulo.textContent = item.nome;
    cartao.appendChild(titulo);

    const regiao = document.createElement("p");
    regiao.className = "regiao";
    regiao.textContent = item.regiao + " · " + formatarNumero(item.populacao) + " moradores";
    cartao.appendChild(regiao);

    const selo = document.createElement("span");
    selo.className = "selo-nivel";
    selo.textContent = "Nível " + item.nivel.nome;
    cartao.appendChild(selo);

    const barra = document.createElement("progress");
    barra.max = 100;
    barra.value = item.pontos;
    barra.setAttribute("aria-label", "Índice de risco de " + item.nome);
    barra.textContent = item.pontos + "%";
    cartao.appendChild(barra);

    const indice = document.createElement("p");
    indice.textContent = "Índice de risco: " + item.pontos + " de 100";
    cartao.appendChild(indice);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn btn-sec";
    botao.textContent = "Ver orientações";
    botao.setAttribute("aria-label", "Ver orientações para " + item.nome);
    botao.addEventListener("click", function () {
      mostrarPainel(item);
    });
    cartao.appendChild(botao);

    return cartao;
  }

  // Calcula tudo e redesenha a lista
  function simular() {
    const chuva = Number(inputChuva.value);
    const rioAlto = checkRio.checked;
    const filtroBairro = selBairro.value;
    const filtroNivel = selFiltro.value;
    const ordem = selOrdem.value;

    ultimaChuva = chuva;
    ultimoRioAlto = rioAlto;

    // 1) calcula o risco de todos os bairros
    const resultados = [];
    for (let i = 0; i < bairros.length; i++) {
      const b = bairros[i];
      const pontos = calcularRisco(b, chuva, rioAlto);
      resultados.push({
        id: b.id,
        nome: b.nome,
        regiao: b.regiao,
        populacao: b.populacao,
        pontoApoio: b.pontoApoio,
        pontos: pontos,
        nivel: classificar(pontos)
      });
    }

    // 2) resumo (considera todos os bairros)
    let bairrosEmRisco = 0;
    let moradoresEmRisco = 0;
    for (let i = 0; i < resultados.length; i++) {
      if (resultados[i].pontos >= 50) {
        bairrosEmRisco = bairrosEmRisco + 1;
        moradoresEmRisco = moradoresEmRisco + resultados[i].populacao;
      }
    }

    // 3) aplica filtros
    const filtrados = resultados.filter(function (item) {
      const passaBairro = filtroBairro === "todos" || String(item.id) === filtroBairro;
      const passaNivel = filtroNivel === "todos" || item.nivel.id === filtroNivel;
      return passaBairro && passaNivel;
    });

    // 4) ordena
    filtrados.sort(function (a, b) {
      if (ordem === "nome") {
        return a.nome.localeCompare(b.nome, "pt-BR");
      }
      return b.pontos - a.pontos;
    });

    // 5) mostra o resumo
    if (bairrosEmRisco === 0) {
      resumo.textContent = "Com " + chuva + " mm de chuva, nenhum bairro chega ao nível alto. Continue acompanhando.";
    } else {
      resumo.textContent = "Com " + chuva + " mm de chuva, " + bairrosEmRisco +
        " de " + bairros.length + " bairros ficam em nível alto ou crítico — cerca de " +
        formatarNumero(moradoresEmRisco) + " moradores precisam ser avisados.";
    }

    // 6) desenha os cartões
    lista.textContent = "";
    painel.textContent = "";
    if (filtrados.length === 0) {
      const vazio = document.createElement("p");
      vazio.textContent = "Nenhum bairro encontrado com esses filtros. Escolha \"Todos\" para ver a lista completa.";
      lista.appendChild(vazio);
    } else {
      for (let i = 0; i < filtrados.length; i++) {
        lista.appendChild(criarCartao(filtrados[i]));
      }
    }
  }

  // Eventos
  inputChuva.addEventListener("input", function () {
    saidaChuva.textContent = inputChuva.value + " mm";
  });

  formSimulacao.addEventListener("submit", function (evento) {
    evento.preventDefault();
    simular();
  });

  // Também atualiza ao mudar qualquer controle (resposta imediata)
  selBairro.addEventListener("change", simular);
  selFiltro.addEventListener("change", simular);
  selOrdem.addEventListener("change", simular);
  checkRio.addEventListener("change", simular);
  inputChuva.addEventListener("change", simular);

  botaoLimpar.addEventListener("click", function () {
    formSimulacao.reset();
    saidaChuva.textContent = inputChuva.value + " mm";
    simular();
  });

  // Início
  preencherBairros();
  preencherNiveis();
  inputChuva.value = 60;
  saidaChuva.textContent = inputChuva.value + " mm";
  simular();
})();
