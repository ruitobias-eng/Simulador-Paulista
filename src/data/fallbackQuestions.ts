import { Question } from '../types';

export const FALLBACK_QUESTIONS: Record<string, Question[]> = {
  'EF01MA01': [
    {
      id: 'EF01MA01_1',
      type: 'multiple',
      text: 'Quantas melancias estão desenhadas no canteiro abaixo? Conte com atenção!',
      options: ['5', '6', '7', '8'],
      answer: 'C', // 7 is index 2, which is 'C'
      explanation: 'Se contarmos cada uma das melancias verdes uma a uma, encontramos exatamente 7 melancias no total!',
      visualType: 'count',
      visualData: { icon: 'watermelon', count: 7 }
    },
    {
      id: 'EF01MA01_2',
      type: 'multiple',
      text: 'Na placa da casa de Pedro está escrito o número 124. Nessa situação, o número 124 é usado como:',
      options: [
        'Código de identificação (para achar a casa)',
        'Ordem (para indicar o primeiro lugar)',
        'Medida (para indicar o tamanho)',
        'Contagem (para indicar quantas casas existem)'
      ],
      answer: 'A',
      explanation: 'O número de uma casa serve como um código de identificação para que as pessoas consigam localizar aquele endereço específico.',
      visualType: 'none'
    }
  ],
  'EF01MA06': [
    {
      id: 'EF01MA06_1',
      type: 'multiple',
      text: 'João tinha 4 carrinhos azuis e ganhou mais 3 carrinhos vermelhos. Com quantos carrinhos ele ficou ao todo?',
      options: ['5 carrinhos', '6 carrinhos', '7 carrinhos', '8 carrinhos'],
      answer: 'C',
      explanation: 'Para somar 4 + 3, podemos partir do 4 e contar mais 3 unidades para a frente: 5, 6, 7. Portanto, João tem 7 carrinhos ao todo.',
      visualType: 'count',
      visualData: { icon: 'car', count: 7 }
    }
  ],
  'EF01MA11': [
    {
      id: 'EF01MA11_1',
      type: 'multiple',
      text: 'Imagine que você está na mesma posição que o menino desenhado abaixo. A bola azul está de qual lado dele?',
      options: ['À esquerda', 'À direita', 'Em frente', 'Atrás'],
      answer: 'B', // Let's say right (B)
      explanation: 'Olhando a partir da perspectiva do menino (olhando para a frente), a bola azul está posicionada do seu lado direito!',
      visualType: 'geometry',
      visualData: { type: 'lateralidade', itemLeft: 'Menino', itemRight: 'Bola Azul' }
    }
  ],
  'EF01MA15': [
    {
      id: 'EF01MA15_1',
      type: 'multiple',
      text: 'Observe as três girafas representadas abaixo. Qual delas é a mais ALTA?',
      options: ['Girafa A (da esquerda)', 'Girafa B (do meio)', 'Girafa C (da direita)', 'Todas têm o mesmo tamanho'],
      answer: 'B',
      explanation: 'Comparando as alturas das três figuras, a Girafa B (do meio) é a que possui a maior altura, ou seja, é a mais alta!',
      visualType: 'geometry',
      visualData: { type: 'heights', heights: [80, 140, 100], labels: ['Girafa A', 'Girafa B', 'Girafa C'] }
    }
  ],
  'EF02MA01': [
    {
      id: 'EF02MA01_1',
      type: 'multiple',
      text: 'No número 345, o algarismo 3 ocupa a ordem das centenas. Qual é o seu valor posicional (quanto ele vale nesse número)?',
      options: ['3', '30', '300', '3000'],
      answer: 'C',
      explanation: 'Como o algarismo 3 está na ordem das centenas, ele representa 3 centenas, o que equivale a 3 x 100 = 300 unidades!',
      visualType: 'table',
      visualData: { headers: ['Centena (C)', 'Dezena (D)', 'Unidade (U)'], rows: [['3', '4', '5']] }
    }
  ],
  'EF02MA08': [
    {
      id: 'EF02MA08_1',
      type: 'multiple',
      text: 'Mariana tem 6 bonecas. Sua irmã Sofia tem o DOBRO dessa quantidade. Quantas bonecas Sofia tem?',
      options: ['3 bonecas', '8 bonecas', '12 bonecas', '18 bonecas'],
      answer: 'C',
      explanation: 'O dobro significa multiplicar uma quantidade por 2. Como Mariana tem 6 bonecas, o dobro é 6 + 6 (ou 6 x 2), que é igual a 12 bonecas!',
      visualType: 'count',
      visualData: { icon: 'star', count: 12 }
    }
  ],
  'EF02MA09': [
    {
      id: 'EF02MA09_1',
      type: 'multiple',
      text: 'Descubra o padrão e encontre o número que falta na sequência: 5, 10, 15, ___, 25, 30.',
      options: ['16', '18', '20', '22'],
      answer: 'C',
      explanation: 'A sequência aumenta de 5 em 5 unidades (5, 10, 15...). Somando 5 ao número 15, obtemos 20. E 20 + 5 é 25. Portanto, o número que falta é 20!',
      visualType: 'none'
    }
  ],
  'EF02MA14': [
    {
      id: 'EF02MA14_1',
      type: 'multiple',
      text: 'Qual figura geométrica espacial possui o formato igual ao de um dado de jogo comum?',
      options: ['Esfera', 'Cilindro', 'Cubo', 'Cone'],
      answer: 'C',
      explanation: 'Um cubo possui 6 faces quadradas e idênticas, o que é exatamente o formato geométrico de um dado comum.',
      visualType: 'none'
    }
  ],
  'EF03MA01': [
    {
      id: 'EF03MA01_1',
      type: 'multiple',
      text: 'Como escrevemos por extenso o número 2.305?',
      options: [
        'Dois mil, trezentos e cinquenta',
        'Dois mil e trezentos',
        'Dois mil, trezentos e cinco',
        'Duzentos e trinta e cinco'
      ],
      answer: 'C',
      explanation: 'O número 2.305 tem 2 unidades de milhar (dois mil), 3 centenas (trezentos), 0 dezenas e 5 unidades (e cinco). Escreve-se: "Dois mil, trezentos e cinco".',
      visualType: 'none'
    }
  ],
  'EF03MA03': [
    {
      id: 'EF03MA03_1',
      type: 'multiple',
      text: 'Se você sabe que 4 x 5 = 20, qual é o resultado de 4 x 6?',
      options: ['21', '24', '25', '26'],
      answer: 'B',
      explanation: 'Multiplicar 4 por 6 significa somar mais um grupo de 4 ao resultado de 4 x 5. Então: 20 + 4 = 24!',
      visualType: 'none'
    }
  ],
  'EF03MA07': [
    {
      id: 'EF03MA07_1',
      type: 'multiple',
      text: 'Em uma horta, as alfaces foram plantadas em uma disposição retangular com 3 linhas e 5 colunas. Quantas alfaces foram plantadas ao todo?',
      options: ['8 alfaces', '12 alfaces', '15 alfaces', '18 alfaces'],
      answer: 'C',
      explanation: 'Para calcular o total em uma disposição retangular, multiplicamos o número de linhas pelo número de colunas: 3 x 5 = 15 alfaces!',
      visualType: 'table',
      visualData: { grid: { rows: 3, cols: 5 } }
    }
  ],
  'EF03MA15': [
    {
      id: 'EF03MA15_1',
      type: 'multiple',
      text: 'Qual das figuras geométricas planas abaixo possui exatamente 3 lados e 3 vértices?',
      options: ['Quadrado', 'Triângulo', 'Retângulo', 'Círculo'],
      answer: 'B',
      explanation: 'O triângulo é o polígono que possui exatamente 3 lados reto-segmentados, 3 ângulos internos e 3 vértices.',
      visualType: 'none'
    }
  ],
  'EF04MA03': [
    {
      id: 'EF04MA03_1',
      type: 'multiple',
      text: 'Uma biblioteca tinha 450 livros. No final do ano, ela recebeu uma doação de 180 livros e descartou 45 livros que estavam danificados. Com quantos livros a biblioteca ficou?',
      options: ['540 livros', '585 livros', '630 livros', '675 livros'],
      answer: 'B',
      explanation: 'Primeiro, somamos a doação: 450 + 180 = 630 livros. Depois, subtraímos os livros descartados: 630 - 45 = 585 livros lidos.',
      visualType: 'none'
    }
  ],
  'EF04MA09A': [
    {
      id: 'EF04MA09A_1',
      type: 'multiple',
      text: 'Se uma pizza circular foi dividida em 4 fatias iguais e você comeu 1 fatia, qual fração representa a parte que você comeu?',
      options: ['1/2', '1/3', '1/4', '1/8'],
      answer: 'C',
      explanation: 'A pizza foi dividida em 4 partes iguais (denominador) e você pegou 1 parte (numerador). Essa quantidade é representada pela fração 1/4.',
      visualType: 'fraction',
      visualData: { total: 4, shaded: 1 }
    }
  ],
  'EF04MA19': [
    {
      id: 'EF04MA19_1',
      type: 'multiple',
      text: 'Se dobrarmos uma folha quadrada exatamente ao meio, unindo duas bordas opostas, a linha da dobra funciona como:',
      options: [
        'Um lado de um triângulo',
        'Um eixo de simetria de reflexão',
        'Uma reta inclinada não simétrica',
        'Um ângulo reto exterior'
      ],
      answer: 'B',
      explanation: 'A linha da dobra que divide a figura em duas partes perfeitamente sobreponíveis por reflexão é chamada de eixo de simetria.',
      visualType: 'none'
    }
  ],
  'EF04MA27': [
    {
      id: 'EF04MA27_1',
      type: 'multiple',
      text: 'Observe o gráfico de barras abaixo com o número de gols marcados por 3 alunos em um campeonato escolar. Quantos gols Pedro marcou?',
      options: ['10 gols', '15 gols', '20 gols', '25 gols'],
      answer: 'C',
      explanation: 'Analisando a barra de Pedro, sua altura se alinha exatamente com a marca de 20 no eixo vertical.',
      visualType: 'chart',
      visualData: { type: 'bar', data: [{ name: 'Lucas', value: 15 }, { name: 'Pedro', value: 20 }, { name: 'Vitor', value: 10 }] }
    }
  ],
  'EF05MA02': [
    {
      id: 'EF05MA02_1',
      type: 'multiple',
      text: 'Qual das alternativas abaixo mostra o número racional "um inteiro e vinte e cinco centésimos" na representação decimal correta?',
      options: ['1,25', '12,5', '0,125', '125,0'],
      answer: 'A',
      explanation: 'Um inteiro fica antes da vírgula (1) e vinte e cinco centésimos ocupam duas casas decimais após a vírgula (25). A representação é 1,25.',
      visualType: 'none'
    }
  ],
  'EF05MA06': [
    {
      id: 'EF05MA06_1',
      type: 'multiple',
      text: 'Uma loja de brinquedos está oferecendo um desconto de 50% em um videogame que custa R$ 800,00. Quanto o comprador economizará com o desconto?',
      options: ['R$ 200,00', 'R$ 400,00', 'R$ 500,00', 'R$ 600,00'],
      answer: 'B',
      explanation: 'O desconto de 50% corresponde exatamente à metade do valor total. A metade de R$ 800,00 é R$ 400,00. Essa é a economia!',
      visualType: 'none'
    }
  ],
  'EF05MA12': [
    {
      id: 'EF05MA12_1',
      type: 'multiple',
      text: 'Uma receita de bolo de cenoura para 6 pessoas utiliza 3 ovos. Se eu quiser fazer a mesma receita para 12 pessoas, quantos ovos deverei usar?',
      options: ['4 ovos', '5 ovos', '6 ovos', '9 ovos'],
      answer: 'C',
      explanation: 'Para servir 12 pessoas (o dobro de 6), devemos dobrar todos os ingredientes proporcionalmente. Dobrando os 3 ovos, deverei usar 3 x 2 = 6 ovos.',
      visualType: 'none'
    }
  ],
  'EF05MA19': [
    {
      id: 'EF05MA19_1',
      type: 'multiple',
      text: 'Um atleta treina em uma pista de corrida circular de 400 metros de comprimento. Se ele der 5 voltas completas nessa pista, qual distância ele terá percorrido?',
      options: ['1.000 metros (1 km)', '2.000 metros (2 km)', '2.500 metros (2,5 km)', '3.000 metros (3 km)'],
      answer: 'B',
      explanation: 'Dando 5 voltas de 400 metros, a distância total em metros é 5 x 400 = 2.000 metros. Como 1.000 metros equivale a 1 km, ele terá corrido 2 km.',
      visualType: 'none'
    }
  ],
  'EM13MAT101': [
    {
      id: 'EM13MAT101_1',
      type: 'multiple',
      text: 'Um gráfico mostra o crescimento da população de bactérias em uma estufa ao longo do tempo. O gráfico sobe cada vez mais rápido (curva exponencial). O que isso indica sobre a taxa de variação do crescimento?',
      options: [
        'A taxa de variação é constante.',
        'A taxa de variação está diminuindo.',
        'A taxa de variação está aumentando ao longo do tempo.',
        'Não há taxa de variação.'
      ],
      answer: 'C',
      explanation: 'Em um gráfico com inclinação crescente (curva voltada para cima), a taxa de variação (velocidade de crescimento) está aumentando com o tempo, caracterizando um crescimento acelerado.',
      visualType: 'chart',
      visualData: [
        { name: 'Hora 1', value: 10 },
        { name: 'Hora 2', value: 20 },
        { name: 'Hora 3', value: 50 },
        { name: 'Hora 4', value: 120 }
      ]
    }
  ],
  'EM13MAT302': [
    {
      id: 'EM13MAT302_1',
      type: 'multiple',
      text: 'Uma empresa de táxi cobra uma taxa fixa de R$ 5,00 mais R$ 2,00 por quilômetro rodado. Qual função polinomial do 1º grau (função afim) representa o custo total C(x) em função de x quilômetros rodados?',
      options: [
        'C(x) = 5x + 2',
        'C(x) = 2x + 5',
        'C(x) = 7x',
        'C(x) = 2x - 5'
      ],
      answer: 'B',
      explanation: 'O custo fixo (R$ 5,00) é o termo independente, e o custo por quilômetro (R$ 2,00) é o coeficiente angular. Assim, a lei da função é C(x) = 2x + 5.',
      visualType: 'none'
    }
  ],
  'EM13MAT303': [
    {
      id: 'EM13MAT303_1',
      type: 'multiple',
      text: 'Se você aplicar R$ 1.000,00 a uma taxa de juros de 10% ao ano, qual será a diferença no montante acumulado após 2 anos comparando Juros Simples e Juros Compostos?',
      options: [
        'No regime de juros compostos acumula-se R$ 10,00 a mais.',
        'No regime de juros simples acumula-se R$ 10,00 a mais.',
        'Os montantes acumulados serão iguais.',
        'No regime de juros compostos acumula-se R$ 100,00 a mais.'
      ],
      answer: 'A',
      explanation: 'Juros Simples: J = P.i.n = 1000 x 0.10 x 2 = R$ 200, totalizando R$ 1.200. Juros Compostos: M = P(1+i)^n = 1000 x (1.10)^2 = R$ 1.210. A diferença é 1210 - 1200 = R$ 10,00 a mais para os Juros Compostos.',
      visualType: 'none'
    }
  ],
  'EM13MAT104': [
    {
      id: 'EM13MAT104_1',
      type: 'multiple',
      text: 'O Índice de Desenvolvimento Humano (IDH) é uma medida composta que varia de 0 a 1. Quais são as três dimensões básicas avaliadas pelo IDH?',
      options: [
        'PIB, Inflação e Desemprego.',
        'Saúde (Expectativa de vida), Educação (Anos de estudo) e Padrão de vida (Renda per capita).',
        'Segurança, Tecnologia e Meio Ambiente.',
        'População total, Área territorial e Saneamento básico.'
      ],
      answer: 'B',
      explanation: 'O IDH sintetiza o desenvolvimento humano considerando a saúde/longevidade (expectativa de vida), o nível de instrução (educação) e o padrão de vida/renda (Renda Nacional Bruta per capita).',
      visualType: 'none'
    }
  ],
  'EM13MAT503': [
    {
      id: 'EM13MAT503_1',
      type: 'multiple',
      text: 'O lucro L(x) de uma pequena empresa em milhares de reais é dado pela função quadrática L(x) = -x² + 6x - 5, onde x é a quantidade de unidades vendidas. Qual é a quantidade x que maximiza o lucro da empresa?',
      options: [
        '1 unidade',
        '3 unidades',
        '5 unidades',
        '6 unidades'
      ],
      answer: 'B',
      explanation: 'O ponto de máximo de uma parábola (com a < 0) ocorre no x do vértice: Xv = -b / (2a) = -6 / (2 * -1) = 3 unidades.',
      visualType: 'none'
    }
  ],
  'EM13MAT305': [
    {
      id: 'EM13MAT305_1',
      type: 'multiple',
      text: 'A escala Richter mede a magnitude M de um terremoto pela fórmula M = log10(A) + C, onde A é a amplitude das ondas sísmicas. Se a magnitude aumentar de 5 para 7 na escala Richter, quantas vezes maior se tornou a amplitude das ondas?',
      options: [
        '2 vezes maior',
        '20 vezes maior',
        '100 vezes maior',
        '1.000 vezes maior'
      ],
      answer: 'C',
      explanation: 'Como a escala Richter é logarítmica de base 10, cada aumento de 1 unidade multiplica a amplitude por 10. Um aumento de 2 unidades (de 5 para 7) significa que a amplitude é 10² = 100 vezes maior.',
      visualType: 'none'
    }
  ],
  'EM13MAT310': [
    {
      id: 'EM13MAT310_1',
      type: 'multiple',
      text: 'Uma pizzaria oferece 3 tipos de massa, 4 tipos de molho e 5 tipos de cobertura. De quantas maneiras diferentes um cliente pode montar sua pizza escolhendo exatamente 1 massa, 1 molho e 1 cobertura?',
      options: [
        '12 maneiras',
        '20 maneiras',
        '60 maneiras',
        '120 maneiras'
      ],
      answer: 'C',
      explanation: 'Pelo Princípio Multiplicativo de contagem, o número total de combinações é o produto das escolhas possíveis: 3 massas * 4 molhos * 5 coberturas = 60 maneiras distintas.',
      visualType: 'none'
    }
  ],
  'EF06MA01': [
    {
      id: 'EF06MA01_1',
      type: 'multiple',
      text: 'A fração 3/4 representa qual número decimal correspondente?',
      options: [
        '0,34',
        '0,75',
        '3,40',
        '0,30'
      ],
      answer: 'B',
      explanation: 'Dividindo 3 por 4, obtemos exatamente 0,75 (ou 75%).',
      visualType: 'none'
    }
  ],
  'EF06MA14': [
    {
      id: 'EF06MA14_1',
      type: 'multiple',
      text: 'Um prisma de base triangular possui quantas faces no total?',
      options: [
        '3 faces',
        '4 faces',
        '5 faces',
        '6 faces'
      ],
      answer: 'C',
      explanation: 'Um prisma de base triangular tem 2 bases triangulares e 3 faces laterais retangulares, somando um total de 5 faces.',
      visualType: 'none'
    }
  ],
  'EF07MA04': [
    {
      id: 'EF07MA04_1',
      type: 'multiple',
      text: 'Um produto custava R$ 80,00 e sofreu um acréscimo de 15%. Qual é o seu novo preço?',
      options: [
        'R$ 92,00',
        'R$ 95,00',
        'R$ 88,00',
        'R$ 102,00'
      ],
      answer: 'A',
      explanation: '15% de 80 é igual a (15/100) * 80 = 12. Somando ao preço original: 80 + 12 = R$ 92,00.',
      visualType: 'none'
    }
  ],
  'EF07MA18': [
    {
      id: 'EF07MA18_1',
      type: 'multiple',
      text: 'Qual é a área de um triângulo que possui base medindo 10 cm e altura medindo 6 cm?',
      options: [
        '60 cm²',
        '30 cm²',
        '16 cm²',
        '15 cm²'
      ],
      answer: 'B',
      explanation: 'A área do triângulo é dada por (base * altura) / 2. Logo: (10 * 6) / 2 = 60 / 2 = 30 cm².',
      visualType: 'none'
    }
  ],
  'EF08MA06': [
    {
      id: 'EF08MA06_1',
      type: 'multiple',
      text: 'Qual é o valor numérico da expressão 2 elevado a -3 (2⁻³)?',
      options: [
        '-6',
        '-8',
        '1/8',
        '1/6'
      ],
      answer: 'C',
      explanation: 'Qualquer base elevada a expoente negativo é igual ao inverso da base com expoente positivo: 2⁻³ = 1 / (2³) = 1/8.',
      visualType: 'none'
    }
  ],
  'EF08MA11': [
    {
      id: 'EF08MA11_1',
      type: 'multiple',
      text: 'A equação x + y = 5 representa uma reta no plano cartesiano. Qual dos pontos abaixo pertence a essa reta?',
      options: [
        '(2, 3)',
        '(1, 5)',
        '(4, 2)',
        '(3, 1)'
      ],
      answer: 'A',
      explanation: 'Substituindo as coordenadas (x, y) do ponto (2, 3) na equação x + y = 5, temos 2 + 3 = 5, o que é verdadeiro.',
      visualType: 'none'
    }
  ],
  'EF09MA06': [
    {
      id: 'EF09MA06_1',
      type: 'multiple',
      text: 'Se y = 3x - 1 representa uma função linear, qual é o valor de y quando x = 4?',
      options: [
        '11',
        '12',
        '13',
        '10'
      ],
      answer: 'A',
      explanation: 'Substituindo x = 4 na função: y = 3*(4) - 1 = 12 - 1 = 11.',
      visualType: 'none'
    }
  ],
  'EF09MA11': [
    {
      id: 'EF09MA11_1',
      type: 'multiple',
      text: 'Quais são as raízes reais da equação x² - 5x + 6 = 0?',
      options: [
        '1 e 6',
        '-2 e -3',
        '2 e 3',
        '0 e 5'
      ],
      answer: 'C',
      explanation: 'Fatorando a equação, temos (x - 2)(x - 3) = 0. As soluções são as raízes x = 2 e x = 3.',
      visualType: 'none'
    }
  ]
};
