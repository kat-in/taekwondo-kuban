import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';

const TEST_PASSWORD = 'test-password-123';
const TEST_SECRET = 'test-jwt-secret';

// Задаём переменные до импорта приложения: dotenv не перезаписывает уже установленные.
process.env.ADMIN_PASSWORD = await bcrypt.hash(TEST_PASSWORD, 4);
process.env.JWT_SECRET = TEST_SECRET;
process.env.NODE_ENV = 'test';

const { app } = await import('../index.js');

let server;
let baseUrl;
let token;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

const get = (path, options = {}) => fetch(`${baseUrl}${path}`, options);
const post = (path, body, headers = {}) =>
  fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

describe('публичные endpoint', () => {
  test('health отвечает', async () => {
    const response = await get('/api/health');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
  });

  test('списки отдаются массивами без дублей id', async () => {
    for (const path of ['/api/news', '/api/albums', '/api/video']) {
      const response = await get(path);
      assert.equal(response.status, 200, path);
      const items = await response.json();
      assert.ok(Array.isArray(items), path);
      assert.ok(items.length > 0, path);
      assert.equal(new Set(items.map((item) => item.id)).size, items.length, `дубли id в ${path}`);
    }
  });

  test('новости отсортированы по дате по убыванию', async () => {
    const news = await (await get('/api/news')).json();
    const dates = news.map((item) => item.date || '');
    const sorted = [...dates].sort().reverse();
    assert.deepEqual(dates, sorted);
  });

  test('альбомы и видео отсортированы по дате по убыванию', async () => {
    for (const path of ['/api/albums', '/api/video']) {
      const items = await (await get(path)).json();
      const dates = items.map((item) => item.date || '');
      assert.deepEqual(dates, [...dates].sort().reverse(), path);
    }
  });

  test('существующая новость отдаётся по id', async () => {
    const news = await (await get('/api/news')).json();
    const response = await get(`/api/news/${news[0].id}`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).id, news[0].id);
  });

  test('несуществующая новость даёт 404 в формате ошибки', async () => {
    const response = await get('/api/news/99999999');
    assert.equal(response.status, 404);
    const body = await response.json();
    assert.equal(body.success, false);
    assert.ok(body.message);
  });

  test('некорректный идентификатор даёт 400', async () => {
    for (const path of ['/api/news/abc', '/api/albums/abc', '/api/video/abc']) {
      const response = await get(path);
      assert.equal(response.status, 400, path);
      assert.equal((await response.json()).success, false, path);
    }
  });

  test('альбом по новости и видео по новости', async () => {
    const albums = await (await get('/api/albums')).json();
    const linked = albums.find((album) => album.newsId !== null);
    assert.ok(linked, 'в данных есть альбом, привязанный к новости');
    const response = await get(`/api/albums/by-news/${linked.newsId}`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).id, linked.id);
    assert.deepEqual(await (await get(`/api/video/${linked.newsId}`)).json().then(Array.isArray), true);
  });
});

describe('вход в админку', () => {
  test('верный пароль выдаёт токен', async () => {
    const response = await post('/api/admin/login', { password: TEST_PASSWORD });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.success, true);
    assert.ok(body.token);
    token = body.token;
  });

  test('неверный пароль даёт 401', async () => {
    const response = await post('/api/admin/login', { password: 'wrong-password' });
    assert.equal(response.status, 401);
    assert.equal((await response.json()).success, false);
  });

  test('пустой пароль даёт 401, а не 500', async () => {
    const response = await post('/api/admin/login', {});
    assert.equal(response.status, 401);
  });

  test('битый JSON даёт 400 без стектрейса', async () => {
    const response = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{oops',
    });
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.success, false);
    assert.ok(!JSON.stringify(body).includes('at '), 'в ответе нет стектрейса');
  });
});

describe('защита админских endpoint', () => {
  test('без токена — 401', async () => {
    const response = await get('/api/admin/news');
    assert.equal(response.status, 401);
  });

  test('с мусорным токеном — 401', async () => {
    const response = await get('/api/admin/news', { headers: { Authorization: 'Bearer nonsense' } });
    assert.equal(response.status, 401);
  });

  test('с токеном — 200 и массив', async () => {
    const response = await get('/api/admin/news', { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(await response.json()));
  });
});

describe('валидация записи', () => {
  const auth = () => ({ Authorization: `Bearer ${token}` });

  test('видео без обязательных полей — 400', async () => {
    const response = await post('/api/admin/video', { title: '' }, auth());
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
  });

  test('видео с несуществующей датой — 400', async () => {
    const response = await post('/api/admin/video', { title: 'Тест', videoId: 'abc123', date: '2026-13-45' }, auth());
    assert.equal(response.status, 400);
  });

  test('видео с несуществующей новостью — 400', async () => {
    const response = await post(
      '/api/admin/video',
      { title: 'Тест', videoId: 'abc123', date: '2026-01-01', newsId: 99999999 },
      auth(),
    );
    assert.equal(response.status, 400);
  });

  test('альбом без названия — 400', async () => {
    const response = await post('/api/admin/albums', { title: '', date: '2026-01-01' }, auth());
    assert.equal(response.status, 400);
  });

  test('несуществующий альбом — 404', async () => {
    const response = await fetch(`${baseUrl}/api/admin/albums/99999999`, {
      method: 'DELETE',
      headers: auth(),
    });
    assert.equal(response.status, 404);
  });

  test('смена пароля с неверным текущим — 401', async () => {
    const response = await post(
      '/api/admin/password',
      { currentPassword: 'wrong', newPassword: 'novyy-parol-1', repeatPassword: 'novyy-parol-1' },
      auth(),
    );
    assert.equal(response.status, 401);
  });

  test('новый пароль короче минимума — 400', async () => {
    const response = await post(
      '/api/admin/password',
      { currentPassword: TEST_PASSWORD, newPassword: 'short1', repeatPassword: 'short1' },
      auth(),
    );
    assert.equal(response.status, 400);
  });
});
