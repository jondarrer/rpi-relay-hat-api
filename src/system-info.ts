import fs from 'node:fs';
import os from 'node:os';

const getCpuInfo = () => {
  const cpuInfo = !fs.existsSync('/proc/cpuinfo') ? '' : fs.readFileSync('/proc/cpuinfo') + '';

  return cpuInfo.split('\n').reduce(function (result: Record<string, string[]>, line: string) {
    line = line.replace(/\t/g, '');
    var parts = line.split(':');
    var key = parts[0].replace(/\s/g, '_');
    if (parts.length === 2) {
      result[key] = parts[1].trim().split(' ');
    }
    return result;
  }, {});
};

export const systemInfo = () => {
  const cpuInfo = getCpuInfo();

  return {
    model: cpuInfo.Model?.join(' '),
    revision: cpuInfo.Revision?.join(' '),
    uptime: os.uptime(),
    hostname: os.hostname(),
    arch: os.arch(),
    version: os.version(),
    release: os.release(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
  };
};
