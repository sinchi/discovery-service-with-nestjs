import { Injectable, Logger } from '@nestjs/common';
import { RegisterType } from './register.type';
import * as semver from 'semver';
import { RegisterServiceDto } from './register-service.dto';

@Injectable()
export class RegisterService {
  private timeout: number;
  private services: { [key: string]: RegisterType };
  private logger = new Logger('RegistryService');

  constructor() {
    this.timeout = 15;
    this.services = {};
  }

  private cleanUpUnresponsiveServicesTimeout(): void {
    const now = Math.floor((new Date() as any) / 1000);
    Object.keys(this.services).forEach((key: string) => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
        this.logger.log(`Removed exipred service ${key}`);
      }
    });
  }

  register({ name, version, port }: RegisterServiceDto, ip): string {
    this.cleanUpUnresponsiveServicesTimeout();
    const cleanIp: string = this.getCleanIp(ip);
    const key: string = this.getKey({ name, version, port, ip: cleanIp });
    if (!this.services[key]) {
      this.services[key] = {
        timestamp: Math.floor((new Date() as any) / 1000),
        name,
        version,
        port,
        ip: cleanIp,
      };

      this.logger.log(
        `Added new service ${name}:${version} at ${cleanIp}:${port}`,
      );
      return key;
    }
    this.services[key].timestamp = Math.floor((new Date() as any) / 1000);
    this.logger.log(`Updated service ${name}:${version} at ${cleanIp}:${port}`);
    return key;
  }

  unregister({ name, version, port }: RegisterServiceDto, ip): string {
    const cleanIp: string = this.getCleanIp(ip);
    const key: string = this.getKey({ name, version, port, ip: cleanIp });
    if (this.services[key]) {
      delete this.services[key];
      this.logger.log(
        `Remove service ${name}:${version} at ${cleanIp}:${port}`,
      );
    }
    return key;
  }

  find(name: string, version: string): RegisterType {
    this.cleanUpUnresponsiveServicesTimeout();
    const candidates = Object.values(this.services).filter(
      (service) =>
        service.name === name && semver.satisfies(service.version, version),
    );
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  private getKey({ name, version, port, ip }): string {
    return name + version + port + ip;
  }

  private getCleanIp(ip: string): string {
    if (ip.includes('::ffff') || ip.includes('127.0.0.1')) {
      return '127.0.0.1';
    }
    return ip;
  }
}
