const formCurrency = document.querySelector('#form-currency');

const boxCurrencyFrom = formCurrency.querySelector('#from');
const boxCurrencyTo = formCurrency.querySelector('#to');

const selectCurrencyFrom = boxCurrencyFrom.querySelector('select');
const selectCurrencyTo = boxCurrencyTo.querySelector('select');

const inputCurrencyFrom = boxCurrencyFrom.querySelector('input');
const inputCurrencyTo = boxCurrencyTo.querySelector('input');

const inputCurrencyFromMask = IMask(inputCurrencyFrom, {
  mask: '$ num',
  blocks: {
    num: {
      mask: Number,
      thousandsSeparator: '.',
    },
  },
});
const inputCurrencyToMask = IMask(inputCurrencyTo, {
  mask: '$ num',
  blocks: {
    num: {
      mask: Number,
      thousandsSeparator: '.',
    },
  },
});

selectCurrencyFrom.addEventListener('change', (event) => {
  inputCurrencyFromMask.updateOptions({
    mask: `${event.target.value} num`,
  });
});

selectCurrencyTo.addEventListener('change', (event) => {
  inputCurrencyToMask.updateOptions({
    mask: `${event.target.value} num`,
  });
});

(async () => {
  const res = await fetch(
    'https://v6.exchangerate-api.com/v6/8d184f7d2a0fb701d17b4ebe/codes'
  );
  const data = await res.json();

  data.supported_codes.forEach((code) => {
    const el = document.createElement('option');
    el.textContent = code[0];
    el.value = code[0];

    selectCurrencyFrom.appendChild(el.cloneNode(true));
    selectCurrencyTo.appendChild(el.cloneNode(true));
  });
})();

formCurrency.addEventListener('submit', async (event) => {
  event.preventDefault();

  const { value: fromCurrency } = selectCurrencyFrom;
  const { unmaskedValue: fromValue } = inputCurrencyFromMask;

  const { value: toCurrency } = selectCurrencyTo;

  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/8d184f7d2a0fb701d17b4ebe/pair/${fromCurrency}/${toCurrency}/${fromValue}`
  );
  const data = await res.json();

  inputCurrencyToMask.value = data.conversion_result.toString();
});
