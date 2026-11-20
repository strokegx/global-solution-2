/* ============================================================
   impacto.js
   Calcula o impacto estimado da solução com base no array
   "bairros", para três cenários de chuva.
   ============================================================ */

(function () {
  const secao = document.getElementById("cenarios");
  if (!secao) {
    return;
  }

  const botoes = secao.querySelectorAll("button[data-chuva]");
  const textoCenario = document.getElementById("texto-cenario");
  const listaNiveis = document.getElementById("lista-niveis");

  const totalBairros = document.getElementById("m-bairros");
  const totalMoradores = document.getElementById("m-moradores");
  const totalVulneraveis = document.getElementById("m-vulneraveis");

  // Métricas fixas, calculadas a partir do array
  let moradores = 0;
  let moradoresVulneraveis = 0;
  for (let i = 0; i < bairros.length; i++) {
    moradores = moradores + bairros[i].populacao;
    if (bairros[i].vulnerabilidade >= 4) {
      moradoresVulneraveis = moradoresVulneraveis + bairros[i].populacao;
    }
  }
  totalBairros.textContent = String(bairros.length);
  totalMoradores.textContent = formatarNumero(moradores);
  totalVulneraveis.textContent = formatarNumero(moradoresVulneraveis);

  // Mostra quantas pessoas ficam em cada nível para a chuva escolhida
  function mostrarCenario(chuva, nomeCenario) {
    const somaPorNivel = {};
    for (let i = 0; i < niveis.length; i++) {
      somaPorNivel[niveis[i].id] = 0;
    }

    for (let i = 0; i < bairros.length; i++) {
      const pontos = calcularRisco(bairros[i], chuva, true);
      const nivel = classificar(pontos);
      somaPorNivel[nivel.id] = somaPorNivel[nivel.id] + bairros[i].populacao;
    }

    textoCenario.textContent = "Cenário \"" + nomeCenario + "\": " + chuva + " mm em 24h, com o rio acima do normal. " +
      "Veja quantos moradores cada nível de alerta precisaria avisar.";

    listaNiveis.textContent = "";
    for (let i = 0; i < niveis.length; i++) {
      const nivel = niveis[i];
      const qtd = somaPorNivel[nivel.id];
      const percentual = Math.round(qtd / moradores * 100);

      const item = document.createElement("li");
      item.className = "cartao-bairro nivel-" + nivel.id;

      const titulo = document.createElement("strong");
      titulo.textContent = "Nível " + nivel.nome + ": " + formatarNumero(qtd) + " moradores (" + percentual + "%)";
      item.appendChild(titulo);

      const barra = document.createElement("progress");
      barra.max = 100;
      barra.value = percentual;
      barra.setAttribute("aria-label", "Percentual de moradores no nível " + nivel.nome);
      barra.textContent = percentual + "%";
      item.appendChild(barra);

      listaNiveis.appendChild(item);
    }
  }

  for (let i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener("click", function () {
      for (let j = 0; j < botoes.length; j++) {
        botoes[j].setAttribute("aria-pressed", "false");
      }
      botoes[i].setAttribute("aria-pressed", "true");
      mostrarCenario(Number(botoes[i].getAttribute("data-chuva")), botoes[i].getAttribute("data-nome"));
    });
  }

  // Estado inicial: primeiro botão
  botoes[0].click();
})();
