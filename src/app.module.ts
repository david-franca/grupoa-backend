import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './modules/students/students.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { validationSchema } from './config/configuration';
import { dataSourceOptions } from './database/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    StudentsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
