/* METADATA
{
  name: time

  display_name: {
    zh: "Time"
    en: "Time"
  }
  description: {
    zh: "Provides time-related features. In fact, the current time is already available once this package is activated."
    en: "Provides time-related utilities. In practice, current time is already available once this package is enabled."
  }
  enabledByDefault: true
  category: "Utility"
  tools: [
    {
      name: get_time
      description: {
        zh: "Get the current time. When this package is used, the AI has already obtained the current time information automatically."
        en: "Get the current time. When using this package, the AI may already have the current time context."
      }
      parameters: []
    },
    {
      name: format_time
      description: {
        zh: "Format time. Provides various time formatting options."
        en: "Format time. Provides various time formatting options."
      }
      parameters: []
    }
  ]
}*/

const timePackage = (function () {
  async function get_time(): Promise<any> {
    const now = new Date();

    return {
      timestamp: now.getTime(),
      iso: now.toISOString(),
      local: now.toLocaleString(),
      date: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        weekday: now.toLocaleDateString(undefined, { weekday: 'long' })
      },
      time: {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
      }
    };
  }

  async function format_time(): Promise<any> {
    const now = new Date();

    const pad = (n: number) => n.toString().padStart(2, '0');

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const time24h = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const time12h = `${pad(hour12)}:${pad(minutes)}:${pad(seconds)} ${suffix}`;

    return {
      iso: now.toISOString(),
      date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      time24h,
      time12h
    };
  }

  return {
    get_time,
    format_time
  };
})();

// Export one by one
exports.get_time = timePackage.get_time;
exports.format_time = timePackage.format_time;