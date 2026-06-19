// Utility functions

export const createPageUrl = (pageName) => {
  return `/${pageName}`;
};

export const cn = (...inputs) => {
  return inputs.filter(Boolean).join(' ');
};

export const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString('fa-IR');
  } catch {
    return date;
  }
};

export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateRandomCode = (length = 6) => {
  return Math.random().toString(36).substring(2, length + 2).toUpperCase();
};
