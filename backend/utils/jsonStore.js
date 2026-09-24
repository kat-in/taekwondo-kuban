import { promises as fs } from 'fs';

export const readJson = async (file) => {
  const data = await fs.readFile(file, 'utf8');
  return JSON.parse(data);
};

export const writeJson = async (file, data) => {
  const temporaryFile = `${file}.tmp`;
  await fs.writeFile(temporaryFile, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(temporaryFile, file);
};

export const nextId = (items) => items.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1;

export const formatDisplayDate = (date) => {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
  try {
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
};
