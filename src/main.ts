import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const serverPort = Number(process.env.HTTP_SERVER_PORT);
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('infodeniz challenge API')
    .setDescription('The ben Api')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('doc', app, document);
  await app.listen(serverPort, '0.0.0.0', () => {
    console.log('app is running on http://localhost:' + serverPort);
  });
}
bootstrap();
