// Structured Logger for TeX Engine, WASM, Cache, Network & PDF.js
// Provides console logging with colored badges and an in-memory event stream for the UI.

class TexLogger {
  constructor() {
    this.logs = [];
    this.listeners = new Set();
    this.maxLogs = 200;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const currentLogs = [...this.logs];
    this.listeners.forEach((fn) => {
      try {
        fn(currentLogs);
      } catch (e) {
        // ignore listener errors
      }
    });
  }

  clear() {
    this.logs = [];
    this.notify();
  }

  getLogs() {
    return [...this.logs];
  }

  log(category, message, details = null, level = 'info') {
    const timestamp = new Date();
    const timeStr = timestamp.toLocaleTimeString() + '.' + String(timestamp.getMilliseconds()).padStart(3, '0');
    
    const entry = {
      id: Math.random().toString(36).substring(2, 9),
      time: timeStr,
      timestamp: timestamp.getTime(),
      category: category.toUpperCase(),
      message,
      details,
      level
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with distinctive styling
    this.printToConsole(entry);

    // Notify UI subscribers
    this.notify();

    return entry;
  }

  info(category, message, details = null) {
    return this.log(category, message, details, 'info');
  }

  success(category, message, details = null) {
    return this.log(category, message, details, 'success');
  }

  warn(category, message, details = null) {
    return this.log(category, message, details, 'warn');
  }

  error(category, message, details = null) {
    return this.log(category, message, details, 'error');
  }

  printToConsole(entry) {
    const categoryColors = {
      WASM: { bg: '#4f46e5', text: '#ffffff' },       // Indigo
      CACHE: { bg: '#0891b2', text: '#ffffff' },      // Cyan
      COMPILE: { bg: '#d97706', text: '#ffffff' },    // Amber
      'PDF.JS': { bg: '#059669', text: '#ffffff' },   // Emerald
      NETWORK: { bg: '#2563eb', text: '#ffffff' },   // Blue
      ENGINE: { bg: '#7c3aed', text: '#ffffff' },     // Purple
      FALLBACK: { bg: '#dc2626', text: '#ffffff' }    // Red
    };

    const colors = categoryColors[entry.category] || { bg: '#475569', text: '#ffffff' };
    const badgeStyle = `background: ${colors.bg}; color: ${colors.text}; font-weight: bold; padding: 2px 5px; border-radius: 3px; font-size: 10px;`;
    const textStyle = entry.level === 'error' 
      ? 'color: #ef4444; font-weight: 500;'
      : entry.level === 'warn'
      ? 'color: #f59e0b; font-weight: 500;'
      : entry.level === 'success'
      ? 'color: #10b981; font-weight: 500;'
      : 'color: #e2e8f0;';

    const prefix = `%c[PrismTeX:${entry.category}]%c ${entry.time} - ${entry.message}`;

    if (entry.level === 'error') {
      if (entry.details) console.error(prefix, badgeStyle, textStyle, entry.details);
      else console.error(prefix, badgeStyle, textStyle);
    } else if (entry.level === 'warn') {
      if (entry.details) console.warn(prefix, badgeStyle, textStyle, entry.details);
      else console.warn(prefix, badgeStyle, textStyle);
    } else {
      if (entry.details) console.log(prefix, badgeStyle, textStyle, entry.details);
      else console.log(prefix, badgeStyle, textStyle);
    }
  }
}

export const texLogger = new TexLogger();
