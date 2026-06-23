export type CardColor = 'red' | 'blue' | 'yellow' | 'purple';
export type CardType = 'reflection' | 'action';
export type ActionType = 'skip' | 'reverse' | 'draw2';
export type CardCategory = 'Nomear' | 'Culpa' | 'Rede';

export interface Card {
  id: string;
  color: CardColor;
  type: CardType;
  number?: number; // 1-5 for reflection cards
  action?: ActionType; // for action cards
  category?: CardCategory;
  question?: string;
  objective?: string;
  quickOptions?: string[];
}

export const cardsData: Card[] = [
  // ================= RED CARDS (Rede / Juliana) =================
  {
    id: 'red_1',
    color: 'red',
    type: 'reflection',
    number: 1,
    category: 'Rede',
    question: 'Quem é a pessoa com quem você realmente sente que pode desabar sem medo de ser julgada?',
    objective: 'Mapear apoios e reconhecer a importância de delegar e pedir ajuda.',
    quickOptions: [
      'Uma amiga muito próxima ou irmã que sempre me escuta.',
      'Meu/minha parceiro(a), mas evito para não sobrecarregar nossa relação.',
      'Infelizmente, sinto que não tenho ninguém com quem falar abertamente sem ser julgada.'
    ]
  },
  {
    id: 'red_2',
    color: 'red',
    type: 'reflection',
    number: 2,
    category: 'Rede',
    question: 'Pensando na sua rotina, qual tarefa você gostaria de delegar imediatamente se tivesse essa oportunidade?',
    objective: 'Mapear apoios e reconhecer a importância de delegar e pedir ajuda.',
    quickOptions: [
      'A preparação de refeições diárias e limpeza da cozinha.',
      'A organização geral da casa, faxina e compras de mercado.',
      'O planejamento mental e a logística das atividades e compromissos da família.'
    ]
  },
  {
    id: 'red_3',
    color: 'red',
    type: 'reflection',
    number: 3,
    category: 'Rede',
    question: 'Você sente que as pessoas ao seu redor percebem quando você está no seu limite, ou você precisa verbalizar?',
    objective: 'Mapear apoios e reconhecer a importância de delegar e pedir ajuda.',
    quickOptions: [
      'Eles raramente percebem. Geralmente preciso explodir ou chorar para notarem.',
      'Eu tenho que falar de forma clara e direta, senão acham que está tudo perfeito.',
      'Algumas pessoas mais próximas percebem apenas pelo meu silêncio ou semblante abatido.'
    ]
  },
  {
    id: 'red_4',
    color: 'red',
    type: 'reflection',
    number: 4,
    category: 'Rede',
    question: 'Qual é o maior peso de equilibrar as expectativas das gerações mais novas (filhos) e das mais velhas (pais/parentes)?',
    objective: 'Mapear apoios e reconhecer a importância de delegar e pedir ajuda.',
    quickOptions: [
      'A sensação de que a sobrevivência física e financeira de todos depende do meu cuidado.',
      'A completa falta de tempo para mim, já que meu dia é dividido em atender demandas alheias.',
      'A carga psicológica de gerenciar conflitos familiares e manter a harmonia entre todos.'
    ]
  },
  {
    id: 'red_5',
    color: 'red',
    type: 'reflection',
    number: 5,
    category: 'Rede',
    question: 'Quando foi a última vez que você pediu ajuda ativa para dar conta das suas responsabilidades diárias?',
    objective: 'Mapear apoios e reconhecer a importância de delegar e pedir ajuda.',
    quickOptions: [
      'Esta semana. Percebi que o cansaço venceu e precisei acionar alguém.',
      'Há muito tempo. Prefiro acumular tarefas do que ter o desgaste de pedir e ensinar.',
      'Apenas em casos de extrema urgência, como doença ou imprevisto de força maior.'
    ]
  },

  // ================= BLUE CARDS (Culpa / Dona Sônia) =================
  {
    id: 'blue_1',
    color: 'blue',
    type: 'reflection',
    number: 1,
    category: 'Culpa',
    question: 'Você sente que, se não organizar ou ditar o que deve ser feito em casa, as coisas simplesmente não acontecem?',
    objective: 'Desconstruir a necessidade de controle e aliviar o peso da responsabilidade.',
    quickOptions: [
      'Sim, sinto que sou o motor invisível. Sem as minhas ordens, a casa para.',
      'Às vezes acontecem, mas de forma muito desorganizada ou abaixo do que considero aceitável.',
      'Estou tentando desapegar, mas a ansiedade de ver tudo parado me faz assumir o comando de novo.'
    ]
  },
  {
    id: 'blue_2',
    color: 'blue',
    type: 'reflection',
    number: 2,
    category: 'Culpa',
    question: 'Qual tarefa do cuidado ou do lar você faz de forma tão automática que ninguém nota o esforço envolvido?',
    objective: 'Desconstruir a necessidade de controle e aliviar o peso da responsabilidade.',
    quickOptions: [
      'Lavar, passar, dobrar e organizar as roupas de todos na casa.',
      'Planejar o cardápio, cozinhar e manter os mantimentos comprados e organizados.',
      'Limpar banheiros, tirar poeira e manter a ordem básica do dia a dia.'
    ]
  },
  {
    id: 'blue_3',
    color: 'blue',
    type: 'reflection',
    number: 3,
    category: 'Culpa',
    question: 'O que o conceito de "ser forte o tempo todo" já custou para a sua saúde física ou mental?',
    objective: 'Desconstruir a necessidade de controle e aliviar o peso da responsabilidade.',
    quickOptions: [
      'Dores físicas recorrentes (costas, cabeça, estômago) e insônia constante.',
      'Crises de ansiedade freqüentes e a sensação constante de exaustão mental.',
      'Distanciamento emocional, como a dificuldade de chorar ou pedir acolhimento.'
    ]
  },
  {
    id: 'blue_4',
    color: 'blue',
    type: 'reflection',
    number: 4,
    category: 'Culpa',
    question: 'Como você lida com a sensação de que as decisões importantes da família inteira dependem da sua validação?',
    objective: 'Desconstruir a necessidade de controle e aliviar o peso da responsabilidade.',
    quickOptions: [
      'Sinto-me extremamente cansada por carregar o peso final das escolhas sozinha.',
      'Sinto uma cobrança interna de nunca errar, pois o erro impactará diretamente a todos.',
      'Tento delegar as decisões, mas no fim das contas a responsabilidade acaba voltando para mim.'
    ]
  },
  {
    id: 'blue_5',
    color: 'blue',
    type: 'reflection',
    number: 5,
    category: 'Culpa',
    question: 'Se você pudesse reescrever uma regra invisível sobre "o papel da mulher na família", qual regra você eliminaria?',
    objective: 'Desconstruir a necessidade de controle e aliviar o peso da responsabilidade.',
    quickOptions: [
      'A ideia de que a mulher é a responsável natural pela harmonia e limpeza do lar.',
      'A expectativa social de que a mãe deve se sacrificar integralmente pelas necessidades dos outros.',
      'A regra invisível de que a mulher deve ser sempre compreensiva, doce e nunca demonstrar cansaço.'
    ]
  },

  // ================= YELLOW CARDS (Nomear / Mariana) =================
  {
    id: 'yellow_1',
    color: 'yellow',
    type: 'reflection',
    number: 1,
    category: 'Nomear',
    question: 'Quando você tira um tempo para não fazer nada, qual é o primeiro pensamento que vem à sua mente?',
    objective: 'Identificar emoções e reconhecer sinais de sobrecarga.',
    quickOptions: [
      'Uma lista enorme das pendências que eu deveria estar resolvendo naquele momento.',
      'Uma culpa incômoda por parecer preguiçosa enquanto há trabalho doméstico ou profissional.',
      'Uma sensação de agitação interna, como se meu cérebro estivesse programado apenas para produzir.'
    ]
  },
  {
    id: 'yellow_2',
    color: 'yellow',
    type: 'reflection',
    number: 2,
    category: 'Nomear',
    question: 'Em qual área da sua vida você sente que está sempre "devendo" ou rendendo menos do que gostaria?',
    objective: 'Identificar emoções e reconhecer sinais de sobrecarga.',
    quickOptions: [
      'No meu crescimento profissional e na minha carreira.',
      'No autocuidado básico: exercícios, consultas de rotina, alimentação e hobbies.',
      'No tempo de qualidade e na paciência que dedico aos meus filhos ou companheiro(a).'
    ]
  },
  {
    id: 'yellow_3',
    color: 'yellow',
    type: 'reflection',
    number: 3,
    category: 'Nomear',
    question: 'Dizer "não" para um pedido de ajuda de alguém que você ama lhe causa mais alívio ou mais culpa?',
    objective: 'Identificar emoções e reconhecer sinais de sobrecarga.',
    quickOptions: [
      'Muita culpa. Sinto que falhei como pessoa de apoio na vida de quem amo.',
      'Um alívio físico imediato, seguido por uma culpa mental persistente nas horas seguintes.',
      'Hoje consigo sentir mais alívio do que culpa, pois entendi a necessidade dos meus limites.'
    ]
  },
  {
    id: 'yellow_4',
    color: 'yellow',
    type: 'reflection',
    number: 4,
    category: 'Nomear',
    question: 'Qual foi a última atividade que você fez exclusivamente pelo seu prazer, sem pensar na utilidade dela para os outros?',
    objective: 'Identificar emoções e reconhecer sinais de sobrecarga.',
    quickOptions: [
      'Um banho demorado, uma leitura tranquila ou um café quente tomado em silêncio esta semana.',
      'Não me lembro. Há muitos meses não faço nada que seja puramente pelo meu prazer pessoal.',
      'Assisti a uma série ou filme que eu queria muito, sem interrupções, nos últimos dias.'
    ]
  },
  {
    id: 'yellow_5',
    color: 'yellow',
    type: 'reflection',
    number: 5,
    category: 'Nomear',
    question: 'Se o seu cansaço pudesse falar hoje, qual seria o principal pedido dele?',
    objective: 'Identificar emoções e reconhecer sinais de sobrecarga.',
    quickOptions: [
      '"Por favor, me conceda 24 horas de sono sem nenhuma cobrança ou interrupção."',
      '"Preciso passar um dia inteiro sem tomar nenhuma decisão por ninguém."',
      '"Gostaria apenas de silêncio e de ser cuidada, sem ter que cuidar de ninguém hoje."'
    ]
  },

  // ================= PURPLE CARDS (Actions) =================
  { id: 'purple_skip_1', color: 'purple', type: 'action', action: 'skip' },
  { id: 'purple_skip_2', color: 'purple', type: 'action', action: 'skip' },
  { id: 'purple_reverse_1', color: 'purple', type: 'action', action: 'reverse' },
  { id: 'purple_reverse_2', color: 'purple', type: 'action', action: 'reverse' },
  { id: 'purple_draw2_1', color: 'purple', type: 'action', action: 'draw2' },
  { id: 'purple_draw2_2', color: 'purple', type: 'action', action: 'draw2' }
];
