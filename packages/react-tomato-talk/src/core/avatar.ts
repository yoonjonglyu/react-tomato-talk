const ADJECTIVES = [
  '달콤한', '상큼한', '귀여운', '춤추는', '열정적인',
  '빛나는', '포근한', '용감한', '행복한', '유쾌한',
  '느긋한', '신비로운', '호기심많은', '활기찬', '따뜻한',
  '바람개비', '새벽녘의', '노을빛', '별빛', '초록숲의'
];

const TOMATO_TYPES = [
  '완숙토마토', '방울토마토', '대추토마토', '흑토마토', '그린토마토',
  '스테비아토마토', '플럼토마토', '찰토마토', '송이토마토', '황금토마토'
];

export const generateAnonymousNickname = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const type = TOMATO_TYPES[Math.floor(Math.random() * TOMATO_TYPES.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${adj} ${type} #${num}`;
};

export const TOMATO_AVATARS = [
  '🍅', '🍅✨', '🍅🌿', '🍅🔥', '🍅🕶️', '🍅🎩', '🍅⚡', '🍅👑'
];

export const getRandomAvatar = (): string => {
  return TOMATO_AVATARS[Math.floor(Math.random() * TOMATO_TYPES.length) % TOMATO_AVATARS.length];
};
