import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Rol } from "../enum/rol.enum";
import { ROLES_KEY } from "../decoradores/roles.decoradores";




@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    const hasRole = requiredRoles.some((role) => user?.role === role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado. Se requiere uno de los roles: ${requiredRoles.join(', ')}`,
      );
    }
    return true;
  }
}