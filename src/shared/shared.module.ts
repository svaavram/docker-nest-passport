import { Global, Module } from '@nestjs/common';
import { DatabaseConfig } from './config/database.config';

@Global()
@Module({
  providers: [DatabaseConfig],
  exports: [DatabaseConfig],
})
export class SharedModule {}
