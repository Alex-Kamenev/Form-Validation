const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
function formWith(values) {
  let submit;
  const inputs = {};
  for (const id of ['username', 'email', 'password', 'password2']) {
    const small = {};
    inputs[id] = { id, value: values[id] || '', attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; },
      parentElement: { className: '', querySelector: () => small }, small };
  }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8'), {
    document: { getElementById: id => id === 'form' ? { addEventListener: (event, fn) => { submit = fn; } } : inputs[id] },
  });
  submit({ preventDefault() {} });
  return inputs;
}
test('rejects whitespace-only usernames even when raw length is sufficient', () => {
  const inputs = formWith({ username: '    ', email: 'a@example.test', password: 'secret123', password2: 'secret123' });
  assert.equal(inputs.username.attributes['aria-invalid'], 'true');
  assert.match(inputs.username.small.innerText, /required/);
});
test('keeps required confirmation error and does not trim passwords', () => {
  let inputs = formWith({ username: 'user', email: 'a@example.test', password: 'secret123' });
  assert.equal(inputs.password2.attributes['aria-invalid'], 'true');
  assert.match(inputs.password2.small.innerText, /required/);
  inputs = formWith({ username: 'user', email: 'a@example.test', password: ' secret123 ', password2: 'secret123' });
  assert.equal(inputs.password2.attributes['aria-invalid'], 'true');
});
test('accepts matching valid input', () => {
  const inputs = formWith({ username: 'user', email: 'a@example.test', password: 'secret123', password2: 'secret123' });
  for (const input of Object.values(inputs)) assert.equal(input.attributes['aria-invalid'], 'false');
});
