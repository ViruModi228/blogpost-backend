import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const UserId =  createParamDecorator(
    (data:unknown,ctx: ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest();
        console.log(request.user.id)
        return request.user.id;
    },
);