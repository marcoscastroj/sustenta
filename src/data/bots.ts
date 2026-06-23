export interface BotProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  description: string;
  themeColor: string;
  bgColor: string;
  borderColor: string;
}

export const botsData: BotProfile[] = [
  {
    id: 'mariana',
    name: 'Mariana',
    age: 34,
    avatar: '👩‍👦',
    description: 'Mãe solo, trabalha fora, enfrenta a tripla jornada diária.',
    themeColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    borderColor: 'border-amber-200 dark:border-amber-800'
  },
  {
    id: 'juliana',
    name: 'Juliana',
    age: 42,
    avatar: '👩‍👧‍👦',
    description: 'Cuida dos filhos e dos pais idosos (geração sanduíche).',
    themeColor: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/20',
    borderColor: 'border-rose-200 dark:border-rose-800'
  },
  {
    id: 'sonia',
    name: 'Dona Sônia',
    age: 61,
    avatar: '👵',
    description: 'Dona de casa que centraliza o cuidado e decisões da família.',
    themeColor: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-50 dark:bg-sky-950/20',
    borderColor: 'border-sky-200 dark:border-sky-800'
  }
];

export const botResponses: Record<string, Record<string, string>> = {
  mariana: {
    // Red Cards (Rede)
    red_1: 'No fundo, sinto que quase não tenho com quem desabafar de verdade sem me cobrar parecer forte e perfeita para os meus filhos.',
    red_2: 'Gostaria de delegar o planejamento das compras e a preparação das marmitas. Não aguento mais essa logística inteira sozinha.',
    red_3: 'Ninguém percebe. Como sou mãe solo, as pessoas ao redor assumem que sou uma "supermulher" e dou conta de tudo sorrindo.',
    red_4: 'Ainda não cuido dos meus pais idosos, mas a pressão diária de educar meus filhos sem uma rede de apoio é esmagadora.',
    red_5: 'A última vez foi semana passada. Precisei que uma vizinha olhasse as crianças por duas horas para eu ir ao médico. Senti vergonha de pedir.',
    
    // Blue Cards (Culpa)
    blue_1: 'Se eu não mandar escovar os dentes, tomar banho e recolher os brinquedos, o caos se instala na casa inteira em minutos.',
    blue_2: 'Lavar e estender roupas na calada da noite, quando as crianças já dormem e o dia de trabalho fora já terminou.',
    blue_3: 'Custou crises de choro escondida no banheiro e uma insônia terrível de tanto ficar calculando o orçamento de amanhã.',
    blue_4: 'É uma pressão enorme. Cada escolha prática que faço impacta o futuro direto dos meus filhos, sem ninguém para dividir o peso.',
    blue_5: 'Eliminaria a expectativa invisível de que a mãe solo deve dar conta de tudo sozinha, sem reclamar e sem direito a cansaço.',

    // Yellow Cards (Nomear)
    yellow_1: 'A primeira coisa que penso é no relatório que não terminei ou na louça acumulada que ficou na pia esperando.',
    yellow_2: 'Sinto que estou sempre devendo no trabalho quando saio correndo para pegar as crianças, e devendo com eles pelo meu cansaço.',
    yellow_3: 'Dizer "não" me corrói de culpa. Sinto que estou falhando como mãe ou que sou uma profissional/colega egoísta.',
    yellow_4: 'Fazer as unhas ouvindo música sozinha na sexta-feira à noite. Foi rápido, mas me fez lembrar que eu existo além de ser mãe.',
    yellow_5: 'Meu cansaço pediria: "Por favor, assume o controle das decisões por mim só um pouquinho, deixa eu ser cuidada também".'
  },
  juliana: {
    // Red Cards (Rede)
    red_1: 'Minha irmã me escuta às vezes, mas ela também tem a vida cheia de problemas. Acabo guardando a maior parte para mim.',
    red_2: 'Gostaria de delegar a logística das consultas médicas dos meus pais. Agendar, acompanhar e administrar remédios consome todo meu dia.',
    red_3: 'Eu preciso verbalizar claramente que cheguei ao limite. Mas mesmo assim, muitas vezes acham que estou só "reclamando de boca cheia".',
    red_4: 'O maior peso é me sentir dividida. Meus filhos cobram atenção e presença, e meus pais idosos precisam de cuidados vitais de saúde. Não dá para se duplicar.',
    red_5: 'Pedi ajuda ao meu marido para dar banho no meu pai ontem. Tive que insistir bastante, mas ele acabou ajudando.',

    // Blue Cards (Culpa)
    blue_1: 'Sim. Se eu não organizar meticulosamente o cronograma de remédios do meu pai e as tarefas escolares dos meninos, tudo se perde.',
    blue_2: 'O planejamento invisível de cardápios específicos para a dieta dos meus pais idosos e a das crianças. Ninguém enxerga esse trabalho.',
    blue_3: 'Custou uma gastrite nervosa fortíssima e a ansiedade constante de que nunca posso ficar doente, pois o sistema familiar todo depende de mim.',
    blue_4: 'Sinto que carrego o leme do navio da família inteira nas costas. Se eu errar na tomada de decisões, sinto que todos naufragam.',
    blue_5: 'A regra de que a mulher da geração do meio deve assumir de forma solitária e natural o cuidado dos idosos e das crianças.',

    // Yellow Cards (Nomear)
    yellow_1: 'Fico pensando se meus pais estão confortáveis ou se esqueci de ministrar algum remédio importante no horário certo.',
    yellow_2: 'Na minha própria individualidade, saúde e hobbies. Sinto que minha identidade pessoal foi engolida pelos papéis de cuidadora.',
    yellow_3: 'Causa uma culpa imensa. Parece que recusar um pedido é o mesmo que abandonar quem precisa do meu amparo diário.',
    yellow_4: 'Dei uma volta rápida na praça perto de casa, sem rumo, só para sentir o vento no rosto por 15 minutos longe das obrigações.',
    yellow_5: 'Meu cansaço diria: "Quero um dia de silêncio absoluto, onde ninguém me chame de mãe, de filha ou me peça para resolver problemas".'
  },
  sonia: {
    // Red Cards (Rede)
    red_1: 'Converso com Deus e com minhas plantas. Sinto que meus filhos já têm as vidas cheias e não quero incomodá-los com minhas dores.',
    red_2: 'A limpeza pesada da casa. Limpar janelas, carregar baldes e esfregar o chão já está cobrando um preço alto da minha coluna.',
    red_3: 'Eles acham que, por eu ser dona de casa e aposentada, nunca estou cansada. Só percebem se eu realmente adoecer e ficar de cama.',
    red_4: 'Equilibrar a vontade e amor de ajudar cuidando dos meus netos pequenos com a necessidade física de poupar minha energia, que já é pouca.',
    red_5: 'Quase nunca peço. Prefiro fazer tudo no meu próprio ritmo, mesmo com dor, para não ouvir que estou cobrando ajuda ou incomodando.',

    // Blue Cards (Culpa)
    blue_1: 'Com certeza. Se eu não comandar a cozinha e a arrumação diária, a louça acumula e ninguém se move para ajudar por iniciativa própria.',
    blue_2: 'Passar as roupas de cama e organizar detalhadamente os armários. Todos acham que as gavetas se organizam sozinhas.',
    blue_3: 'Custou dores terríveis nos joelhos e coluna, além de um hábito triste de engolir o choro e fingir que está tudo perfeitamente bem.',
    blue_4: 'Meus filhos e marido vêm me perguntar tudo, desde onde guardo as meias até conselhos sérios sobre casamento. É gratificante, mas exaustivo.',
    blue_5: 'A regra de que o trabalho doméstico vale menos por ser feito em casa. É um trabalho sem salário, sem feriado e que nunca termina.',

    // Yellow Cards (Nomear)
    yellow_1: 'Fico olhando ao redor procurando um cisco no chão para limpar ou pensando no almoço que preciso deixar pronto para a família.',
    yellow_2: 'Sinto que devia ter estudado mais na juventude, ter tido uma carreira financeira independente para não me sentir tão presa hoje.',
    yellow_3: 'Sempre me causou muita culpa. Sinto que o papel de mãe e avó exige que eu esteja sempre disponível para todos, sem ressalvas.',
    yellow_4: 'Fazer crochê assistindo à minha novela preferida ao final da tarde, sabendo que todas as obrigações da casa finalmente terminaram.',
    yellow_5: 'Meu cansaço pediria: "Deixem que eu descanse no domingo, sem a obrigação de preparar o almoço perfeito para a família inteira".'
  }
};
