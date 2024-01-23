// import { createLogger, StringifyObjectsHook, type LoggerHook, type LogEvent } from 'vue-logger-plugin'
// import axios from 'axios';

// const ServerLogHook: LoggerHook = {
// run(event: LogEvent) {
//     axios.post('http://192.168.0.3:8080/log', { severity: event.level, data: event.argumentArray })
// }
//     run(event: LogEvent) {
//         const console_dom = document.getElementById("console");
//         const text_node = document.createTextNode(String(event.argumentArray) + "/")
//         console_dom?.appendChild(text_node);
//     }

// }

interface LogHook {
  output(...texts: any[]): void;
}
class DomLogger implements LogHook {
  output(...texts: any[]): void {
    const console_dom = document.getElementById("console");
    const text_node = document.createTextNode(texts.join(",") + "/");
    console_dom?.appendChild(text_node);
  }
}

class Logger {
  hook?: LogHook;
  info(...texts: any[]): void {
    this.hook?.output(...texts);
    console.log(...texts);
  }
  error(...texts: any[]): void {
    this.hook?.output("Error:", ...texts);
    console.log(...texts);
  }
}

const useLogger = (): Logger => {
  const logger = new Logger();
  logger.hook = new DomLogger();
  return logger;
};

// const logger = createLogger({
//     // ... (other options)
//     beforeHooks: [StringifyObjectsHook],
//     afterHooks: [ServerLogHook]
// });

export default useLogger;
