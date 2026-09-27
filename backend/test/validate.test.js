import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { parseAttestation, parseBlackBelts } from '../utils/validate.js';

describe('разбор результатов аттестации', () => {
  test('объект поясов принимается и в виде строки', () => {
    const expected = { 'Желтый пояс': 12, 'Синий пояс': 3 };
    assert.deepEqual(parseAttestation(expected), expected);
    assert.deepEqual(parseAttestation(JSON.stringify(expected)), expected);
  });

  test('пустое и битое значение не превращается в пояса', () => {
    for (const value of [undefined, null, '', 'null', '{oops', [1, 2], {}]) {
      assert.equal(parseAttestation(value), null, String(value));
    }
  });
});

describe('разбор чёрных поясов', () => {
  test('фамилия со степенью', () => {
    const input = [{ dan: 1, name: 'Марченко Максим' }];
    assert.deepEqual(parseBlackBelts(input), input);
    assert.deepEqual(parseBlackBelts(JSON.stringify(input)), input);
  });

  test('без фамилии остаётся запись со степенью', () => {
    assert.deepEqual(parseBlackBelts([{ dan: 1, name: '' }]), [{ dan: 1, name: '' }]);
  });

  test('без степени, но с фамилией', () => {
    assert.deepEqual(parseBlackBelts([{ dan: null, name: 'Иванов Иван' }]), [{ dan: null, name: 'Иванов Иван' }]);
    assert.deepEqual(parseBlackBelts([{ name: 'Иванов Иван' }]), [{ dan: null, name: 'Иванов Иван' }]);
  });

  test('пустая строка формы отбрасывается, остальные сохраняются', () => {
    const input = [
      { dan: '', name: '   ' },
      { dan: '2', name: ' Иванов Иван ' },
    ];
    assert.deepEqual(parseBlackBelts(input), [{ dan: 2, name: 'Иванов Иван' }]);
  });

  test('некорректная степень не превращается в число', () => {
    assert.equal(parseBlackBelts([{ dan: 'abc', name: '' }]), null);
    assert.equal(parseBlackBelts([{ dan: 0, name: '' }]), null);
    assert.deepEqual(parseBlackBelts([{ dan: -1, name: 'Иванов' }]), [{ dan: null, name: 'Иванов' }]);
  });

  test('слишком длинная фамилия отклоняется целиком', () => {
    assert.equal(parseBlackBelts([{ dan: 1, name: 'Я'.repeat(101) }]), null);
  });

  test('не массив и не разобранная строка — пусто', () => {
    for (const value of [undefined, null, '', '[oops', { dan: 1 }, 5]) {
      assert.equal(parseBlackBelts(value), null, String(value));
    }
  });

  test('записи не из объектов игнорируются', () => {
    assert.deepEqual(parseBlackBelts(['Иванов', null, { dan: 1, name: 'Петров П.' }]), [
      { dan: 1, name: 'Петров П.' },
    ]);
  });
});
