// ---------- Live Password Strength Estimator ----------

function formatYearsLarge(years) {
  const scales = [
    [1e18, 'quintillion'],
    [1e15, 'quadrillion'],
    [1e12, 'trillion'],
    [1e9, 'billion'],
    [1e6, 'million'],
    [1e3, 'thousand']
  ];

  for (const [value, name] of scales) {
    if (years >= value) {
      const count = Math.floor(years / value);
      return `${count.toLocaleString('en-US')} ${name} yrs.`;
    }
  }

  if (years < 100) return `${years.toFixed(1)} yrs`;
  return `${Math.round(years)} yrs`;
}

function estimateCrackTime(password) {
  const chars = 94;
  const combos = Math.pow(chars, Math.max(0, password.length));
  const guessesPerSec = 1e12;
  const seconds = combos / guessesPerSec;

  if (seconds < 1) return 'less than a sec';
  if (seconds < 60) return `${Math.round(seconds)} sec`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;

  const years = seconds / (60 * 60 * 24 * 365);
  if (years < 1) return `${Math.round(years * 365)} days`;
  if (years < 50) return `${years.toFixed(1)} yrs`;

  return formatYearsLarge(years);
}

// Attach live event
const pwdInput = document.getElementById('pwd');
const result = document.getElementById('result');

pwdInput.addEventListener('input', () => {
  const pwd = pwdInput.value;
  if (!pwd) {
    result.textContent = '';
    return;
  }
  result.textContent = 'Estimated crack time: ' + estimateCrackTime(pwd);
});