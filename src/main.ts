import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvConfig>);

  const env = {
    PORT: configService.get<number>('PORT'),
  } as EnvConfig;

  await app.listen(env.PORT);
}
void bootstrap();
