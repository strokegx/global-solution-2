/* ============================================================
   formulario.js
   Cadastro para receber alertas, com validação em JavaScript.
   As mensagens de erro e de sucesso aparecem na própria página
   (sem alert()).
   ============================================================ */

(function () {
  const form = document.getElementById("form-cadastro");
  if (!form) {
    return;
  }

  const campoNome = document.getElementById("nome");
  const campoTelefone = document.getElementById("telefone");
  const campoBairro = document.getElementById("cad-bairro");
  const campoAceite = document.getElementById("aceite");
  const radiosCanal = document.getElementsByName("canal");
  const mensagem = document.getElementById("msg-form");

  // Preenche a lista de bairros a partir do array de dados
  for (let i = 0; i < bairros.length; i++) {
    const opcao = document.createElement("option");
    opcao.value = String(bairros[i].id);
    opcao.textContent = bairros[i].nome;
    campoBairro.appendChild(opcao);
  }

  // Mostra ou limpa o erro de um campo
  function mostrarErro(campo, idErro, texto) {
    const area = document.getElementById(idErro);
    area.textContent = texto;
    if (campo) {
      campo.classList.add("invalido");
      campo.setAttribute("aria-invalid", "true");
    }
  }

  function limparErro(campo, idErro) {
    const area = document.getElementById(idErro);
    area.textContent = "";
    if (campo) {
      campo.classList.remove("invalido");
      campo.removeAttribute("aria-invalid");
    }
  }

  // Cada função devolve true (campo válido) ou false (inválido)
  function validarNome() {
    const valor = campoNome.value.trim();
    if (valor === "") {
      mostrarErro(campoNome, "erro-nome", "Informe seu nome completo.");
      return false;
    }
    if (valor.length < 3 || valor.indexOf(" ") === -1) {
      mostrarErro(campoNome, "erro-nome", "Digite nome e sobrenome (mínimo de 3 letras).");
      return false;
    }
    limparErro(campoNome, "erro-nome");
    return true;
  }

  function validarTelefone() {
    const digitos = campoTelefone.value.replace(/\D/g, "");
    if (digitos === "") {
      mostrarErro(campoTelefone, "erro-telefone", "Informe um telefone com DDD.");
      return false;
    }
    if (digitos.length < 10 || digitos.length > 11) {
      mostrarErro(campoTelefone, "erro-telefone", "O telefone deve ter DDD + 8 ou 9 dígitos. Exemplo: (11) 91234-5678.");
      return false;
    }
    limparErro(campoTelefone, "erro-telefone");
    return true;
  }

  function validarBairro() {
    if (campoBairro.value === "") {
      mostrarErro(campoBairro, "erro-bairro", "Escolha o bairro onde você mora.");
      return false;
    }
    limparErro(campoBairro, "erro-bairro");
    return true;
  }

  function canalEscolhido() {
    for (let i = 0; i < radiosCanal.length; i++) {
      if (radiosCanal[i].checked) {
        return radiosCanal[i].value;
      }
    }
    return "";
  }

  function validarCanal() {
    if (canalEscolhido() === "") {
      mostrarErro(null, "erro-canal", "Escolha como prefere receber o alerta.");
      return false;
    }
    limparErro(null, "erro-canal");
    return true;
  }

  function validarAceite() {
    if (!campoAceite.checked) {
      mostrarErro(campoAceite, "erro-aceite", "Para receber alertas, aceite o uso do telefone para este fim.");
      return false;
    }
    limparErro(campoAceite, "erro-aceite");
    return true;
  }

  // Valida ao sair do campo (feedback imediato)
  campoNome.addEventListener("blur", validarNome);
  campoTelefone.addEventListener("blur", validarTelefone);
  campoBairro.addEventListener("change", validarBairro);
  campoAceite.addEventListener("change", validarAceite);
  for (let i = 0; i < radiosCanal.length; i++) {
    radiosCanal[i].addEventListener("change", validarCanal);
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensagem.textContent = "";
    mensagem.className = "mensagem-form";

    // Roda todas as validações (sem parar na primeira)
    const resultados = [
      { ok: validarNome(), campo: campoNome },
      { ok: validarTelefone(), campo: campoTelefone },
      { ok: validarBairro(), campo: campoBairro },
      { ok: validarCanal(), campo: radiosCanal[0] },
      { ok: validarAceite(), campo: campoAceite }
    ];

    let primeiroInvalido = null;
    let quantosErros = 0;
    for (let i = 0; i < resultados.length; i++) {
      if (!resultados[i].ok) {
        quantosErros = quantosErros + 1;
        if (primeiroInvalido === null) {
          primeiroInvalido = resultados[i].campo;
        }
      }
    }

    if (quantosErros > 0) {
      mensagem.classList.add("falha");
      mensagem.textContent = "Corrija " + quantosErros + (quantosErros === 1 ? " campo" : " campos") + " destacado" + (quantosErros === 1 ? "" : "s") + " e envie novamente.";
      primeiroInvalido.focus();
      return;
    }

    // Tudo certo: mostra o sucesso
    const nomeBairro = campoBairro.options[campoBairro.selectedIndex].textContent;
    const primeiroNome = campoNome.value.trim().split(" ")[0];
    mensagem.classList.add("sucesso");
    mensagem.textContent = "Cadastro feito, " + primeiroNome + "! Você vai receber os alertas de " +
      nomeBairro + " por " + canalEscolhido() + ". (Protótipo: nenhum dado foi guardado ou enviado.)";
    form.reset();
    mensagem.focus();
  });
})();
