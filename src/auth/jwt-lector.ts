import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";


@Injectable()
export class JwtLector extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET') ?? 'fallback_secret_change_me';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    if (!payload.id_usuario) throw new UnauthorizedException();
    return {
      id_usuario: payload.id_usuario,
      username: payload.username,
      role: payload.role,
    };
  }
}