import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/configuration';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvConfig>);

  const env = {
    PORT: configService.get<number>('PORT'),
  } as EnvConfig;

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(env.PORT);
}
void bootstrap();
