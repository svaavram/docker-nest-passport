import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

declare const module: any;

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  private getNumber(key: string, defaultValue?: number): number {
    const value = this.configService.get(key, defaultValue);
    if (value === undefined) {
      throw new Error(key + ' env var not set'); // probably we should call process.exit() too to avoid locking the service
    }
    try {
      return Number(value);
    } catch {
      throw new Error(key + ' env var is not a number');
    }
  }

  private getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.configService.get(key, defaultValue?.toString());
    if (value === undefined) {
      throw new Error(key + ' env var not set');
    }
    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string, defaultValue?: string): string {
    const value = this.configService.get(key, defaultValue);

    if (!value) {
      console.warn(`"${key}" environment variable is not set`);
      return;
    }
    return value.toString().replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV', 'development');
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    let entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}'];
    let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

    if (module.hot) {
      const entityContext = require.context(
        './../../modules',
        true,
        /\.entity\.ts$/,
      );
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity as string;
      });
      const migrationContext = require.context(
        './../../migrations',
        false,
        /\.ts$/,
      );

      migrations = migrationContext.keys().map((id) => {
        const migrationModule = migrationContext(id);
        const [migration] = Object.values(migrationModule);
        return migration as string;
      });
    }
    return {
      entities,
      migrations,
      keepConnectionAlive: true,
      type: 'mssql',
      host: this.getString('TYPEORM_HOST'),
      port: this.getNumber('TYPEORM_PORT'),
      username: this.getString('TYPEORM_USERNAME'),
      password: this.getString('TYPEORM_PASSWORD'),
      database: this.getString('TYPEORM_DATABASE'),
      migrationsRun: this.getBoolean('TYPEORM_SYNCHRONIZE'),
      logging: this.getBoolean('TYPEORM_LOGGING', this.isDevelopment),
      options: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        trustServerCertificate: this.isDevelopment ? true : false,
      },
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }
}
