import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/modules/users/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Pega os 'roles' necessários (ex: ['admin']) definidos no Decorator da rota
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Se nenhum 'role' for exigido, permite o acesso
    }

    // 2. Pega o usuário do 'request' (anexado pelo AuthGuard)
    const { user }: RequestWithUser = context.switchToHttp().getRequest();

    // 3. Compara os 'roles'
    const hasRole = () => requiredRoles.includes(user.role);

    if (user && user.role && hasRole()) {
      return true; // Usuário tem o role necessário
    }

    // 4. Se não tiver, lança uma exceção de Proibido
    throw new ForbiddenException(
      'Você não tem permissão para acessar este recurso.',
    );
  }
}
