import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from './auth';
import { PERMISSIONS, Permission } from '@/constants/roles';
import { JwtPayload, UserRole, ApiResponse } from '@/types/index';
import { ApiError } from './errors';

export type AuthenticatedRouteHandler = (
  req: NextRequest,
  { params }: { params: any },
  user: JwtPayload
) => Promise<NextResponse>;

export type NextRouteHandler = (
  req: NextRequest,
  { params }: { params: any }
) => Promise<NextResponse>;

export function withAuth(
  handler: AuthenticatedRouteHandler,
  ...requiredPermissions: Permission[]
): NextRouteHandler {
  return async (req: NextRequest, { params }: { params: any }): Promise<NextResponse> => {
    const resolvedParams = await Promise.resolve(params);
    const token = getTokenFromRequest(req);

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized: No token provided',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized: Invalid token',
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Check permissions if required
    if (requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.every((permission) => {
        const allowedRoles = PERMISSIONS[permission];
        return allowedRoles.includes(user.role as any);
      });

      if (!hasPermission) {
        const response: ApiResponse = {
          success: false,
          message: 'Forbidden: Insufficient permissions',
        };
        return NextResponse.json(response, { status: 403 });
      }
    }

    return handler(req, { params: resolvedParams }, user);
  };
}

export function withRole(...requiredRoles: UserRole[]): (
  handler: AuthenticatedRouteHandler
) => NextRouteHandler {
  return (handler: AuthenticatedRouteHandler) => {
    return async (req: NextRequest, { params }: { params: any }): Promise<NextResponse> => {
      const resolvedParams = await Promise.resolve(params);
      const token = getTokenFromRequest(req);

      if (!token) {
        const response: ApiResponse = {
          success: false,
          message: 'Unauthorized: No token provided',
        };
        return NextResponse.json(response, { status: 401 });
      }

      const user = verifyToken(token);

      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'Unauthorized: Invalid token',
        };
        return NextResponse.json(response, { status: 401 });
      }

      if (!requiredRoles.includes(user.role)) {
        const response: ApiResponse = {
          success: false,
          message: 'Forbidden: Insufficient role',
        };
        return NextResponse.json(response, { status: 403 });
      }

      return handler(req, { params: resolvedParams }, user);
    };
  };
}

