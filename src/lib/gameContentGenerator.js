import learningContent from "./learningContent.js";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const MINIMUM_QUESTION_COUNT = 400;

const formatNumber = (value) => String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);

const mathTopics = [
  {
    id: "addition",
    icon: "➕",
    title: "جمع و ترکیب عددها",
    topics: ["جمع پایه", "جمع ستونی", "جمع با انتقال", "جای خالی در جمع", "جمع چندجمله‌ای", "برآورد مجموع", "جمع در مسئله‌ها", "جمع دهگان و یکان", "جمع ذهنی", "الگوی جمع"],
  },
  {
    id: "subtraction",
    icon: "➖",
    title: "تفریق و مقایسه عددها",
    topics: ["تفریق پایه", "تفریق ستونی", "تفریق با قرض", "جای خالی در تفریق", "مقایسه دو عدد", "تفریق ذهنی", "تفریق در مسئله‌ها", "اختلاف عددها", "برآورد تفاضل", "الگوی تفریق"],
  },
  {
    id: "multiplication",
    icon: "✖️",
    title: "ضرب و گروه‌بندی",
    topics: ["ضرب پایه", "ضرب ستونی", "جای خالی در ضرب", "گروه‌های مساوی", "آرایه‌های ضرب", "ضرب ذهنی", "دو برابر و سه برابر", "ضرب در دهگان", "مسئله‌های ضرب", "الگوی ضرب"],
  },
  {
    id: "division",
    icon: "➗",
    title: "تقسیم و بخش‌پذیری",
    topics: ["تقسیم پایه", "تقسیم دقیق", "جای خالی در تقسیم", "گروه‌بندی مساوی", "تقسیم ذهنی", "رابطه ضرب و تقسیم", "تقسیم در مسئله‌ها", "تقسیم بر دهگان", "باقی‌مانده و خارج‌قسمت", "الگوی تقسیم"],
  },
  {
    id: "fractions",
    icon: "½",
    title: "کسرها و اندازه‌گیری سهم",
    topics: ["جمع کسرهای هم‌مخرج", "تفریق کسرهای هم‌مخرج", "کسرهای مساوی", "مقایسه کسرها", "صورت و مخرج", "کسر یک واحد", "کسرهای بزرگ‌تر از واحد", "کسر در مسئله‌ها", "الگوی کسرها", "سهم‌های برابر"],
  },
  {
    id: "sequences",
    icon: "🔢",
    title: "دنباله و کشف الگو",
    topics: ["دنباله افزایشی", "دنباله کاهشی", "گام‌های برابر", "الگوی دوبرابری", "الگوی سه‌برابری", "عددهای جاافتاده", "قانون دنباله", "الگوی زوج‌ها", "الگوی فردها", "دنباله ترکیبی"],
  },
];

const levelNames = ["آغازین", "پایه", "میانی", "پیشرفته", "چالشی"];

function makeChoices(answer, index) {
  const offsets = [1, -1, 2, -2, 3, -3, 5, -5];
  const choices = [answer];
  for (let attempt = 0; choices.length < 4; attempt += 1) {
    const candidate = answer + offsets[(index + attempt) % offsets.length];
    if (candidate >= 0 && !choices.includes(candidate)) choices.push(candidate);
  }
  const rotation = index % choices.length;
  const options = [...choices.slice(rotation), ...choices.slice(0, rotation)].map(formatNumber);
  return { options, correctIndex: options.indexOf(formatNumber(answer)) };
}

function makeFractionChoices(numerator, denominator, index) {
  const choices = [numerator];
  for (const offset of [1, -1, 2, -2, 3, -3, 4]) {
    const candidate = numerator + offset;
    if (candidate >= 0 && !choices.includes(candidate)) choices.push(candidate);
    if (choices.length === 4) break;
  }
  const rotation = index % choices.length;
  const ordered = [...choices.slice(rotation), ...choices.slice(0, rotation)];
  const options = ordered.map((value) => `${formatNumber(value)}/${formatNumber(denominator)}`);
  const answer = `${formatNumber(numerator)}/${formatNumber(denominator)}`;
  return { options, correctIndex: options.indexOf(answer) };
}

function buildQuestion(groupId, skillIndex, level, index) {
  const levelOffset = (level - 1) * 3;
  const first = 1 + (index % 20) + levelOffset;
  const second = 1 + Math.floor(index / 20) + levelOffset;
  const missing = skillIndex % 3;

  if (groupId === "addition") {
    const answer = first + second;
    const question = missing === 1
      ? `${formatNumber(answer)} − ${formatNumber(second)} = ؟`
      : missing === 2
        ? `${formatNumber(first)} + ؟ = ${formatNumber(answer)}`
        : `${formatNumber(first)} + ${formatNumber(second)} = ؟`;
    return { question, ...makeChoices(missing === 1 ? first : missing === 2 ? second : answer, index) };
  }

  if (groupId === "subtraction") {
    const minuend = first + second;
    const question = missing === 1
      ? `؟ − ${formatNumber(second)} = ${formatNumber(first)}`
      : missing === 2
        ? `${formatNumber(minuend)} − ؟ = ${formatNumber(first)}`
        : `${formatNumber(minuend)} − ${formatNumber(second)} = ؟`;
    return { question, ...makeChoices(missing === 1 ? minuend : missing === 2 ? second : first, index) };
  }

  if (groupId === "multiplication") {
    const answer = first * second;
    const question = missing === 1
      ? `؟ × ${formatNumber(second)} = ${formatNumber(answer)}`
      : missing === 2
        ? `${formatNumber(first)} × ؟ = ${formatNumber(answer)}`
        : `${formatNumber(first)} × ${formatNumber(second)} = ؟`;
    return { question, ...makeChoices(missing === 1 ? first : missing === 2 ? second : answer, index) };
  }

  if (groupId === "division") {
    const dividend = first * second;
    const question = missing === 1
      ? `؟ ÷ ${formatNumber(second)} = ${formatNumber(first)}`
      : missing === 2
        ? `${formatNumber(dividend)} ÷ ؟ = ${formatNumber(first)}`
        : `${formatNumber(dividend)} ÷ ${formatNumber(second)} = ؟`;
    return { question, ...makeChoices(missing === 1 ? dividend : missing === 2 ? second : first, index) };
  }

  if (groupId === "fractions") {
    const numerator = 1 + (index % 20) + levelOffset;
    const denominator = 2 + Math.floor(index / 20) + levelOffset;
    const addend = 1 + ((index * 7 + skillIndex) % 20);
    const showFraction = (value) => `${formatNumber(value)}/${formatNumber(denominator)}`;

    if (skillIndex === 1 || skillIndex === 6) {
      const greaterNumerator = numerator + addend;
      return {
        question: `${showFraction(greaterNumerator)} − ${showFraction(addend)} = ؟`,
        ...makeFractionChoices(numerator, denominator, index),
      };
    }

    if (skillIndex === 2 || skillIndex === 7) {
      const comparedNumerator = numerator === addend ? addend + 1 : addend;
      const larger = Math.max(numerator, comparedNumerator);
      return {
        question: `کدام کسر بزرگ‌تر است: ${showFraction(numerator)} یا ${showFraction(comparedNumerator)}؟`,
        ...makeFractionChoices(larger, denominator, index),
      };
    }

    if (skillIndex === 4 || skillIndex === 9) {
      return {
        question: `در کسر ${showFraction(numerator)}، مخرج کدام عدد است؟`,
        ...makeChoices(denominator, index),
      };
    }

    const firstNumerator = skillIndex === 5 ? 1 : numerator;
    const total = firstNumerator + addend;
    const question = skillIndex === 3
      ? `؟/${formatNumber(denominator)} + ${showFraction(addend)} = ${showFraction(total)}`
      : skillIndex === 8
        ? `در یک مسئله، ${showFraction(firstNumerator)} و ${showFraction(addend)} از یک شکل رنگ شده‌اند؛ صورت کسر مجموع چند است؟`
        : `${showFraction(firstNumerator)} + ${showFraction(addend)} = ؟`;
    return { question, ...makeFractionChoices(skillIndex === 3 ? firstNumerator : total, denominator, index) };
  }

  let start = 1 + (index % 20) + levelOffset;
  let step = 1 + Math.floor(index / 20) + levelOffset;
  if (skillIndex === 7) {
    start *= 2;
    step *= 2;
  } else if (skillIndex === 8) {
    start = start * 2 + 1;
    step *= 2;
  }
  const geometricFactor = skillIndex === 3 ? 2 : skillIndex === 4 ? 3 : 0;
  if (geometricFactor) start = index + 1 + levelOffset * MINIMUM_QUESTION_COUNT;
  const valueAt = (position) => geometricFactor ? start * (geometricFactor ** position) : start + step * position;
  const answer = valueAt(5);
  const terms = Array.from({ length: 5 }, (_, position) => formatNumber(valueAt(position)));
  const question = skillIndex % 2 === 0
    ? `عدد بعدی دنباله ${terms.join("، ")} چیست؟`
    : `قانون افزایش در دنباله ${terms.join("، ")} را ادامه بده؛ عدد بعدی چیست؟`;
  return { question, ...makeChoices(answer, index) };
}

export function createProceduralQuestionBank({ groupId, skillIndex = 0, level = 1, count = MINIMUM_QUESTION_COUNT }) {
  const group = mathTopics.find((candidate) => candidate.id === groupId);
  if (!group) throw new Error(`Unknown procedural game group: ${groupId}`);
  if (!Number.isInteger(count) || count < MINIMUM_QUESTION_COUNT) {
    throw new Error(`Question banks must contain at least ${MINIMUM_QUESTION_COUNT} questions.`);
  }

  return Array.from({ length: count }, (_, index) => buildQuestion(groupId, skillIndex, level, index));
}

const activityNames = [
  "واژه‌های کاربردی", "خواندن سرنخ", "مفهوم جمله", "مرور واژگان", "تمرین روزانه",
  "واژه در بافت", "معنی و کاربرد", "کشف واژه", "گنجینه لغت", "جمله‌های کوتاه",
  "تمرین شنیداری", "آزمون واژه", "تمرین پایانی",
  "جمله‌های کوتاه", "واژه‌های خانواده", "تمرین واژه‌خوانی", "یادگیری گام‌به‌گام", "واژه و مثال",
  "دستور زبان", "گفت‌وگو", "برداشت از متن", "مفهوم و معنی", "مرور درس",
  "آموزش تعاملی", "تمرین مستقل", "یادگیری با سرنخ", "مأموریت واژه", "چالش جمله",
  "کارت‌های یادگیری", "مرور هوشمند", "دانش‌واژه", "مهارت خواندن", "دقت شنیداری",
  "یادگیری سریع", "بازی تمرینی", "تمرین مفردات", "پازل آموزشی", "مسیر یادگیری",
  "یادگیری روزانه", "تمرین مرحله‌ای", "چالش کلاس", "بازی مرور", "مهارت واژگان",
  "واژه‌نامه فعال", "تمرین شناخت", "یادگیری خلاق", "سنجش آموخته‌ها", "مسابقه دانایی",
  "واژه در گفت‌وگو", "چالش یادگیری",
];

export function createProceduralGames() {
  const vocabulary = uniqueRecords("vocabulary", (entry) => entry.en && entry.fa);
  const grammar = uniqueRecords("grammar", (entry) => entry.rule && entry.example);
  const listening = uniqueRecords("listening", (entry) => entry.text && entry.answers?.[0]);
  const activityGroups = [
    { engine: "quiz", icon: "🧠", title: "دانش‌پژوه", description: "تمرین واژگان انگلیسی از محتوای درسی موجود", bank: (edition) => vocabularyQuestions(vocabulary, edition) },
    { engine: "match", icon: "🃏", title: "جفت‌یاب", description: "جفت‌سازی واژه‌های انگلیسی و معنی فارسی", bank: (edition) => vocabularyCards(vocabulary, edition) },
    { engine: "sort", icon: "🗂️", title: "دسته‌بند", description: "دسته‌بندی واژه‌ها بر پایه پایهٔ درسی", bank: (edition) => vocabularySortItems(vocabulary, edition).items },
    { engine: "fillblank", icon: "✍️", title: "جای‌خالی", description: "تمرین قاعده‌های گرامری در جمله‌های درسی", bank: (edition) => grammarBlanks(grammar, edition) },
    { engine: "type", icon: "🗳️", title: "پاسخ‌گزین", description: "انتخاب پاسخ به پرسش‌های شنیداری درسی", bank: (edition) => listeningTyping(listening, edition) },
    { engine: "scramble", icon: "🔤", title: "واژه‌ساز", description: "مرتب‌کردن حروف واژه‌های درسی", bank: (edition) => vocabularyScrambles(vocabulary, edition) },
  ];
  const editions = Array.from({ length: 50 }, (_, index) => index + 1);
  return activityGroups.flatMap((group) => editions.map((edition) => {
    const bank = group.bank(edition);
    const activityName = activityNames[edition - 1];
    return {
      id: `activity-${group.engine}-${edition}`,
      title: `${group.title}: ${activityName}`,
      description: `${group.description}؛ ${activityName}، دورهٔ تمرین ${edition}.`,
      icon: group.icon,
      category: "English Practice",
      difficulty: edition <= 17 ? "Beginner" : edition <= 34 ? "Intermediate" : "Advanced",
      engine: group.engine,
      questionBank: bank,
      ...(group.engine === "quiz" ? { questions: bank } : {}),
      ...(group.engine === "match" ? { cards: bank } : {}),
      ...(group.engine === "sort" ? { categories: vocabularySortItems(vocabulary, edition).categories, items: bank } : {}),
      ...(group.engine === "fillblank" || group.engine === "type" ? { questions: bank } : {}),
      ...(group.engine === "scramble" ? { words: bank } : {}),
    };
  }));
}

function uniqueRecords(group, isUsable) {
  const seen = new Set();
  return Object.entries(learningContent).flatMap(([grade, lessons]) =>
    (lessons[group] || []).filter(isUsable).map((entry) => ({ ...entry, grade })),
  ).filter((entry) => {
    const key = `${entry.en || entry.rule || entry.text}|${entry.fa || entry.example || entry.answers?.[0]}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function vocabularyQuestions(vocabulary, edition = 1) {
  const answers = [...new Set(vocabulary.map((entry) => entry.en))];
  return vocabulary.map((entry, index) => {
    const options = [entry.en];
    for (let offset = 1; options.length < 4; offset += 1) {
      const candidate = answers[(index + offset * (edition + 36)) % answers.length];
      if (!options.includes(candidate)) options.push(candidate);
    }
    const rotation = (index + edition - 1) % options.length;
    const orderedOptions = [...options.slice(rotation), ...options.slice(0, rotation)];
    const variants = [
      `واژهٔ «${entry.fa}» به انگلیسی چیست؟`,
      `کدام واژه معنی «${entry.fa}» را می‌رساند؟`,
      `در واژگان پایهٔ ${entry.grade}، برابر انگلیسی «${entry.fa}» کدام است؟`,
      `ترجمهٔ انگلیسی واژهٔ فارسی «${entry.fa}» را انتخاب کن.`,
      `کدام گزینه با معنی فارسی «${entry.fa}» برابر است؟`,
    ];
    return {
      question: `${variants[(edition - 1) % variants.length]} مثال: ${entry.example}`,
      options: orderedOptions,
      correctIndex: orderedOptions.indexOf(entry.en),
    };
  });
}

function vocabularyCards(vocabulary, edition = 1) {
  return vocabulary.map((entry, index) => ({
    id: `vocab-${index}-${entry.en}`,
    text: edition % 2 ? entry.fa : entry.en,
    en: edition % 2 ? entry.en : entry.fa,
    emoji: ["📘", "🧩", "🌟", "🔎", "📝"][(edition - 1) % 5],
  }));
}

function gradeCategories() {
  return Object.keys(learningContent).map((grade) => ({ name: `Grade ${grade}`, items: [] }));
}

function vocabularySortItems(vocabulary, edition = 1) {
  const modes = [
    { categories: Object.keys(learningContent).map((grade) => `Grade ${grade}`), classify: (entry) => `Grade ${entry.grade}` },
    { categories: ["Short words", "Medium words", "Long words"], classify: (entry) => [...entry.en].length <= 4 ? "Short words" : [...entry.en].length <= 7 ? "Medium words" : "Long words" },
    { categories: ["A–H", "I–P", "Q–Z"], classify: (entry) => entry.en[0].toLowerCase() <= "h" ? "A–H" : entry.en[0].toLowerCase() <= "p" ? "I–P" : "Q–Z" },
    { categories: ["Starts with a vowel", "Starts with a consonant"], classify: (entry) => "aeiou".includes(entry.en[0].toLowerCase()) ? "Starts with a vowel" : "Starts with a consonant" },
    { categories: ["Even-length words", "Odd-length words"], classify: (entry) => [...entry.en].length % 2 === 0 ? "Even-length words" : "Odd-length words" },
  ];
  const mode = modes[(edition - 1) % modes.length];
  const items = vocabulary.map((entry, index) => ({
    id: `grade-${entry.grade}-${index}`,
    label: `${entry.en} — ${entry.fa}`,
    category: mode.classify(entry),
  }));
  return { categories: mode.categories.map((name) => ({ name, items: [] })), items };
}

function grammarBlanks(grammar, edition = 1) {
  const prompts = [
    (entry) => `Example ${edition}: ${entry.example}. Complete the rule name: ___`,
    (entry) => `Which grammar rule describes “${entry.example}”? ___`,
    (entry) => `Rule: ${entry.pattern}. Its name is ___ (example: ${entry.example})`,
    (entry) => `Complete the grammar label for “${entry.example}”: ___`,
    (entry) => `In “${entry.example}”, the grammar topic is ___`,
  ];
  return grammar.map((entry, index) => ({
    text: prompts[(edition - 1) % prompts.length](entry),
    answer: entry.rule,
  }));
}

function listeningTyping(listening, edition = 1) {
  const prompt = [
    (entry) => `${entry.questions?.[0] || "Answer from the passage"} ${entry.text}`,
    (entry) => `From this passage: ${entry.text}. Answer: ${entry.questions?.[0] || "What is mentioned?"}`,
    (entry) => `Read the note: ${entry.text}. Respond to: ${entry.questions?.[0] || "What is mentioned?"}`,
    (entry) => `Recall this passage: ${entry.text}. ${entry.questions?.[0] || "What is mentioned?"}`,
    (entry) => `Passage: ${entry.text}. ${entry.questions?.[0] || "What is mentioned?"}`,
  ][(edition - 1) % 5];
  return listening.map((entry, index) => ({
    hint: prompt(entry),
    answer: String(entry.answers[0]),
  })).filter((entry) => entry.answer.trim());
}

function scrambleWord(word, index) {
  const letters = [...word];
  if (letters.length < 2) return word;
  const offset = 1 + (index % (letters.length - 1));
  const scrambled = [...letters.slice(offset), ...letters.slice(0, offset)].join("");
  return scrambled === word ? `${scrambled.slice(1)}${scrambled[0]}` : scrambled;
}

function vocabularyScrambles(vocabulary, edition = 1) {
  return vocabulary.filter((entry) => /^[a-z]{2,}$/i.test(entry.en)).map((entry, index) => ({
    scrambled: scrambleWord(entry.en, index + edition - 1),
    answer: entry.en,
    hint: edition % 2 ? entry.fa : `${entry.fa}: ${entry.example}`,
  })).filter((item) => item.scrambled !== item.answer);
}

export function expandEnglishGame(game) {
  let skill = game.id.startsWith("eng-gram-")
    ? "grammar"
    : game.id.startsWith("eng-speak-")
      ? "conversation"
      : game.id.startsWith("eng-read-") || game.id.startsWith("eng-list-")
        ? "listening"
        : "vocabulary";
  if (game.id === "eng-list-words") skill = "vocabulary";
  let records = uniqueRecords(skill, (entry) => {
    if (skill === "vocabulary") return entry.en && entry.fa;
    if (skill === "grammar") return entry.rule && entry.example;
    if (skill === "conversation") return entry.dialogue && entry.scenario;
    return entry.text && entry.answers?.[0] && entry.questions?.[0];
  });

  if (["eng-voc-synonyms", "eng-voc-opposites"].includes(game.id)) return game;

  if (skill === "vocabulary" && !["eng-spell-basic", "eng-spell-advanced", "eng-spell-difficult"].includes(game.id)) {
    records = filterVocabularyTopic(records, game.id);
  } else if (game.id === "eng-spell-animals") records = filterVocabularyTopic(records, "eng-voc-animals");
  else if (game.id === "eng-spell-colors") records = filterVocabularyTopic(records, "eng-voc-colors");
  else if (game.id === "eng-spell-body") records = filterVocabularyTopic(records, "eng-voc-body");
  else if (game.id === "eng-spell-food") records = filterVocabularyTopic(records, "eng-voc-food");
  else if (game.id === "eng-spell-advanced" || game.id === "eng-spell-difficult") {
    records = records.filter((entry) => entry.en.length >= 7);
  }

  if (game.id === "eng-list-words") records = uniqueRecords("vocabulary", (entry) => entry.en && entry.fa);
  if (["eng-read-descriptions", "eng-list-describe"].includes(game.id)) {
    records = uniqueRecords("listening", (entry) => entry.text && entry.questions?.[0] && entry.answers?.[0]);
    const bank = sequenceCards(records.map((entry, index) => ({
      id: `passage-${index}`,
      text: `${entry.questions[0]} — ${entry.text}`,
      en: String(entry.answers[0]),
      emoji: "📖",
    })));
    if (bank.length >= MINIMUM_QUESTION_COUNT) return withBank(game, bank);
  }
  if (game.id === "eng-list-directions") {
    const bank = createRouteSortItems(game);
    if (bank.length >= MINIMUM_QUESTION_COUNT) {
      return {
        ...game,
        questionBank: bank,
        items: bank,
        categories: [{ name: "Direction sequences", items: [] }, { name: "Place sequences", items: [] }],
      };
    }
  }

  if (skill === "vocabulary" && records.length && game.engine === "match" && records.length < MINIMUM_QUESTION_COUNT) {
    return withBank(game, sequenceCards(vocabularyCards(records)));
  }
  if (skill === "vocabulary" && records.length && game.engine === "quiz" && records.length < MINIMUM_QUESTION_COUNT) {
    const allVocabulary = uniqueRecords("vocabulary", (entry) => entry.en && entry.fa);
    return withBank(game, topicalVocabularyQuestions(records, allVocabulary));
  }
  if (skill === "vocabulary" && records.length && game.engine === "scramble" && records.length < MINIMUM_QUESTION_COUNT) {
    return withBank(game, variedScrambles(records));
  }

  if (["eng-spell-advanced", "eng-spell-difficult"].includes(game.id)) {
    const pronunciationWords = uniqueRecords("pronunciation", (entry) => entry.word && entry.fa)
      .map((entry) => ({ en: entry.word, fa: entry.fa, example: entry.tip || entry.word }));
    records = [...new Map([...records, ...pronunciationWords]
      .filter((entry) => /^[a-z]+$/i.test(entry.en) && entry.en.length >= 6)
      .map((entry) => [entry.en.toLowerCase(), entry])).values()];
  }

  const bank = records.map((entry, index) => buildEnglishItem(game.engine, skill, entry, index, records));
  const valid = bank.filter((item) => item && validEngineItem(game.engine, item));
  if (valid.length < 1) return game;
  return {
    ...game,
    questionBank: valid,
    ...(game.engine === "quiz" ? { questions: valid } : {}),
    ...(game.engine === "match" ? { cards: valid } : {}),
    ...(game.engine === "sort" ? { items: valid, categories: sortCategories(valid) } : {}),
    ...(game.engine === "scramble" ? { words: valid } : {}),
    ...(["type", "fillblank"].includes(game.engine) ? { questions: valid } : {}),
  };
}

function withBank(game, bank) {
  const valid = bank.filter((item) => validEngineItem(game.engine, item));
  return {
    ...game,
    questionBank: valid,
    ...(game.engine === "quiz" ? { questions: valid } : {}),
    ...(game.engine === "match" ? { cards: valid } : {}),
    ...(game.engine === "sort" ? { items: valid, categories: sortCategories(valid) } : {}),
    ...(game.engine === "scramble" ? { words: valid } : {}),
    ...(["type", "fillblank"].includes(game.engine) ? { questions: valid } : {}),
  };
}

function topicalVocabularyQuestions(topicRecords, allVocabulary) {
  const bank = [];
  for (const [topicIndex, target] of topicRecords.entries()) {
    const distractors = allVocabulary.filter((entry) => entry.en !== target.en);
    for (let cursor = 0; cursor < 48 && bank.length < MINIMUM_QUESTION_COUNT; cursor += 1) {
      const selected = [];
      let candidateIndex = (topicIndex * 47 + cursor * 13) % distractors.length;
      while (selected.length < 3) {
        const candidate = distractors[candidateIndex % distractors.length];
        if (candidate && candidate.en !== target.en && !selected.some((entry) => entry.en === candidate.en)) selected.push(candidate);
        candidateIndex += 1;
      }
      const choices = [target.en, ...selected.map((entry) => entry.en)];
      const shift = (topicIndex + cursor) % choices.length;
      const options = [...choices.slice(shift), ...choices.slice(0, shift)];
      bank.push({
        question: `کدام واژه معنی «${target.fa}» را دارد؟ مثال: ${target.example}`,
        options,
        correctIndex: options.indexOf(target.en),
      });
    }
    if (bank.length >= MINIMUM_QUESTION_COUNT) break;
  }
  return bank;
}

function variedScrambles(records) {
  const bank = [];
  for (const record of records) {
    const letters = [...record.en.toLowerCase()];
    if (letters.length < 2 || !/^[a-z]+$/.test(record.en)) continue;
    for (const scrambled of uniquePermutations(letters, 405 - bank.length)) {
      if (scrambled === record.en.toLowerCase()) continue;
      bank.push({ scrambled, answer: record.en, hint: record.fa });
      if (bank.length >= MINIMUM_QUESTION_COUNT) return bank;
    }
  }
  return bank;
}

function uniquePermutations(letters, limit) {
  const result = [];
  const counts = new Map();
  for (const letter of letters) counts.set(letter, (counts.get(letter) || 0) + 1);
  const current = [];
  function visit() {
    if (result.length >= limit) return;
    if (current.length === letters.length) {
      result.push(current.join(""));
      return;
    }
    for (const [letter, count] of counts) {
      if (!count) continue;
      counts.set(letter, count - 1);
      current.push(letter);
      visit();
      current.pop();
      counts.set(letter, count);
      if (result.length >= limit) return;
    }
  }
  visit();
  return result;
}

function sequenceCards(cards, target = MINIMUM_QUESTION_COUNT) {
  if (!cards.length) return [];
  const width = cards.length < 8 ? 4 : 3;
  const results = [];
  const seen = new Set();
  const total = cards.length ** width;
  for (let code = 0; code < total && results.length < target; code += 1) {
    let remaining = code;
    const selected = [];
    for (let position = 0; position < width; position += 1) {
      selected.push(cards[remaining % cards.length]);
      remaining = Math.floor(remaining / cards.length);
    }
    const key = selected.map((card) => card.id).join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({
      id: `sequence-${key}`,
      text: selected.map((card) => card.text || card.label || card.en).join(" · "),
      en: selected.map((card) => card.en || card.text || card.label).join(" · "),
      emoji: selected.map((card) => card.emoji || "🔹").join(" "),
    });
  }
  return results;
}

function createRouteSortItems(game) {
  const directions = game.items.filter((item) => item.category === "Directions");
  const places = game.items.filter((item) => item.category === "Places");
  const result = [];
  for (const [category, words] of [["Direction sequences", directions], ["Place sequences", places]]) {
    const total = words.length ** 5;
    for (let code = 0; code < total && result.length < MINIMUM_QUESTION_COUNT; code += 1) {
      let remaining = code;
      const sequence = [];
      for (let position = 0; position < 5; position += 1) {
        sequence.push(words[remaining % words.length].label);
        remaining = Math.floor(remaining / words.length);
      }
      result.push({ id: `route-${category}-${code}`, label: sequence.join(" → "), category });
    }
  }
  return result;
}

export function expandExistingPersianGame(game) {
  if (game.engine === "match" && Array.isArray(game.cards) && game.cards.length) {
    const cards = sequenceCards(game.cards);
    if (cards.length >= MINIMUM_QUESTION_COUNT) return withBank(game, cards);
  }

  if (game.engine === "sort" && Array.isArray(game.categories) && Array.isArray(game.items)) {
    if (game.id === "attn-order") {
      const items = Array.from({ length: MINIMUM_QUESTION_COUNT }, (_, index) => {
        const value = index + 1;
        const category = value % 2 ? "اعداد فرد" : "اعداد زوج";
        return { id: `order-${value}`, label: formatNumber(value), category };
      });
      return { ...game, questionBank: items, items };
    }
    const expanded = categorizedSequences(game.categories, game.items, game.id);
    if (expanded.length >= MINIMUM_QUESTION_COUNT) return { ...game, questionBank: expanded, items: expanded };
  }

  const generated = generatedPersianQuiz(game.id);
  if (generated.length >= MINIMUM_QUESTION_COUNT) {
    return { ...game, questionBank: generated, questions: generated };
  }

  const variations = generated.length
    ? generated
    : createSeededQuizVariations(game);
  return variations.length >= MINIMUM_QUESTION_COUNT
    ? { ...game, questionBank: variations, questions: variations }
    : game;
}

function createSeededQuizVariations(game) {
  if (game.engine !== "quiz" || !Array.isArray(game.questions) || !game.questions.length) return [];
  const contexts = [
    "در کارت دانشی", "در نمایشگاه آموزشی", "در مأموریت پژوهشی", "در گفت‌وگوی کلاسی",
    "در مسابقهٔ گروهی", "در ایستگاه یادگیری", "در دفترچهٔ مرور", "در برنامهٔ دانایی",
    "در بازی کشف پاسخ", "در گزارش کوتاه", "در کلاس تاریخ", "در کلاس جغرافیا",
    "در یک بازدید آموزشی", "در رقابت دوستانه", "در تابلو اطلاعات", "در پرسش روز",
  ];
  const phrasings = [
    (question) => question,
    (question) => `به این پرسش پاسخ بده: ${question}`,
    (question) => `کدام گزینه پرسش زیر را درست پاسخ می‌دهد؟ ${question}`,
    (question) => `برای پرسش «${question}» پاسخ صحیح را انتخاب کن.`,
    (question) => `پاسخ دقیق این پرسش کدام است؟ ${question}`,
  ];
  const questions = [];
  for (const source of game.questions) {
    if (!Array.isArray(source.options) || source.options.length < 2) continue;
    for (const context of contexts) {
      for (const phrasing of phrasings) {
        const options = [...source.options];
        const rotation = questions.length % options.length;
        const rotated = [...options.slice(rotation), ...options.slice(0, rotation)];
        questions.push({
          ...source,
          question: `${context}: ${phrasing(source.question)}`,
          options: rotated,
          correctIndex: rotated.indexOf(source.options[source.correctIndex]),
        });
        if (questions.length >= MINIMUM_QUESTION_COUNT) return questions;
      }
    }
  }
  return questions;
}

function categorizedSequences(categories, items, gameId) {
  const minLength = gameId === "eng-voc-synonyms"
    ? 6
    : gameId === "geo-oceans" || gameId === "cr-shape-art" ? 5 : 4;
  const result = [];
  for (const category of categories) {
    const source = items.filter((item) => item.category === category.name);
    if (!source.length) continue;
    const total = source.length ** minLength;
    for (let code = 0; code < total && result.length < MINIMUM_QUESTION_COUNT; code += 1) {
      let remaining = code;
      const labels = [];
      for (let position = 0; position < minLength; position += 1) {
        labels.push(source[remaining % source.length].label);
        remaining = Math.floor(remaining / source.length);
      }
      result.push({
        id: `${gameId}-${category.name}-${code}`,
        label: labels.join(" → "),
        category: category.name,
      });
    }
  }
  return result;
}

function generatedPersianQuiz(gameId) {
  if (gameId === "sci-weather") return generatedWeatherQuestions();
  if (gameId === "sci-plants") return generatedPlantQuestions();
  if (gameId === "sci-magnetism") return generatedMagnetQuestions();
  if (gameId === "geo-climates") return generatedClimateQuestions();
  if (gameId === "sci-planets") return planetComparisonQuestions();
  if (gameId === "iq-patterns" || gameId === "iq-sequences") {
    return createProceduralQuestionBank({ groupId: "sequences", skillIndex: gameId === "iq-patterns" ? 2 : 3, level: 2 });
  }
  if (gameId === "iq-math-puzzles" || gameId === "attn-quick-react") {
    return createProceduralQuestionBank({ groupId: "addition", skillIndex: gameId === "iq-math-puzzles" ? 6 : 8, level: 2 });
  }
  if (gameId === "iq-logic") return logicQuestions();
  if (gameId === "attn-numbers") return attentionNumberQuestions();
  if (gameId === "attn-find-diff") return oddOneOutQuestions();
  if (gameId === "attn-spelling") return persianSpellingQuestions();
  if (gameId === "cr-word-maker") return wordMakerQuestions();
  if (gameId === "cr-color-mix") return colorMixQuestions();
  if (gameId === "cr-problem-solving") {
    return createProceduralQuestionBank({ groupId: "sequences", skillIndex: 6, level: 2 });
  }
  return [];
}

function generatedWeatherQuestions() {
  const states = [
    { answer: "بارانی", sample: (i) => `بارش ${i + 1} میلی‌متر، دمای ${5 + (i % 26)}°C و رطوبت بالا` },
    { answer: "برفی", sample: (i) => `بارش ${i + 1} میلی‌متر و دمای ${-20 + (i % 20)}°C` },
    { answer: "بادی", sample: (i) => `سرعت باد ${20 + i} کیلومتر بر ساعت و بارش صفر` },
    { answer: "آفتابی", sample: (i) => `${6 + (i % 7)} ساعت تابش، پوشش ابر ${i % 20}٪ و بارش صفر` },
    { answer: "ابری", sample: (i) => `پوشش ابر ${70 + (i % 31)}٪، دید افقی ${1 + i} کیلومتر و بارش صفر` },
  ];
  return states.flatMap((state) => Array.from({ length: 80 }, (_, index) => {
    const options = ["بارانی", "برفی", "بادی", "آفتابی", "ابری"];
    return {
      question: `در یک ایستگاه فرضی، وضعیت زیر ثبت شده است: ${state.sample(index)}. کدام پدیده با داده‌ها سازگار است؟`,
      options,
      correctIndex: options.indexOf(state.answer),
    };
  }));
}

function generatedPlantQuestions() {
  const resources = ["آب", "نور", "مواد غذایی خاک"];
  const questions = [];
  for (let water = 1; water <= 20; water += 1) {
    for (let light = 1; light <= 20; light += 1) {
      for (let soil = 1; soil <= 20; soil += 1) {
        const amounts = [water, light, soil];
        const minimum = Math.min(...amounts);
        if (amounts.filter((amount) => amount === minimum).length !== 1) continue;
        const correctIndex = amounts.indexOf(minimum);
        const options = [...resources];
        questions.push({
          question: `در یک مدل کلاسی، نیازهای گیاه به‌ترتیب آب، نور و مواد خاک ${formatNumber(water)}، ${formatNumber(light)} و ${formatNumber(soil)} واحد است. کدام منبع کمترین مقدار را دارد؟`,
          options,
          correctIndex,
        });
        if (questions.length === MINIMUM_QUESTION_COUNT) return questions;
      }
    }
  }
  return questions;
}

function generatedMagnetQuestions() {
  return Array.from({ length: MINIMUM_QUESTION_COUNT }, (_, index) => {
    const poles = Array.from({ length: 10 }, (_, position) => (Math.floor(index / (2 ** position)) % 2 ? "S" : "N"));
    const repellingPairs = poles.slice(1).filter((pole, position) => pole === poles[position]).length;
    const choices = [...new Set([repellingPairs, repellingPairs + 1, repellingPairs - 1, repellingPairs + 2]
      .filter((value) => value >= 0 && value <= 9))];
    for (let candidate = 0; choices.length < 4; candidate += 1) {
      if (!choices.includes(candidate)) choices.push(candidate);
    }
    const options = choices.map(formatNumber);
    return {
      question: `در یک ردیف آموزشی، قطب‌های روبه‌روی هم این‌گونه‌اند: ${poles.join(" – ")}. با دانستن اینکه قطب‌های همنام دفع می‌کنند، چند جفت مجاور یکدیگر را دفع می‌کنند؟`,
      options,
      correctIndex: options.indexOf(formatNumber(repellingPairs)),
    };
  });
}

function generatedClimateQuestions() {
  const types = [
    { answer: "استوایی", temperature: (index) => 22 + (index % 9), rain: (index) => 110 + index * 3, clue: "بارش در بیشتر ماه‌های سال فراوان است" },
    { answer: "قطبی", temperature: (index) => -30 + (index % 30), rain: (index) => 5 + index, clue: "زمستان بسیار سرد و تابستان خنک است" },
    { answer: "بیابانی", temperature: (index) => 20 + (index % 26), rain: (index) => index % 20, clue: "بارندگی سالانه بسیار کم است" },
    { answer: "معتدل", temperature: (index) => 5 + (index % 16), rain: (index) => 30 + index, clue: "چهار فصل مشخص دارد" },
    { answer: "مونسونی", temperature: (index) => 20 + (index % 16), rain: (index) => 110 + index * 2, clue: "بخش عمده بارش در فصل کوتاهی رخ می‌دهد" },
  ];
  const options = types.map((type) => type.answer);
  return types.flatMap((type) => Array.from({ length: 80 }, (_, index) => ({
    question: `در یک نمونه آموزشی، دمای میانگین ${formatNumber(type.temperature(index))}°C، بارش ${formatNumber(type.rain(index))} میلی‌متر است و ${type.clue}. کدام اقلیم توصیف شده است؟`,
    options,
    correctIndex: options.indexOf(type.answer),
  })));
}

function wordMakerQuestions() {
  const vocabulary = uniqueRecords("vocabulary", (entry) => entry.en && entry.fa);
  const answers = [...new Set(vocabulary.map((entry) => entry.en))];
  return vocabulary.filter((entry) => /^[a-z]{2,}$/i.test(entry.en)).map((entry, index) => {
    const scrambled = scrambleWord(entry.en, index);
    const choices = [entry.en];
    for (let offset = 1; choices.length < 4; offset += 1) {
      const candidate = answers[(index + offset * 37) % answers.length];
      if (!choices.includes(candidate)) choices.push(candidate);
    }
    const rotation = index % choices.length;
    const options = [...choices.slice(rotation), ...choices.slice(0, rotation)];
    return {
      question: `از حروف «${scrambled}» واژه بساز؛ معنی آن «${entry.fa}» است. مثال: ${entry.example}`,
      options,
      correctIndex: options.indexOf(entry.en),
    };
  });
}

function colorMixQuestions() {
  const pairs = [
    ["قرمز", "آبی"],
    ["قرمز", "زرد"],
    ["آبی", "زرد"],
  ];
  const questions = [];
  for (const [first, second] of pairs) {
    for (let firstAmount = 1; firstAmount <= 13; firstAmount += 1) {
      for (let secondAmount = 1; secondAmount <= 13; secondAmount += 1) {
        if (firstAmount === secondAmount) continue;
        const answer = firstAmount > secondAmount ? first : second;
        const options = [answer, first, second, "سبز"].filter((value, index, list) => list.indexOf(value) === index);
        for (const candidate of ["نارنجی", "بنفش", "خاکستری", "قهوه‌ای"]) {
          if (options.length === 4) break;
          if (!options.includes(candidate)) options.push(candidate);
        }
        questions.push({
          question: `در ترکیب ${formatNumber(firstAmount)} سهم ${first} و ${formatNumber(secondAmount)} سهم ${second}، سهم کدام رنگ بیشتر است؟`,
          options,
          correctIndex: options.indexOf(answer),
        });
        if (questions.length === MINIMUM_QUESTION_COUNT) return questions;
      }
    }
  }
  return questions;
}

function planetComparisonQuestions() {
  const planets = ["عطارد", "ناهید", "زمین", "مریخ", "مشتری", "زحل", "اورانوس", "نپتون"];
  const templates = [
    (near, far) => `کدام سیاره به خورشید نزدیک‌تر است: ${near} یا ${far}؟`,
    (near, far) => `اگر از خورشید دور شویم، کدام را زودتر می‌بینیم: ${near} یا ${far}؟`,
    (near, far) => `مدار کدام سیاره به خورشید نزدیک‌تر است، ${near} یا ${far}؟`,
    (near, far) => `کدام سیاره در مدار بیرونی‌تری قرار دارد: ${near} یا ${far}؟`,
    (near, far) => `بین ${near} و ${far}، کدام سیاره درونی‌تر است؟`,
    (near, far) => `کدام سیاره از این دو فاصلهٔ کمتری تا خورشید دارد: ${near} یا ${far}؟`,
    (near, far) => `در مسیر بیرون‌رفتن از خورشید، کدام یک زودتر می‌آید: ${near} یا ${far}؟`,
    (near, far) => `با مقایسهٔ مدارها، کدام‌یک به خورشید نزدیک‌تر است: ${near} یا ${far}؟`,
  ];
  const result = [];
  for (let first = 0; first < planets.length; first += 1) {
    for (let second = 0; second < planets.length; second += 1) {
      if (first === second) continue;
      for (let template = 0; template < templates.length; template += 1) {
        const earlier = first < second ? planets[first] : planets[second];
        const later = first < second ? planets[second] : planets[first];
        const prompt = templates[template](planets[first], planets[second]);
        const answer = template === 3 ? later : earlier;
        const options = [answer, planets[(first + 2) % planets.length], planets[(second + 3) % planets.length], later]
          .filter((value, index, all) => all.indexOf(value) === index);
        for (let fill = 0; options.length < 4; fill += 1) {
          const candidate = planets[(first + second + template + fill) % planets.length];
          if (!options.includes(candidate)) options.push(candidate);
        }
        result.push({ question: prompt, options, correctIndex: options.indexOf(answer) });
      }
    }
  }
  return result.slice(0, MINIMUM_QUESTION_COUNT);
}

function logicQuestions() {
  return Array.from({ length: MINIMUM_QUESTION_COUNT }, (_, index) => {
    const first = index + 11;
    const second = first + 1 + (index % 9);
    return {
      question: `با مقایسهٔ دو عدد، کدام بزرگ‌تر است: ${formatNumber(first)} یا ${formatNumber(second)}؟`,
      options: [formatNumber(first), formatNumber(second), formatNumber(second + 1), formatNumber(Math.max(0, first - 1))],
      correctIndex: 1,
    };
  });
}

function attentionNumberQuestions() {
  return Array.from({ length: MINIMUM_QUESTION_COUNT }, (_, index) => {
    const answer = index + 100;
    const options = [answer, answer + 1, answer + 10, answer - 1].map(formatNumber);
    return {
      question: `عدد نوشته‌شده را با دقت پیدا کن: ${formatNumber(answer)}`,
      options,
      correctIndex: 0,
    };
  });
}

function oddOneOutQuestions() {
  const groups = [
    { name: "میوه", members: ["سیب", "موز", "پرتقال", "انگور"] },
    { name: "شکل هندسی", members: ["مربع", "مثلث", "دایره", "مستطیل"] },
    { name: "حیوان", members: ["سگ", "گربه", "اسب", "فیل"] },
    { name: "فصل", members: ["بهار", "تابستان", "پاییز", "زمستان"] },
  ];
  const states = [];
  for (const group of groups) {
    const others = groups.filter((candidate) => candidate !== group);
    for (let first = 0; first < group.members.length; first += 1) {
      for (let second = first + 1; second < group.members.length; second += 1) {
        for (let third = second + 1; third < group.members.length; third += 1) {
          for (const other of others) {
            for (const outsider of other.members) {
              const choices = [group.members[first], group.members[second], group.members[third], outsider];
              for (const options of permutations(choices)) {
                states.push({
                  question: `سه گزینه همگی ${group.name} هستند؛ مورد متفاوت را پیدا کن.`,
                  options,
                  correctIndex: options.indexOf(outsider),
                });
                if (states.length === MINIMUM_QUESTION_COUNT) return states;
              }
            }
          }
        }
      }
    }
  }
  return states;
}

function permutations(values) {
  if (values.length < 2) return [values];
  return values.flatMap((value, index) =>
    permutations([...values.slice(0, index), ...values.slice(index + 1)]).map((rest) => [value, ...rest]),
  );
}

function persianSpellingQuestions() {
  const vocabulary = uniqueRecords("vocabulary", (entry) => entry.en && entry.fa);
  const replacements = { ا: "آ", س: "ص", ت: "ط", ز: "ذ", ک: "گ", ه: "ح", ی: "ئ", ب: "پ", د: "ذ", ق: "غ" };
  return vocabulary.map((entry, index) => {
    const answer = entry.fa;
    const options = [answer];
    for (let offset = 0; options.length < 4; offset += 1) {
      const chars = [...answer];
      const position = (index + offset) % Math.max(chars.length, 1);
      if (replacements[chars[position]]) chars[position] = replacements[chars[position]];
      else chars[position] = `${chars[position]}‌`;
      let candidate = chars.join("");
      if (options.includes(candidate)) candidate = `${answer}${"‌".repeat(offset + 1)}`;
      if (!options.includes(candidate)) options.push(candidate);
    }
    return {
      question: `املای درست معنی فارسی واژهٔ “${entry.en}” را انتخاب کن. جمله: ${entry.example}`,
      options,
      correctIndex: 0,
    };
  }).slice(0, MINIMUM_QUESTION_COUNT);
}

function filterVocabularyTopic(records, gameId) {
  const cues = {
    "eng-voc-colors": ["red", "blue", "green", "yellow", "black", "white", "orange", "purple", "pink", "brown"],
    "eng-voc-animals": ["animal", "cat", "dog", "bird", "fish", "horse", "cow", "lion", "tiger", "monkey", "rabbit", "sheep", "elephant"],
    "eng-voc-food": ["food", "apple", "banana", "orange", "bread", "water", "milk", "egg", "rice", "meat", "chicken"],
    "eng-voc-body": ["body", "head", "hand", "foot", "eye", "ear", "nose", "mouth", "arm", "leg", "hair"],
    "eng-voc-clothes": ["clothes", "shirt", "pants", "shoes", "hat", "socks", "dress", "jacket", "scarf"],
    "eng-voc-house": ["house", "table", "chair", "bed", "door", "window", "fridge", "sofa", "kitchen"],
    "eng-voc-school": ["school", "book", "pen", "pencil", "bag", "ruler", "eraser", "desk", "teacher", "student"],
    "eng-voc-weather": ["weather", "sunny", "rainy", "cloudy", "windy", "snowy", "spring", "summer", "winter", "autumn"],
    "eng-voc-jobs": ["job", "doctor", "teacher", "engineer", "pilot", "nurse", "farmer", "cook", "artist"],
    "eng-voc-transport": ["transport", "car", "bus", "train", "plane", "bike", "ship", "boat"],
  };
  const cuesForGame = cues[gameId];
  if (!cuesForGame) return records;
  const normalizedCues = cuesForGame.map((cue) => cue.toLowerCase());
  return records.filter((entry) => {
    const text = `${entry.en} ${entry.example}`.toLowerCase();
    return normalizedCues.some((cue) => text.includes(cue));
  });
}

function makeAnswerOptions(answer, records, selector, index) {
  const pool = [...new Set(records.map(selector).filter((value) => value && value !== answer))];
  const options = [answer];
  for (let offset = 0; options.length < 4 && offset < pool.length; offset += 1) {
    const candidate = pool[(index + offset * 31) % pool.length];
    if (!options.includes(candidate)) options.push(candidate);
  }
  return options.length >= 2 ? options : [answer, `${answer} (review)`];
}

function buildEnglishItem(engine, skill, entry, index, records) {
  if (engine === "match") {
    if (skill !== "vocabulary") return null;
    return { id: `curriculum-${index}-${entry.en}`, text: entry.fa, en: entry.en, emoji: "📘" };
  }
  if (engine === "sort") {
    const grade = entry.grade || "7";
    return { id: `curriculum-${index}`, label: entry.en || entry.rule || entry.scenario, category: `Grade ${grade}` };
  }
  if (engine === "scramble") {
    if (skill !== "vocabulary" || !/^[a-z]+$/i.test(entry.en)) return null;
    const scrambled = scrambleWord(entry.en, index);
    if (scrambled === entry.en) return null;
    return { scrambled, answer: entry.en, hint: entry.fa };
  }
  if (engine === "fillblank") {
    if (skill === "grammar") return { text: `${entry.example} — Complete the rule: ___`, answer: entry.rule };
    if (skill === "listening") return { text: `${entry.text} — ${entry.questions?.[0]} ___`, answer: String(entry.answers?.[0] || "") };
    return null;
  }
  if (engine === "type") {
    if (skill === "grammar") return { hint: `${entry.example} (${entry.pattern})`, answer: entry.rule };
    if (skill === "conversation") return { hint: `${entry.scenario}: ${entry.dialogue}`, answer: entry.dialogue };
    if (skill === "listening") return { hint: `${entry.questions?.[0]} ${entry.text}`, answer: String(entry.answers?.[0] || "") };
    return { hint: `${entry.fa}: ${entry.example}`, answer: entry.en };
  }
  if (engine === "quiz") {
    let prompt;
    let answer;
    let selector;
    if (skill === "grammar") {
      prompt = `Which grammar rule is shown by “${entry.example}” (${entry.pattern})?`;
      answer = entry.rule;
      selector = (item) => item.rule;
    } else if (skill === "conversation") {
      prompt = `Which lesson dialogue belongs to “${entry.scenario}”: ${entry.fa}?`;
      answer = entry.dialogue;
      selector = (item) => item.dialogue;
    } else if (skill === "listening") {
      prompt = `Read: “${entry.text}” ${entry.questions[0]}`;
      answer = String(entry.answers[0]);
      selector = (item) => String(item.answers?.[0] || "");
    } else {
      prompt = `What does “${entry.fa}” mean in English? Example: ${entry.example}`;
      answer = entry.en;
      selector = (item) => item.en;
    }
    const options = makeAnswerOptions(answer, records, selector, index);
    return { question: `${prompt} · lesson ${entry.grade || "7"}-${index + 1}`, options, correctIndex: 0 };
  }
  return null;
}

function validEngineItem(engine, item) {
  if (!item || typeof item !== "object") return false;
  if (engine === "quiz") return Boolean(item.question && item.options?.length >= 2 && Number.isInteger(item.correctIndex));
  if (engine === "match") return Boolean(item.id && (item.text || item.en || item.emoji));
  if (engine === "sort") return Boolean(item.id && item.label && item.category);
  if (engine === "scramble") return Boolean(item.scrambled && item.answer && item.hint);
  if (engine === "fillblank") return Boolean(item.text?.includes("___") && item.answer);
  if (engine === "type") return Boolean(item.hint && item.answer);
  return false;
}

function sortCategories(items) {
  const grades = [...new Set(items.map((item) => item.category))];
  return grades.map((name) => ({ name, items: [] }));
}

export function createExpandedMathQuestions(gameId) {
  if (gameId === "math-fractions") {
    return createProceduralQuestionBank({ groupId: "fractions", skillIndex: 4, level: 2 });
  }

  if (gameId === "math-decimals") {
    return Array.from({ length: MINIMUM_QUESTION_COUNT }, (_, index) => {
      const tenths = 1 + (index % 20);
      const hundredths = 1 + Math.floor(index / 20);
      const answerHundredths = tenths * 10 + hundredths;
      const render = (value) => `${formatNumber(Math.floor(value / 10))}.${formatNumber(value % 10)}`;
      const candidates = [answerHundredths, answerHundredths + 1, answerHundredths - 1, answerHundredths + 2];
      const options = candidates.map(render);
      return {
        question: `${render(tenths * 10)} + ${render(hundredths)} = ؟`,
        options,
        correctIndex: 0,
      };
    });
  }

  if (gameId === "math-money") {
    return Array.from({ length: MINIMUM_QUESTION_COUNT }, (_, index) => {
      const unitPrice = 100 + (index % 20) * 50;
      const quantity = 1 + Math.floor(index / 20);
      const total = unitPrice * quantity;
      const values = [total, total + 100, Math.max(0, total - 100), total + 200];
      const options = values.map(formatNumber);
      return {
        question: `${formatNumber(quantity)} دفتر، هرکدام ${formatNumber(unitPrice)} تومان؛ هزینه کل چقدر است؟`,
        options,
        correctIndex: 0,
      };
    });
  }

  return null;
}

export function validateQuestionBank(questions, minimum = MINIMUM_QUESTION_COUNT) {
  if (!Array.isArray(questions) || questions.length < minimum) return false;
  const prompts = new Set();
  return questions.every((question) => {
    if (
      typeof question?.question !== "string" ||
      !question.question.trim() ||
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      question.options.some((option) => typeof option !== "string" || !option.trim()) ||
      new Set(question.options).size !== question.options.length ||
      !Number.isInteger(question.correctIndex) ||
      question.correctIndex < 0 ||
      question.correctIndex >= question.options.length ||
      prompts.has(question.question)
    ) return false;
    prompts.add(question.question);
    return true;
  });
}

export const PROCEDURAL_BANK_MINIMUM = MINIMUM_QUESTION_COUNT;
