export const demoSamples = {
  flashcard: {
    title: "حیوانات بامزه",
    description: "با حیوانات مختلف آشنا شو",
    type: "flashcard",
    content: {
      cards: [
        { front: "🐕", back: "سگ", icon: "🐕" },
        { front: "🐈", back: "گربه", icon: "🐈" },
        { front: "🐘", back: "فیل", icon: "🐘" },
        { front: "🦒", back: "زرافه", icon: "🦒" },
        { front: "🐬", back: "دلفین", icon: "🐬" },
      ]
    }
  },
  random_wheel: {
    title: "چرخ گردان گلها",
    description: "با چرخش چرخ اسم یک گل رو ببین",
    type: "random_wheel",
    content: {
      items: ["گل رز", "گل لاله", "گل مریم", "گل یاس", "گل آفتابگردون", "گل بنفشه", "گل داوودی", "گل نرگس", "گل شقایق", "گل کوکب"]
    }
  },
  matching: {
    title: "جورچین حیوانات",
    description: "هر حیوان رو به اسمش وصل کن",
    type: "matching",
    content: {
      pairs: [
        { left: { text: "🐕", icon: "🐕" }, right: { text: "سگ", icon: "🐕" } },
        { left: { text: "🐈", icon: "🐈" }, right: { text: "گربه", icon: "🐈" } },
        { left: { text: "🐘", icon: "🐘" }, right: { text: "فیل", icon: "🐘" } },
        { left: { text: "🦁", icon: "🦁" }, right: { text: "شیر", icon: "🦁" } },
        { left: { text: "🐰", icon: "🐰" }, right: { text: "خرگوش", icon: "🐰" } },
      ]
    }
  },
  quiz: {
    title: "آزمون علوم",
    description: "به سوالات علوم جواب بده",
    type: "quiz",
    content: {
      questions: [
        { question: "خورشید چه نوع ستاره‌ای است؟", options: ["سفید", "زرد", "قرمز", "آبی"], correct_answer: 1 },
        { question: "زمین چند قمر دارد؟", options: ["۱", "۲", "۳", "۰"], correct_answer: 0 },
        { question: "کدام حیوان سریع‌تر است؟", options: ["شیر", "یوزپلنگ", "فیل", "خرگوش"], correct_answer: 1 },
        { question: "آب در چه دمایی می‌جوشد؟", options: ["۵۰°", "۷۵°", "۱۰۰°", "۱۲۵°"], correct_answer: 2 },
        { question: "کدام سیاره به خورشید نزدیک‌تر است؟", options: ["زهره", "عطارد", "مریخ", "زمین"], correct_answer: 1 },
      ]
    }
  },
  group_sort: {
    title: "دسته‌بندی میوه و سبزی",
    description: "هر کدوم رو تو دسته درست بذار",
    type: "group_sort",
    content: {
      groups: [
        { name: "میوه", icon: "🍎" },
        { name: "سبزی", icon: "🥬" },
      ],
      items: [
        { text: "سیب", group: "میوه", icon: "🍎" },
        { text: "هویج", group: "سبزی", icon: "🥕" },
        { text: "موز", group: "میوه", icon: "🍌" },
        { text: "کاهو", group: "سبزی", icon: "🥗" },
        { text: "پرتقال", group: "میوه", icon: "🍊" },
        { text: "خیار", group: "سبزی", icon: "🥒" },
        { text: "انگور", group: "میوه", icon: "🍇" },
        { text: "گوجه", group: "سبزی", icon: "🍅" },
      ]
    }
  },
  wordsearch: {
    title: "جدول کلمات حیوانات",
    description: "اسم حیوانات را پیدا کن",
    type: "wordsearch",
    content: {
      words: ["سگ", "گربه", "فیل", "شیر", "خرگوش"]
    }
  },
  unjumble: {
    title: "کلمات بهم ریخته",
    description: "حروف را مرتب کن تا کلمه بسازی",
    type: "unjumble",
    content: {
      words: [
        { word: "کتاب", hint: "چیزی که می‌خوانیم" },
        { word: "گربه", hint: "حیوان خانگی" },
        { word: "خورشید", hint: "به آسمان می‌درخشد" },
        { word: "مدرسه", hint: "جایی برای یادگیری" },
        { word: "باران", hint: "از آسمان می‌بارد" },
      ]
    }
  },
  whack_a_mole: {
    title: "بزن بزن ریاضی",
    description: "جواب درست رو بزن",
    type: "whack_a_mole",
    content: {
      items: [
        { question: "۲+۲", answer: true },
        { question: "۳+۵", answer: true },
        { question: "۱۰-۳", answer: true },
        { question: "۲+۲=۵", answer: false },
        { question: "۴×۲=۸", answer: true },
        { question: "۶÷۲=۲", answer: false },
        { question: "۵+۳=۱۰", answer: false },
        { question: "۷-۴=۳", answer: true },
      ]
    }
  },
  true_false: {
    title: "درست یا غلط",
    description: "جملات درست را تشخیص بده",
    type: "true_false",
    content: {
      questions: [
        { question: "آب در ۱۰۰ درجه می‌جوشد", correctAnswer: true },
        { question: "ماه یک ستاره است", correctAnswer: false },
        { question: "زمین به دور خورشید می‌چرخد", correctAnswer: true },
        { question: "فیل کوچکترین حیوان است", correctAnswer: false },
        { question: "خورشید یک ستاره است", correctAnswer: true },
        { question: "نهنگ یک ماهی است", correctAnswer: false },
        { question: "گیاهان اکسیژن تولید می‌کنند", correctAnswer: true },
        { question: "شب از روز گرم‌تر است", correctAnswer: false },
      ]
    }
  },
  memory_game: {
    title: "بازی حافظه",
    description: "جفت‌های مشابه را پیدا کن",
    type: "memory_game",
    content: {
      pairs: [
        { item1: { icon: "🐶", text: "سگ" }, item2: { icon: "🐶", text: "سگ" } },
        { item1: { icon: "🐱", text: "گربه" }, item2: { icon: "🐱", text: "گربه" } },
        { item1: { icon: "🐰", text: "خرگوش" }, item2: { icon: "🐰", text: "خرگوش" } },
        { item1: { icon: "🐸", text: "قورباغه" }, item2: { icon: "🐸", text: "قورباغه" } },
      ]
    }
  },
  fill_blank: {
    title: "جای خالی",
    description: "کلمه مناسب را در جای خالی بنویس",
    type: "fill_blank",
    content: {
      questions: [
        { question: "آسمان ___ است", answer: "آبی" },
        { question: "خورشید ___ می‌دهد", answer: "نور" },
        { question: "ماهی در ___ زندگی می‌کند", answer: "آب" },
        { question: "پرندگان ___ دارند", answer: "بال" },
        { question: "درختان ___ دارند", answer: "برگ" },
      ]
    }
  },
  ranking: {
    title: "مرتب‌سازی اعداد",
    description: "اعداد را از کوچک به بزرگ مرتب کن",
    type: "ranking",
    content: {
      items: ["۱", "۲", "۳", "۴", "۵"]
    }
  },
  crossword: {
    title: "جدول کلمات",
    description: "کلمه را با کمک راهنما پیدا کن",
    type: "crossword",
    content: {
      items: [
        { word: "خورشید", clue: "به آسمان می‌درخشد" },
        { word: "باران", clue: "از آسمان می‌بارد" },
        { word: "ابر", clue: "در آسمان سفید یا خاکستری است" },
        { word: "باد", clue: "هوا را حرکت می‌دهد" },
        { word: "برف", clue: "سفید از آسمان می‌آید" },
      ]
    }
  },
  timeline: {
    title: "خط زمانی روز",
    description: "رویدادهای روز را مرتب کن",
    type: "timeline",
    content: {
      items: [
        { text: "بیدار شدن", order: 1 },
        { text: "صبحانه خوردن", order: 2 },
        { text: "رفتن به مدرسه", order: 3 },
        { text: "ناهار خوردن", order: 4 },
        { text: "بازی کردن", order: 5 },
        { text: "شام خوردن", order: 6 },
        { text: "خوابیدن", order: 7 },
      ]
    }
  },
  spinner: {
    title: "اسپینر سوالات",
    description: "چرخ رو بچرخون و به سوال جواب بده",
    type: "spinner",
    content: {
      items: ["صورتت رو بزن", "یکی از دوستات رو صدا کن", "یک معما بگو", "یک شعر بخون", "یک حرکت بامزه انجام بده", "یک داستان کوتاه بگو"]
    }
  },
  card_flip: {
    title: "کارت چرخان",
    description: "کارت‌ها را برگردون و جفت‌ها رو پیدا کن",
    type: "card_flip",
    content: {
      items: [
        { pairId: 1, text: "🐕", front: "🐕" },
        { pairId: 2, text: "🐈", front: "🐈" },
        { pairId: 3, text: "🐘", front: "🐘" },
        { pairId: 4, text: "🦁", front: "🦁" },
        { pairId: 5, text: "🐰", front: "🐰" },
      ]
    }
  },
  hotspot: {
    title: "نقطه فعال",
    description: "روی نقاط درست تصویر کلیک کن",
    type: "hotspot",
    content: {
      items: [
        { label: "سر", x: 50, y: 20 },
        { label: "دست", x: 20, y: 50 },
        { label: "پا", x: 50, y: 80 },
        { label: "شکم", x: 50, y: 50 },
      ]
    }
  },
  drag_text: {
    title: "کشیدن متن",
    description: "کلمات را به جای درست بکش",
    type: "drag_text",
    content: {
      items: [
        { sentence: "من ___ می‌خوانم", blanks: ["کتاب"], words: ["کتاب", "قاشق", "میز"] },
        { sentence: "در آسمان ___ می‌درخشد", blanks: ["خورشید"], words: ["خورشید", "ماهی", "سگ"] },
        { sentence: "ما در ___ زندگی می‌کنیم", blanks: ["زمین"], words: ["زمین", "ماه", "ستاره"] },
        { sentence: "___ یک حیوان است", blanks: ["گربه"], words: ["گربه", "میز", "مداد"] },
      ]
    }
  },
  balloon_pop: {
    title: "ترکاندن بادکنک",
    description: "بادکنک جواب درست رو بترکان",
    type: "balloon_pop",
    content: {
      items: [
        { question: "۲+۲ چند می‌شود؟", options: ["۳", "۴", "۵", "۶"], answer: "۴" },
        { question: "رنگ آسمان چیست؟", options: ["قرمز", "سبز", "آبی", "زرد"], answer: "آبی" },
        { question: "کدام حیوان می‌پرد؟", options: ["ماهی", "گنجشک", "فیل", "سگ"], answer: "گنجشک" },
        { question: "چه چیزی در آسمان می‌درخشد؟", options: ["سنگ", "خورشید", "کتاب", "میز"], answer: "خورشید" },
      ]
    }
  },
  gameshow_quiz: {
    title: "مسابقه تلویزیونی",
    description: "در مسابقه شرکت کن و برنده شو",
    type: "gameshow_quiz",
    content: {
      items: [
        { question: "پایتخت ایران کجاست؟", options: ["اصفهان", "تهران", "شیراز", "مشهد"], correct: "تهران" },
        { question: "کدام سیاره سرخ است؟", options: ["مریخ", "زهره", "زمین", "مشتری"], correct: "مریخ" },
        { question: "بزرگترین اقیانوس کدام است؟", options: ["اطلس", "آرام", "هند", "قطب شمال"], correct: "آرام" },
        { question: "کدام حیوان تخم می‌گذارد؟", options: ["سگ", "گربه", "مرغ", "فیل"], correct: "مرغ" },
      ]
    }
  },
  maze_chase: {
    title: "مارپیچ اعداد",
    description: "با جواب‌های درست از مارپیچ رد شو",
    type: "maze_chase",
    content: {
      items: [
        { question: "۳+۲", options: ["۴", "۵", "۶"], answer: "۵" },
        { question: "۴-۱", options: ["۲", "۳", "۴"], answer: "۳" },
        { question: "۵+۳", options: ["۷", "۸", "۹"], answer: "۸" },
        { question: "۶-۲", options: ["۳", "۴", "۵"], answer: "۴" },
      ]
    }
  },
  airplane: {
    title: "هواپیما",
    description: "به سمت جواب درست پرواز کن",
    type: "airplane",
    content: {
      items: [
        { question: "خورشید چه رنگی است؟", options: ["قرمز", "زرد", "آبی"], answer: "زرد" },
        { question: "آب چه رنگی است؟", options: ["بی‌رنگ", "سبز", "قرمز"], answer: "بی‌رنگ" },
        { question: "چمن چه رنگی است؟", options: ["زرد", "آبی", "سبز"], answer: "سبز" },
      ]
    }
  },
  open_the_box: {
    title: "جعبه را باز کن",
    description: "جعبه‌ها را باز کن و سوال رو جواب بده",
    type: "open_the_box",
    content: {
      items: [
        { question: "فیل کجاست زندگی می‌کند؟", options: ["آفریقا", "قطب", "کویر"], answer: "آفریقا" },
        { question: "نهنگ در کجا زندگی می‌کند؟", options: ["دریا", "صحرا", "جنگل"], answer: "دریا" },
        { question: "شتر کجا زندگی می‌کند؟", options: ["جنگل", "کویر", "دریا"], answer: "کویر" },
        { question: "خرس کجا زندگی می‌کند؟", options: ["جنگل", "بیابان", "اقیانوس"], answer: "جنگل" },
      ]
    }
  },
  missing_word: {
    title: "کلمه گمشده",
    description: "کلمه مناسب را انتخاب کن",
    type: "missing_word",
    content: {
      items: [
        { sentence: "آسمان ___ است", options: ["آبی", "قرمز", "سبز"], answer: "آبی" },
        { sentence: "برف ___ است", options: ["سیاه", "سفید", "سبز"], answer: "سفید" },
        { sentence: "موز ___ است", options: ["قرمز", "بنفش", "زرد"], answer: "زرد" },
        { sentence: "چمن ___ است", options: ["آبی", "سبز", "قرمز"], answer: "سبز" },
        { sentence: "خون ___ است", options: ["قرمز", "آبی", "سبز"], answer: "قرمز" },
      ]
    }
  },
  anagram: {
    title: "آناگرام حیوانات",
    description: "حروف را مرتب کن و اسم حیوان را پیدا کن",
    type: "anagram",
    content: {
      items: [
        { word: "سگ", hint: "وفادار" },
        { word: "گربه", hint: "موش می‌گیرد" },
        { word: "فیل", hint: "خرطوم دارد" },
        { word: "شیر", hint: "سلطان جنگل" },
        { word: "خرگوش", hint: "هویج دوست دارد" },
      ]
    }
  },
  hangman: {
    title: "چوبه دار",
    description: "حروف را حدس بزن و کلمه را پیدا کن",
    type: "hangman",
    content: {
      items: [
        { word: "خورشید", hint: "در آسمان است" },
        { word: "باران", hint: "از آسمان می‌بارد" },
        { word: "گل", hint: "زیبا و خوشبو" },
        { word: "ماه", hint: "شب‌ها می‌بینیم" },
        { word: "ستاره", hint: "شب‌ها چشمک می‌زند" },
      ]
    }
  },
  flip_tiles: {
    title: "کاشی‌های چرخان",
    description: "کاشی‌ها را برگردان و جفت‌ها را پیدا کن",
    type: "flip_tiles",
    content: {
      items: ["🐶", "🐱", "🐰", "🐸", "🦋", "🐝", "🐼", "🦊"]
    }
  },
  image_quiz: {
    title: "آزمون تصویری",
    description: "به سوالات تصویری جواب بده",
    type: "image_quiz",
    content: {
      items: [
        { question: "این چه حیوانیه؟", image: "🐕", options: ["سگ", "گربه", "خرگوش"], answer: "سگ" },
        { question: "این چه رنگیه؟", image: "🔴", options: ["آبی", "قرمز", "سبز"], answer: "قرمز" },
        { question: "این چیه؟", image: "🍎", options: ["موز", "سیب", "پرتقال"], answer: "سیب" },
        { question: "این چه شکلیه؟", image: "⬛", options: ["دایره", "مربع", "مثلث"], answer: "مربع" },
      ]
    }
  },
  labelled_diagram: {
    title: "نمودار برچسب‌دار",
    description: "برچسب‌ها را در جای درست بگذار",
    type: "labelled_diagram",
    content: {
      items: [
        { label: "گلبرگ", x: 50, y: 30 },
        { label: "ساقه", x: 50, y: 70 },
        { label: "برگ", x: 70, y: 55 },
        { label: "ریشه", x: 50, y: 85 },
      ]
    }
  },
  random_cards: {
    title: "کارت‌های تصادفی",
    description: "کارت بکش و اطلاعات رو ببین",
    type: "random_cards",
    content: {
      items: [
        { front: "🐕", back: "سگ: وفادارترین دوست انسان" },
        { front: "🐈", back: "گربه: حیوانی مستقل و باهوش" },
        { front: "🐘", back: "فیل: بزرگترین حیوان خشکی" },
        { front: "🦁", back: "شیر: سلطان جنگل" },
        { front: "🐰", back: "خرگوش: گوش‌های بلند و بامزه" },
        { front: "🦒", back: "زرافه: بلندترین حیوان دنیا" },
      ]
    }
  },
};
