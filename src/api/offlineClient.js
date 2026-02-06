const STORAGE_PREFIX = 'cmo_';
const storage =
  typeof window === 'undefined' || !window.localStorage
    ? (() => {
        const map = new Map();
        return {
          getItem: (key) => (map.has(key) ? map.get(key) : null),
          setItem: (key, value) => map.set(key, value),
          removeItem: (key) => map.delete(key)
        };
      })()
    : window.localStorage;

const nowIso = () => new Date().toISOString();

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const seededKey = `${STORAGE_PREFIX}seeded`;
const userKey = `${STORAGE_PREFIX}user`;
const tokenKey = `${STORAGE_PREFIX}token`;

const defaultUser = {
  id: 'user-admin',
  name: 'Offline Admin',
  email: 'admin@local',
  role: 'admin'
};

const readJson = (key, fallback) => {
  const raw = storage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  storage.setItem(key, JSON.stringify(value));
};

const seedData = () => {
  if (storage.getItem(seededKey) === 'true') return;

  const seed = {
    GPU: [
      {
        id: generateId(),
        gpu_id: 'GPU-001',
        name: 'NVIDIA RTX 4090',
        status: 'active',
        algorithm: 'Ethash',
        core_clock: 2500,
        memory_clock: 10500,
        power_limit: 70,
        hashrate: 125.5,
        power_draw: 270,
        efficiency: 0.46,
        temperature: 62,
        fan_speed: 58,
        last_updated: nowIso(),
        created_date: nowIso()
      },
      {
        id: generateId(),
        gpu_id: 'GPU-002',
        name: 'AMD RX 7900 XTX',
        status: 'active',
        algorithm: 'KawPow',
        core_clock: 2350,
        memory_clock: 9800,
        power_limit: 75,
        hashrate: 62.3,
        power_draw: 220,
        efficiency: 0.28,
        temperature: 66,
        fan_speed: 61,
        last_updated: nowIso(),
        created_date: nowIso()
      }
    ],
    GPUProfile: [
      {
        id: generateId(),
        name: 'Efficiency Focus',
        algorithm: 'Ethash',
        target_efficiency: 0.5,
        core_clock: 2400,
        memory_clock: 10200,
        power_limit: 65,
        created_date: nowIso()
      }
    ],
    CryptoCurrency: [
      {
        id: generateId(),
        name: 'Ethereum Classic',
        symbol: 'ETC',
        algorithm: 'Ethash',
        price_usd: 24.18,
        price_change_24h: 1.2,
        market_cap: 3400000000,
        daily_reward_per_mh: 0.00022,
        created_date: nowIso()
      },
      {
        id: generateId(),
        name: 'Ravencoin',
        symbol: 'RVN',
        algorithm: 'KawPow',
        price_usd: 0.026,
        price_change_24h: -0.5,
        market_cap: 380000000,
        daily_reward_per_mh: 0.0024,
        created_date: nowIso()
      }
    ],
    ProfitHistory: [],
    CryptoPriceHistory: [],
    CoinSwitchPrediction: [],
    AutomationRule: [],
    HardwareAlert: [],
    AITrainingData: [],
    AIModelHistory: [],
    OptimizationLog: [],
    BenchmarkResult: [],
    PriceAlert: [],
    UserSettings: [
      {
        id: generateId(),
        electricity_cost_per_kwh: 0.12,
        target_temp: 70,
        auto_optimize_interval: 30,
        created_date: nowIso()
      }
    ]
  };

  Object.entries(seed).forEach(([entity, records]) => {
    writeJson(`${STORAGE_PREFIX}entity_${entity}`, records);
  });

  writeJson(userKey, defaultUser);
  storage.setItem(seededKey, 'true');
};

const loadEntity = (entityName) => {
  seedData();
  return readJson(`${STORAGE_PREFIX}entity_${entityName}`, []);
};

const saveEntity = (entityName, items) => {
  writeJson(`${STORAGE_PREFIX}entity_${entityName}`, items);
};

const normalizeSortValue = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const asDate = new Date(value);
  if (!Number.isNaN(asDate.valueOf())) return asDate.valueOf();
  if (typeof value === 'string') return value.toLowerCase();
  return value;
};

const sortItems = (items, sort) => {
  if (!sort) return [...items];
  const direction = sort.startsWith('-') ? -1 : 1;
  const field = sort.replace(/^-/, '');
  return [...items].sort((a, b) => {
    const av = normalizeSortValue(a[field]);
    const bv = normalizeSortValue(b[field]);
    if (av > bv) return direction;
    if (av < bv) return -direction;
    return 0;
  });
};

const entityApi = (entityName) => ({
  list: async (sort, limit) => {
    const items = loadEntity(entityName);
    const sorted = sortItems(items, sort);
    return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
  },
  create: async (data) => {
    const items = loadEntity(entityName);
    const now = nowIso();
    const record = {
      id: data?.id ?? generateId(),
      created_date: data?.created_date ?? now,
      updated_date: now,
      ...data
    };
    items.unshift(record);
    saveEntity(entityName, items);
    return record;
  },
  update: async (id, data) => {
    const items = loadEntity(entityName);
    const now = nowIso();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      const record = {
        id,
        created_date: data?.created_date ?? now,
        updated_date: now,
        ...data
      };
      items.unshift(record);
      saveEntity(entityName, items);
      return record;
    }
    const updated = {
      ...items[index],
      ...data,
      updated_date: now
    };
    items[index] = updated;
    saveEntity(entityName, items);
    return updated;
  },
  delete: async (id) => {
    const items = loadEntity(entityName);
    const next = items.filter((item) => item.id !== id);
    saveEntity(entityName, next);
    return { id };
  }
});

const aiSimulateOptimization = (prompt) => {
  const baseCore = 2400 + Math.floor(Math.random() * 200);
  const baseMemory = 9800 + Math.floor(Math.random() * 500);
  const powerLimit = 60 + Math.floor(Math.random() * 20);
  const predictedHashrate = 110 + Math.random() * 25;
  const predictedPower = 210 + Math.random() * 40;
  const efficiency = predictedHashrate / predictedPower;
  return {
    core_clock: baseCore,
    memory_clock: baseMemory,
    power_limit: powerLimit,
    predicted_hashrate: predictedHashrate,
    predicted_power: predictedPower,
    predicted_efficiency: efficiency,
    confidence: 78 + Math.random() * 15,
    reasoning: 'Generated locally using offline optimization heuristics.'
  };
};

const aiSimulatePrices = (coins) =>
  coins.map((coin) => {
    const base = coin.price_usd || 1;
    const variance = base * (0.02 + Math.random() * 0.04);
    const change = (Math.random() - 0.5) * 6;
    return {
      symbol: coin.symbol,
      name: coin.name,
      price_usd: Math.max(0.0001, base + (Math.random() > 0.5 ? variance : -variance)),
      price_change_24h: change,
      market_cap: (coin.market_cap || base * 100000000) * (0.98 + Math.random() * 0.04),
      volume_24h: base * 20000000 * (0.6 + Math.random() * 0.8)
    };
  });

export const offlineClient = {
  auth: {
    me: async () => {
      seedData();
      const storedUser = readJson(userKey, defaultUser);
      if (!storedUser) {
        writeJson(userKey, defaultUser);
        return defaultUser;
      }
      return storedUser;
    },
    logout: (redirectUrl) => {
      storage.removeItem(tokenKey);
      storage.removeItem(userKey);
      if (redirectUrl && typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    },
    redirectToLogin: (returnUrl) => {
      if (typeof window !== 'undefined') {
        if (!storage.getItem(userKey)) {
          writeJson(userKey, defaultUser);
        }
        window.location.href = returnUrl || '/';
      }
    }
  },
  appLogs: {
    logUserInApp: async (pageName) => {
      const key = `${STORAGE_PREFIX}app_logs`;
      const logs = readJson(key, []);
      logs.unshift({
        id: generateId(),
        page_name: pageName,
        timestamp: nowIso()
      });
      writeJson(key, logs.slice(0, 500));
      return { ok: true };
    }
  },
  integrations: {
    Core: {
      InvokeLLM: async ({ prompt }) => {
        const lower = (prompt || '').toLowerCase();
        if (lower.includes('optimization engine for cryptocurrency mining gpus')) {
          return aiSimulateOptimization(prompt);
        }
        if (lower.includes('real-time cryptocurrency market data')) {
          const coins = loadEntity('CryptoCurrency');
          return {
            timestamp: nowIso(),
            coins: aiSimulatePrices(coins)
          };
        }
        if (lower.includes('current cryptocurrency prices')) {
          const coins = loadEntity('CryptoCurrency');
          return {
            prices: aiSimulatePrices(coins).map(({ symbol, price_usd, price_change_24h, market_cap }) => ({
              symbol,
              price_usd,
              price_change_24h,
              market_cap
            }))
          };
        }
        return { result: 'Offline response generated locally.' };
      },
      SendEmail: async ({ to, subject, body }) => {
        const key = `${STORAGE_PREFIX}email_log`;
        const emails = readJson(key, []);
        emails.unshift({
          id: generateId(),
          to,
          subject,
          body,
          timestamp: nowIso()
        });
        writeJson(key, emails.slice(0, 200));
        return { ok: true };
      }
    }
  },
  entities: {
    GPU: entityApi('GPU'),
    GPUProfile: entityApi('GPUProfile'),
    CryptoCurrency: entityApi('CryptoCurrency'),
    ProfitHistory: entityApi('ProfitHistory'),
    CryptoPriceHistory: entityApi('CryptoPriceHistory'),
    CoinSwitchPrediction: entityApi('CoinSwitchPrediction'),
    AutomationRule: entityApi('AutomationRule'),
    HardwareAlert: entityApi('HardwareAlert'),
    AITrainingData: entityApi('AITrainingData'),
    AIModelHistory: entityApi('AIModelHistory'),
    OptimizationLog: entityApi('OptimizationLog'),
    BenchmarkResult: entityApi('BenchmarkResult'),
    PriceAlert: entityApi('PriceAlert'),
    UserSettings: entityApi('UserSettings')
  }
};
