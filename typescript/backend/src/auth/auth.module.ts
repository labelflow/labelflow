import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { PassportModule } from "@nestjs/passport";
import { NextJwtAuthGuard } from "./next-jwt-auth.guard";
import { NextJwtAuthStrategy } from "./next-jwt-auth.strategy";

@Module({
  imports: [ConfigModule, PassportModule],
  providers: [
    NextJwtAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: NextJwtAuthGuard,
    },
  ],
})
export class AuthModule {}
