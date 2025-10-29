import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/configuration';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API da Instituição de Ensino')
    .setDescription('Documentação da API para o teste de CRUD de alunos')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    apiReference({
      content: document,
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'axios',
      },
      theme: 'kepler',
      defaultOpenAllTags: true,
      expandAllResponses: true,
      hideModels: true,
      layout: 'modern',
      authentication: {
        preferredSecurityScheme: 'JWT-auth',
      },
      tagsSorter: 'alpha',
    }),
  );

  const configService = app.get(ConfigService<EnvConfig>);

  const env = {
    PORT: configService.get<number>('PORT'),
  } as EnvConfig;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  await app.listen(env.PORT);
}
void bootstrap();
