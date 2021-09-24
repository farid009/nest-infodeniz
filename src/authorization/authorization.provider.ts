import { RedisWatcher } from '@casbin/redis-watcher';
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as casbin from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';
import { join } from 'path';
import { CASBIN_ENFORCER } from './authorization.config';
import { AuthorizationService } from './authorization.service';

const casbinEnforcerProvider: FactoryProvider = {
  provide: CASBIN_ENFORCER,
  useFactory: async (configService: ConfigService) => {
    const redisConfigs = configService.get('redisDb');
    const modelPath = join(process.cwd(), 'casbin.model.conf');
    const adapter = await PrismaAdapter.newAdapter();
    const watcher = await RedisWatcher.newWatcher(
      `redis://${redisConfigs.host}:${redisConfigs.port}/2`,
    );
    const casbinEnforcer = await casbin.newEnforcer(modelPath, adapter);

    casbinEnforcer.setWatcher(watcher);
    return casbinEnforcer;
  },
  inject: [ConfigService],
};

export const authorizationProviders = [
  casbinEnforcerProvider,
  AuthorizationService,
];
