/* ============================================================
   dados.js
   Base de dados do protótipo (array de objetos) e regras de risco.
   ATENÇÃO: os bairros e números abaixo são FICTÍCIOS e servem
   apenas para demonstrar a simulação.
   ============================================================ */

// Array de objetos: 12 bairros fictícios
const bairros = [
  { id: 1,  nome: "Vila Esperança",   regiao: "Zona Leste", populacao: 12400, vulnerabilidade: 5, altitude: 18, pertoDeRio: true,  pontoApoio: "Escola Municipal Paulo Freire" },
  { id: 2,  nome: "Jardim das Águas", regiao: "Zona Sul",   populacao: 9800,  vulnerabilidade: 4, altitude: 22, pertoDeRio: true,  pontoApoio: "Centro Comunitário Boa Vista" },
  { id: 3,  nome: "Morro Alto",       regiao: "Zona Norte", populacao: 7300,  vulnerabilidade: 4, altitude: 95, pertoDeRio: false, pontoApoio: "Igreja São José" },
  { id: 4,  nome: "Parque Central",   regiao: "Centro",     populacao: 15200, vulnerabilidade: 2, altitude: 60, pertoDeRio: false, pontoApoio: "Ginásio Municipal" },
  { id: 5,  nome: "Baixada Verde",    regiao: "Zona Oeste", populacao: 11000, vulnerabilidade: 5, altitude: 12, pertoDeRio: true,  pontoApoio: "UBS Dona Lúcia" },
  { id: 6,  nome: "Alto da Colina",   regiao: "Zona Norte", populacao: 5600,  vulnerabilidade: 2, altitude: 110, pertoDeRio: false, pontoApoio: "Escola Estadual Monteiro Lobato" },
  { id: 7,  nome: "Santa Rita",       regiao: "Zona Sul",   populacao: 8900,  vulnerabilidade: 3, altitude: 35, pertoDeRio: true,  pontoApoio: "Associação de Moradores" },
  { id: 8,  nome: "Cidade Nova",      regiao: "Zona Leste", populacao: 13700, vulnerabilidade: 3, altitude: 48, pertoDeRio: false, pontoApoio: "CEU Cidade Nova" },
  { id: 9,  nome: "Ribeirão Seco",    regiao: "Zona Oeste", populacao: 6200,  vulnerabilidade: 4, altitude: 25, pertoDeRio: true,  pontoApoio: "Quadra da Escola Tiradentes" },
  { id: 10, nome: "Mirante do Sol",   regiao: "Centro",     populacao: 4100,  vulnerabilidade: 1, altitude: 130, pertoDeRio: false, pontoApoio: "Clube Recreativo Mirante" },
  { id: 11, nome: "Vale dos Ipês",    regiao: "Zona Sul",   populacao: 7800,  vulnerabilidade: 3, altitude: 40, pertoDeRio: true,  pontoApoio: "Biblioteca Comunitária" },
  { id: 12, nome: "Conjunto Palmares", regiao: "Zona Norte", populacao: 10300, vulnerabilidade: 2, altitude: 70, pertoDeRio: false, pontoApoio: "Escola Municipal Palmares" }
];

// Níveis de risco: do menor ao maior. "min" é o índice mínimo para entrar no nível.
const niveis = [
  {
    id: "baixo", nome: "Baixo", min: 0,
    orientacoes: [
      "Acompanhe a previsão do tempo nas próximas horas.",
      "Mantenha bueiros e calhas da sua rua desobstruídos.",
      "Deixe o celular carregado e o número da Defesa Civil (199) à mão."
    ]
  },
  {
    id: "atencao", nome: "Atenção", min: 25,
    orientacoes: [
      "Evite passar por ruas e córregos que costumam alagar.",
      "Guarde documentos e remédios em sacos plásticos, em local alto.",
      "Combine com a família qual será o ponto de encontro."
    ]
  },
  {
    id: "alto", nome: "Alto", min: 50,
    orientacoes: [
      "Prepare a saída: documentos, remédios, água e carregador.",
      "Desligue aparelhos da tomada e feche o gás.",
      "Idosos e pessoas com mobilidade reduzida devem pedir ajuda agora."
    ]
  },
  {
    id: "critico", nome: "Crítico", min: 75,
    orientacoes: [
      "Saia agora para o ponto de apoio indicado.",
      "Nunca atravesse água corrente, a pé ou de carro.",
      "Em caso de emergência, ligue 199 (Defesa Civil) ou 193 (Bombeiros)."
    ]
  }
];

/**
 * Fator do território: quanto maior, mais o bairro sofre com a chuva.
 * Considera vulnerabilidade social (1 a 5), proximidade de rio e altitude.
 * Resultado entre 0 e 100.
 */
function calcularFator(bairro) {
  let fator = bairro.vulnerabilidade * 12;
  if (bairro.pertoDeRio) {
    fator = fator + 20;
  }
  if (bairro.altitude < 50) {
    fator = fator + (50 - bairro.altitude) * 0.4;
  }
  return fator;
}

/**
 * Índice de risco (0 a 100) para uma chuva acumulada em 24h (mm).
 * Se o rio já está acima do normal, o risco aumenta 25%.
 */
function calcularRisco(bairro, chuvaMm, rioAlto) {
  let pontos = chuvaMm * calcularFator(bairro) / 100 * 1.4;
  if (rioAlto && bairro.pertoDeRio) {
    pontos = pontos * 1.25;
  }
  if (pontos > 100) {
    pontos = 100;
  }
  return Math.round(pontos);
}

/** Devolve o objeto de nível correspondente ao índice. */
function classificar(pontos) {
  let escolhido = niveis[0];
  for (let i = 0; i < niveis.length; i++) {
    if (pontos >= niveis[i].min) {
      escolhido = niveis[i];
    }
  }
  return escolhido;
}

/** Formata número com separador de milhar em português. */
function formatarNumero(numero) {
  return numero.toLocaleString("pt-BR");
}
