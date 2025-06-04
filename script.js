const gearList = document.getElementById('gearList');
const seedsList = document.getElementById('seedsList');
const eggsList = document.getElementById('eggsList');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDesc = document.getElementById('weatherDesc');
const weatherBonus = document.getElementById('weatherBonus');
const lastUpdated = document.getElementById('lastUpdated');
const localTime = document.getElementById('localTime');
const countdown = document.getElementById('countdown');

const epicItems = ['Golden Spade', 'Mystic Hammer', 'Dragon Egg'];
const rareItems = ['Mystic Seed', 'Moon Bean'];

async function fetchStock() {
  try {
    const responses = await Promise.all([
      fetch('https://growagardenstock.com/api/stock?type=gear-seeds'),
      fetch('https://growagardenstock.com/api/stock?type=seeds'),
      fetch('https://growagardenstock.com/api/stock?type=egg'),
      fetch('https://growagardenstock.com/api/stock/weather')
    ]);

    for (let res of responses) {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const [gearData, seedsData, eggsData, weatherData] = await Promise.all(responses.map(res => res.json()));

    if (gearData && Array.isArray(gearData.gear)) {
      gearList.innerHTML = gearData.gear.map(item => {
        const isEpic = epicItems.includes(item);
        return `<li class="${isEpic ? 'highlight-epic' : ''}">${item}</li>`;
      }).join('');
    } else {
      gearList.innerHTML = '<li>No gear data available</li>';
    }

    if (seedsData && Array.isArray(seedsData.seeds)) {
      seedsList.innerHTML = seedsData.seeds.map(item => {
        const isRare = rareItems.includes(item);
        return `<li class="${isRare ? 'highlight-rare' : ''}">${item}</li>`;
      }).join('');
    } else {
      seedsList.innerHTML = '<li>No seeds data available</li>';
    }

    if (eggsData && Array.isArray(eggsData.egg)) {
      eggsList.innerHTML = eggsData.egg.map(item => `<li>${item}</li>`).join('');
    } else {
      eggsList.innerHTML = '<li>No eggs data available</li>';
    }

    weatherIcon.textContent = weatherData?.icon || '🌦️';
    weatherDesc.textContent = weatherData?.currentWeather || 'Unknown';
    weatherBonus.textContent = weatherData?.cropBonuses || 'N/A';

    const timestamps = [
      gearData?.updatedAt,
      seedsData?.updatedAt,
      eggsData?.updatedAt,
      weatherData?.updatedAt
    ].filter(Boolean);

    if (timestamps.length > 0) {
      const latestTimestamp = Math.max(...timestamps.map(t => new Date(t).getTime()));
      const date = new Date(latestTimestamp);
      lastUpdated.textContent = 'Last updated: ' + date.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila' });
    } else {
      lastUpdated.textContent = 'Last updated: N/A';
    }

  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    gearList.innerHTML = '<li>Error loading gear data</li>';
    seedsList.innerHTML = '<li>Error loading seeds data</li>';
    eggsList.innerHTML = '<li>Error loading eggs data</li>';
    weatherDesc.textContent = 'Error';
    weatherBonus.textContent = 'Error';
    lastUpdated.textContent = 'Last updated: Error';
  }
}

function updateLocalTime() {
  const now = new Date();
  localTime.textContent = now.toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
}

function updateCountdown() {
  const now = new Date();
  const xmas = new Date(now.getFullYear(), 11, 25);
  const diff = xmas - now;
  if (diff < 0) {
    countdown.textContent = 'Merry Christmas!';
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

fetchStock();
updateLocalTime();
updateCountdown();

setInterval(fetchStock, 10000);
setInterval(updateLocalTime, 1000);
setInterval(updateCountdown, 1000);
