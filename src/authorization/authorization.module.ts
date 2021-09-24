import { DynamicModule, Global, Module } from '@nestjs/common';
import { AUTHORIZATION_MODULE_OPTIONS } from './authorization.config';
import { IAuthorizationModuleOptions } from './authorization.interface';
import { authorizationProviders } from './authorization.provider';

@Global()
@Module({
  providers: [],
  exports: [],
})
export class AuthorizationModule {
  static register(options: IAuthorizationModuleOptions): DynamicModule {
    const optionsProvider = {
      provide: AUTHORIZATION_MODULE_OPTIONS,
      useValue: options,
    };

    return {
      module: AuthorizationModule,
      providers: [...authorizationProviders, optionsProvider],
      exports: [...authorizationProviders, optionsProvider],
    };
  }
}
