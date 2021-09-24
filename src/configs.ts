import { join } from 'path';

export default (_env: any = null): any => {
  const env: any = _env ? _env : process.env;

  return {
    constants: {
      appEndpoint: env.APP_MAIN_ENDPOINT,
      serverHost: env.SERVER_HOST,
      httpServerPort: env.HTTP_SERVER_PORT,
      jwtSecretKey: env.JWT_SECRET_KEY,
      staticFilesPath: env.STATIC_FILES_PATH,
    },
    redisDb: {
      host: env.REDIS_DATABASE_HOST,
      port: parseInt(env.REDIS_DATABASE_PORT),
      username: env.REDIS_DATABASE_USERNAME,
      password: env.REDIS_DATABASE_PASSWORD,
    },
    mailServer: {
      provider: env.MAILSERVER_PROVIDER,
      host: env.MAILSERVER_HOST,
      port: env.MAILSERVER_PORT,
    },
    fileStorage: {
      baseUploadPath: join(env.STATIC_FILES_PATH, 'uploads'),
      accessFileEndpoint: env.FILESTORAGE_ACCESS_FILE_ENDPOINT,
    },
  };
};
