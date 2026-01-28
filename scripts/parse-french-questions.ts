/**
 * Parse French questions from PDF and structure them for database insertion
 */

export interface ParsedQuestion {
  id: string;
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
  order: number;
}

/**
 * Parse all 40 questions from the French PDF
 * Questions 1-15: Vocabulaire
 * Questions 16-30: Conjugaison
 * Questions 31-40: Grammaire
 */
export function parseFrenchQuestions(): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];

  // Vocabulaire (1-15)
  questions.push({
    id: 'q1',
    type: 'multiple-choice',
    question: 'Où achète-t-on du pain ?',
    options: ['À la pharmacie', 'À la boulangerie', 'À la mairie', "À l'école"],
    correctAnswer: 'À la boulangerie',
    points: 2.5,
    explanation: "Le pain s'achète à la boulangerie",
    order: 1,
  });

  questions.push({
    id: 'q2',
    type: 'multiple-choice',
    question: 'Quel lieu est fait pour les enfants ?',
    options: ['Le parking', 'Le parc', 'La banque', 'Le bureau'],
    correctAnswer: 'Le parc',
    points: 2.5,
    explanation: 'Le parc est un lieu de jeu pour les enfants',
    order: 2,
  });

  questions.push({
    id: 'q3',
    type: 'multiple-choice',
    question: 'On emprunte des livres à :',
    options: ['La poste', 'La bibliothèque', 'Le cinéma', 'Le café'],
    correctAnswer: 'La bibliothèque',
    points: 2.5,
    explanation: 'On emprunte des livres à la bibliothèque',
    order: 3,
  });

  questions.push({
    id: 'q4',
    type: 'multiple-choice',
    question: 'Où va-t-on pour voir un film ?',
    options: ['Le musée', 'Le cinéma', "L'hôpital", 'Le marché'],
    correctAnswer: 'Le cinéma',
    points: 2.5,
    explanation: 'On va au cinéma pour voir un film',
    order: 4,
  });

  questions.push({
    id: 'q5',
    type: 'multiple-choice',
    question: 'Quel moyen de transport est sous terre ?',
    options: ['Le bus', 'Le tramway', 'Le métro', 'Le vélo'],
    correctAnswer: 'Le métro',
    points: 2.5,
    explanation: 'Le métro est un transport souterrain',
    order: 5,
  });

  questions.push({
    id: 'q6',
    type: 'multiple-choice',
    question: 'Où se trouve le maire ?',
    options: ["À l'école", 'À la mairie', "À l'hôpital", 'Au théâtre'],
    correctAnswer: 'À la mairie',
    points: 2.5,
    explanation: 'Le maire travaille à la mairie',
    order: 6,
  });

  questions.push({
    id: 'q7',
    type: 'multiple-choice',
    question: 'Quel endroit est souvent bruyant ?',
    options: ['La bibliothèque', 'Le parc', 'La rue', "L'église"],
    correctAnswer: 'La rue',
    points: 2.5,
    explanation: 'La rue est souvent bruyante avec la circulation',
    order: 7,
  });

  questions.push({
    id: 'q8',
    type: 'multiple-choice',
    question: 'Où gare-t-on la voiture ?',
    options: ["À l'arrêt", 'Au parking', 'À la station', 'À la place'],
    correctAnswer: 'Au parking',
    points: 2.5,
    explanation: 'On gare la voiture au parking',
    order: 8,
  });

  questions.push({
    id: 'q9',
    type: 'multiple-choice',
    question: 'Où achète-t-on des légumes ?',
    options: ['À la librairie', 'Au marché', 'Au cinéma', 'À la poste'],
    correctAnswer: 'Au marché',
    points: 2.5,
    explanation: 'On achète des légumes au marché',
    order: 9,
  });

  questions.push({
    id: 'q10',
    type: 'multiple-choice',
    question: "Une ville avec beaucoup d'habitants est :",
    options: ['calme', 'petite', 'grande', 'vide'],
    correctAnswer: 'grande',
    points: 2.5,
    explanation: "Une ville avec beaucoup d'habitants est grande",
    order: 10,
  });

  questions.push({
    id: 'q11',
    type: 'multiple-choice',
    question: 'Où peut-on manger au restaurant ?',
    options: [
      'Dans la rue',
      'Dans un café',
      'Dans un restaurant',
      'Dans une école',
    ],
    correctAnswer: 'Dans un restaurant',
    points: 2.5,
    explanation: 'On mange au restaurant dans un restaurant',
    order: 11,
  });

  questions.push({
    id: 'q12',
    type: 'multiple-choice',
    question: 'Quel mot est féminin ?',
    options: ['Le trottoir', 'Le quartier', 'La rue', 'Le parc'],
    correctAnswer: 'La rue',
    points: 2.5,
    explanation: '"Rue" est un nom féminin (la rue)',
    order: 12,
  });

  questions.push({
    id: 'q13',
    type: 'multiple-choice',
    question: 'Un immeuble est :',
    options: ['une maison', 'un grand bâtiment', 'une voiture', 'un magasin'],
    correctAnswer: 'un grand bâtiment',
    points: 2.5,
    explanation: 'Un immeuble est un grand bâtiment',
    order: 13,
  });

  questions.push({
    id: 'q14',
    type: 'multiple-choice',
    question: 'Où achète-t-on des médicaments ?',
    options: ['À la boulangerie', 'À la pharmacie', 'À la banque', 'À la gare'],
    correctAnswer: 'À la pharmacie',
    points: 2.5,
    explanation: 'On achète des médicaments à la pharmacie',
    order: 14,
  });

  questions.push({
    id: 'q15',
    type: 'multiple-choice',
    question: 'La gare est un lieu pour :',
    options: ['les trains', 'les écoles', 'les magasins', 'les hôpitaux'],
    correctAnswer: 'les trains',
    points: 2.5,
    explanation: 'La gare est un lieu pour les trains',
    order: 15,
  });

  // Conjugaison (16-30)
  questions.push({
    id: 'q16',
    type: 'multiple-choice',
    question: 'Je ______ en ville tous les jours.',
    options: ['habite', 'habites', 'habitons', 'habitent'],
    correctAnswer: 'habite',
    points: 2.5,
    explanation: 'Je habite (1ère personne du singulier)',
    order: 16,
  });

  questions.push({
    id: 'q17',
    type: 'multiple-choice',
    question: 'Nous ______ le bus pour aller au travail.',
    options: ['prends', 'prennent', 'prenons', 'prenez'],
    correctAnswer: 'prenons',
    points: 2.5,
    explanation: 'Nous prenons (1ère personne du pluriel)',
    order: 17,
  });

  questions.push({
    id: 'q18',
    type: 'multiple-choice',
    question: 'Il ______ au marché le samedi.',
    options: ['va', 'vas', 'allons', 'vont'],
    correctAnswer: 'va',
    points: 2.5,
    explanation: 'Il va (3ème personne du singulier)',
    order: 18,
  });

  questions.push({
    id: 'q19',
    type: 'multiple-choice',
    question: 'Vous ______ souvent au restaurant ?',
    options: ['mange', 'manges', 'mangez', 'mangent'],
    correctAnswer: 'mangez',
    points: 2.5,
    explanation: 'Vous mangez (2ème personne du pluriel)',
    order: 19,
  });

  questions.push({
    id: 'q20',
    type: 'multiple-choice',
    question: 'Elles ______ dans le centre-ville.',
    options: ['travaille', 'travailles', 'travaillons', 'travaillent'],
    correctAnswer: 'travaillent',
    points: 2.5,
    explanation: 'Elles travaillent (3ème personne du pluriel)',
    order: 20,
  });

  questions.push({
    id: 'q21',
    type: 'multiple-choice',
    question: 'Tu ______ près de la gare.',
    options: ['habite', 'habites', 'habitons', 'habitent'],
    correctAnswer: 'habites',
    points: 2.5,
    explanation: 'Tu habites (2ème personne du singulier)',
    order: 21,
  });

  questions.push({
    id: 'q22',
    type: 'multiple-choice',
    question: 'On ______ le métro le matin.',
    options: ['prend', 'prends', 'prenez', 'prennent'],
    correctAnswer: 'prend',
    points: 2.5,
    explanation: 'On prend (3ème personne du singulier, forme impersonnelle)',
    order: 22,
  });

  questions.push({
    id: 'q23',
    type: 'multiple-choice',
    question: 'Je ______ un café près de chez moi.',
    options: ['cherche', 'cherches', 'cherchons', 'cherchent'],
    correctAnswer: 'cherche',
    points: 2.5,
    explanation: 'Je cherche (1ère personne du singulier)',
    order: 23,
  });

  questions.push({
    id: 'q24',
    type: 'multiple-choice',
    question: 'Nous ______ à pied en ville.',
    options: ['marche', 'marches', 'marchons', 'marchent'],
    correctAnswer: 'marchons',
    points: 2.5,
    explanation: 'Nous marchons (1ère personne du pluriel)',
    order: 24,
  });

  questions.push({
    id: 'q25',
    type: 'multiple-choice',
    question: 'Il ______ dans un immeuble moderne.',
    options: ['vit', 'vis', 'vivent', 'vivons'],
    correctAnswer: 'vit',
    points: 2.5,
    explanation: 'Il vit (3ème personne du singulier)',
    order: 25,
  });

  questions.push({
    id: 'q26',
    type: 'multiple-choice',
    question: 'Vous ______ à droite après la banque.',
    options: ['tourne', 'tournes', 'tournez', 'tournent'],
    correctAnswer: 'tournez',
    points: 2.5,
    explanation: 'Vous tournez (2ème personne du pluriel)',
    order: 26,
  });

  questions.push({
    id: 'q27',
    type: 'multiple-choice',
    question: 'Elles ______ leurs courses au supermarché.',
    options: ['fait', 'fais', 'faisons', 'font'],
    correctAnswer: 'font',
    points: 2.5,
    explanation: 'Elles font (3ème personne du pluriel, verbe faire)',
    order: 27,
  });

  questions.push({
    id: 'q28',
    type: 'multiple-choice',
    question: 'Tu ______ la ville ?',
    options: ['aime', 'aimes', 'aimons', 'aiment'],
    correctAnswer: 'aimes',
    points: 2.5,
    explanation: 'Tu aimes (2ème personne du singulier)',
    order: 28,
  });

  questions.push({
    id: 'q29',
    type: 'multiple-choice',
    question: 'Je ______ souvent au parc.',
    options: ['va', 'vas', 'vais', 'vont'],
    correctAnswer: 'vais',
    points: 2.5,
    explanation: 'Je vais (1ère personne du singulier, verbe aller)',
    order: 29,
  });

  questions.push({
    id: 'q30',
    type: 'multiple-choice',
    question: 'Nous ______ la ville en bus.',
    options: ['visite', 'visites', 'visitons', 'visitent'],
    correctAnswer: 'visitons',
    points: 2.5,
    explanation: 'Nous visitons (1ère personne du pluriel)',
    order: 30,
  });

  // Grammaire (31-40)
  questions.push({
    id: 'q31',
    type: 'multiple-choice',
    question: '___ hôtel est près de la gare.',
    options: ['Le', 'La', "L'", 'Les'],
    correctAnswer: "L'",
    points: 2.5,
    explanation: "L'hôtel (élision devant voyelle)",
    order: 31,
  });

  questions.push({
    id: 'q32',
    type: 'multiple-choice',
    question: 'Il y a ___ banques dans cette rue.',
    options: ['un', 'une', 'des', 'du'],
    correctAnswer: 'des',
    points: 2.5,
    explanation: 'Il y a des banques (article indéfini pluriel)',
    order: 32,
  });

  questions.push({
    id: 'q33',
    type: 'multiple-choice',
    question: 'Je vais ___ cinéma.',
    options: ['à la', 'au', "à l'", 'aux'],
    correctAnswer: 'au',
    points: 2.5,
    explanation: 'Je vais au cinéma (à + le = au)',
    order: 33,
  });

  questions.push({
    id: 'q34',
    type: 'multiple-choice',
    question: 'Elle habite ___ centre-ville.',
    options: ['à', 'au', 'en', 'aux'],
    correctAnswer: 'au',
    points: 2.5,
    explanation: 'Elle habite au centre-ville (à + le = au)',
    order: 34,
  });

  questions.push({
    id: 'q35',
    type: 'multiple-choice',
    question: "C'est ___ grande ville.",
    options: ['un', 'une', 'des', 'du'],
    correctAnswer: 'une',
    points: 2.5,
    explanation: 'Une grande ville (article indéfini féminin)',
    order: 35,
  });

  questions.push({
    id: 'q36',
    type: 'multiple-choice',
    question: 'Nous allons ___ pied.',
    options: ['en', 'à', 'au', 'aux'],
    correctAnswer: 'à',
    points: 2.5,
    explanation: 'À pied (expression idiomatique)',
    order: 36,
  });

  questions.push({
    id: 'q37',
    type: 'multiple-choice',
    question: 'Il y a beaucoup ___ magasins ici.',
    options: ['de', 'des', 'du', 'aux'],
    correctAnswer: 'de',
    points: 2.5,
    explanation: 'Beaucoup de (beaucoup + de + nom pluriel)',
    order: 37,
  });

  questions.push({
    id: 'q38',
    type: 'multiple-choice',
    question: 'La rue est ___ que le parc.',
    options: ['plus bruyant', 'plus bruyante', 'très bruyant', 'très bruyante'],
    correctAnswer: 'plus bruyante',
    points: 2.5,
    explanation:
      'La rue est plus bruyante (comparatif, accord avec "rue" féminin)',
    order: 38,
  });

  questions.push({
    id: 'q39',
    type: 'multiple-choice',
    question: 'Le parc est ___ endroit calme.',
    options: ['un', 'une', 'des', 'du'],
    correctAnswer: 'un',
    points: 2.5,
    explanation: 'Un endroit (article indéfini masculin)',
    order: 39,
  });

  questions.push({
    id: 'q40',
    type: 'multiple-choice',
    question: "J'habite ___ France.",
    options: ['à', 'au', 'en', 'aux'],
    correctAnswer: 'en',
    points: 2.5,
    explanation: 'En France (préposition pour les pays féminins)',
    order: 40,
  });

  return questions;
}
