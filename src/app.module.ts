import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { DatabaseConfig } from './shared/config/database.config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DatabaseConfig],
      useFactory: (config: DatabaseConfig) => config.typeOrmConfig,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
