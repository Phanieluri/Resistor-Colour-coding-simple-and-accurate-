

let currentBandCount = 4; // default

// Select band-count options
const bandCountOptions = document.querySelectorAll(
  '#band-count-wrapper .dropdown-content a'
);

// Select Band 3 container
const band3 = document.querySelector('.band3');

// Default: hide Band 3 (assume 4-band)
band3.style.display = 'none';

bandCountOptions.forEach(option => {
  option.addEventListener('click', e => {
    e.preventDefault();

    currentBandCount = Number(option.dataset.bands);

    if (currentBandCount === 4) {
      band3.style.display = 'none';
    } else {
      band3.style.display = 'block';
    }

    updateResult(currentBandCount);
  });
});


const selections = {
  band1: null,
  band2: null,
  band3: null,
  multiplier: null,
  tolerance: null
};

document.querySelectorAll('.dropdown-content a').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();

    const dropdown = item.closest('.dropdown');
    const button = dropdown.querySelector('.dropbtn');
    const role = button.dataset.role;
    const color = item.textContent.toLowerCase();

    selections[role] = color;
    button.textContent = item.textContent;
    button.style.backgroundColor = color;
  });
});


const digitMap = {
  black: 0, brown: 1, red: 2, orange: 3,
  yellow: 4, green: 5, blue: 6,
  violet: 7, grey: 8, white: 9
};

const multiplierMap = {
  black: 1,
  brown: 10,
  red: 100,
  orange: 1_000,
  yellow: 10_000,
  green: 100_000,
  blue: 1_000_000,
  violet: 10_000_000,
  grey: 100_000_000,
  white: 1_000_000_000,
  gold: 0.1,
  silver: 0.01
};

const toleranceMap = {
  brown: 1,
  red: 2,
  green: 0.5,
  blue: 0.25,
  violet: 0.1,
  grey: 0.05,
  gold: 5,
  silver: 10
};

function calculateResistance(bandCount) {
  if (!selections.band1 || !selections.band2 || 
      !selections.multiplier || !selections.tolerance) {
    return null;
  }

  let baseValue;

  if (bandCount === 4) {
    baseValue =
      digitMap[selections.band1] * 10 +
      digitMap[selections.band2];
  } else {
    if (!selections.band3) return null;

    baseValue =
      digitMap[selections.band1] * 100 +
      digitMap[selections.band2] * 10 +
      digitMap[selections.band3];
  }

  const resistance = baseValue * multiplierMap[selections.multiplier];
  return resistance;
}

function calculateRange(resistance) {
  const tol = toleranceMap[selections.tolerance];
  const delta = resistance * (tol / 100);

  return {
    min: resistance - delta,
    max: resistance + delta
  };
}

function formatResistance(value) {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + ' MΩ';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + ' kΩ';
  }
  return value.toFixed(2) + ' Ω';
}

function updateResult(bandCount) {
  const resistance = calculateResistance(bandCount);
  if (resistance === null) return;

  const range = calculateRange(resistance);
  const tol = toleranceMap[selections.tolerance];

  document.getElementById('nominal').textContent =
    `Resistance: ${formatResistance(resistance)}`;

  document.getElementById('tolerance').textContent =
    `Tolerance: ±${tol}%`;

  document.getElementById('range').textContent =
    `Range: ${formatResistance(range.min)} to ${formatResistance(range.max)}`;
}

document.querySelectorAll('.dropdown-content a').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();

    const dropdown = item.closest('.dropdown');
    const button = dropdown.querySelector('.dropbtn');
    const role = button.dataset.role;
    const color = item.textContent.toLowerCase();

    if (!role) return; // ignores 4 / 5 selector safely

    selections[role] = color;
    button.textContent = item.textContent;
    button.style.backgroundColor = color;

    updateResult(currentBandCount);
  });
});


console.log(selections, currentBandCount);

