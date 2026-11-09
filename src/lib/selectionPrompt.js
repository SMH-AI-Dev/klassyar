export default function selectionPrompt(question) {
  const prompt = question.fa || question.hint || question.question || "پاسخ درست را انتخاب کن";
  const persianNumberPrompt = prompt.match(/عدد [«'"]?(.+?)[»'"]? را با رقم بنویس(?:ید)?/);
  if (persianNumberPrompt) return `کدام گزینه نمایش‌دهندهٔ عدد «${persianNumberPrompt[1]}» است؟`;

  const numberPrompt = prompt.match(/^Write the number ['"](.+?)['"] as a digit$/i);
  if (numberPrompt) return `Which digit represents the number '${numberPrompt[1]}'?`;

  const persianSpellingPrompt = prompt.match(/کلمه‌ای به معنی «(.+?)» را املا کن:\s*(.+)/);
  if (persianSpellingPrompt) return `کدام واژه به معنی «${persianSpellingPrompt[1]}» است؟ سرنخ: ${persianSpellingPrompt[2]}`;

  const spellingPrompt = prompt.match(/^Spell the word meaning (.+?):\s*(.+)$/i);
  if (spellingPrompt) return `Which word matches this meaning? ${spellingPrompt[1]} ${spellingPrompt[2]}`;

  const persianNumberWordsPrompt = prompt.match(/^عدد (.+?) را به عدد بنویس(?:ید)?[؟?]?$/);
  if (persianNumberWordsPrompt) return `نمایش رقمی عدد «${persianNumberWordsPrompt[1]}» کدام است؟`;

  const persianWritePrompt = prompt.match(/^(.+?) را بنویس(?:ید)?[؟?]?$/);
  if (persianWritePrompt) return `پاسخ درست برای «${persianWritePrompt[1]}» کدام است؟`;

  return prompt;
}
