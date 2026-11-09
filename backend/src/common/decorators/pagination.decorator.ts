import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const page = parseInt(request.query.page, 10) || 1;
    const limit = Math.min(parseInt(request.query.limit, 10) || 10, 100);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  },
);
