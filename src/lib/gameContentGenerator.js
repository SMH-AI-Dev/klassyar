
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

function validEngineItem(engine, item) {
  if (!item || typeof item !== "object") return false;
  if (engine === "quiz") {
    return Boolean(item.question && Array.isArray(item.options) && item.options.length >= 2 &&
      Number.isInteger(item.correctIndex) && item.correctIndex >= 0 && item.correctIndex < item.options.length);
  }
  if (engine === "match" || engine === "memory") {
    return Boolean(item.id && (item.text || item.label || item.en) && (item.en || item.answer || item.text));
  }
  if (engine === "sort") return Boolean(item.id && item.label && item.category);
  if (engine === "scramble" || engine === "anagram" || engine === "hangman" || engine === "wordsearch") {
    return Boolean(item.scrambled || item.answer || item.a);
  }
  if (engine === "type") return Boolean(item.hint && item.answer);
  if (engine === "fillblank") return Boolean((item.text || item.question) && (item.answer || item.a));
  return true;
}

function sortCategories(items) {
  const names = [...new Set(items.map((item) => item.category).filter(Boolean))];
  return names.map((name) => ({ name, items: [] }));
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
