const LIMITS = {
  title: 200,
  category: 100,
  content: 100000,
  details: 20000,
  imageDescription: 500,
  videoId: 100,
};

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const cleanString = (value) => (typeof value === 'string' ? value.trim() : '');

const validateText = (value, { field, required = false, max = LIMITS.title, pattern = null }) => {
  const text = cleanString(value);
  if (!text) return required ? `Заполните поле «${field}»` : null;
  if (text.length > max) return `Поле «${field}» длиннее ${max} символов`;
  if (pattern && !pattern.test(text)) return `Поле «${field}» имеет неверный формат`;
  return null;
};

export const validateDateValue = (value, { field = 'дата' } = {}) => {
  const text = cleanString(value);
  if (!text) return `Заполните поле «${field}»`;
  if (!DATE_PATTERN.test(text)) return 'Дата должна быть в формате ГГГГ-ММ-ДД';
  const parsed = new Date(`${text}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return 'Некорректная дата';
  if (parsed.toISOString().slice(0, 10) !== text) return 'Такой даты не существует';
  return null;
};

export const validateNews = (body) => {
  const errors = [
    validateText(body.title, { field: 'заголовок', required: true, max: LIMITS.title }),
    validateDateValue(body.date),
    validateText(body.category, { field: 'категория', max: LIMITS.category }),
    validateText(body.content, { field: 'текст', max: LIMITS.content }),
    validateText(body.details, { field: 'дополнение', max: LIMITS.details }),
    validateText(body.imageDescription, { field: 'описание фото', max: LIMITS.imageDescription }),
  ].filter(Boolean);
  return errors.length ? errors[0] : null;
};

export const validateAlbum = (body) => {
  const errors = [
    validateText(body.title, { field: 'название', required: true, max: LIMITS.title }),
    validateDateValue(body.date),
  ].filter(Boolean);
  return errors.length ? errors[0] : null;
};

export const validateVideo = (body) => {
  const errors = [
    validateText(body.title, { field: 'название', required: true, max: LIMITS.title }),
    validateText(body.videoId, { field: 'ID ролика', required: true, max: LIMITS.videoId, pattern: VIDEO_ID_PATTERN }),
    validateDateValue(body.date),
  ].filter(Boolean);
  return errors.length ? errors[0] : null;
};

export const validateNewPassword = (value) => {
  if (typeof value !== 'string' || !value) return 'Введите новый пароль';
  if (value.length < MIN_PASSWORD_LENGTH) return `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`;
  if (value.length > MAX_PASSWORD_LENGTH) return `Пароль длиннее ${MAX_PASSWORD_LENGTH} символов`;
  if (!/[A-Za-zА-Яа-яЁё]/.test(value) || !/\d/.test(value)) {
    return 'Пароль должен содержать буквы и цифры';
  }
  return null;
};

export const validateIdList = (value) => {
  if (!Array.isArray(value)) return 'Некорректный список идентификаторов';
  if (value.some((item) => !Number.isInteger(item) || item <= 0)) return 'Идентификаторы должны быть положительными числами';
  return null;
};

export const parseAttestation = (value) => {
  if (!value) return null;
  if (isPlainObject(value)) return Object.keys(value).length ? value : null;
  try {
    const parsed = JSON.parse(value);
    return isPlainObject(parsed) && Object.keys(parsed).length ? parsed : null;
  } catch {
    return null;
  }
};
