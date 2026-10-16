import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';


//definisikan formatnya terlebih dahulu
export interface StandarResponse<T>{
  succes: boolean,
  message: string,
  statusCode: number,
  data: T
}
@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, StandarResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandarResponse<T>> {
    //update httpContext = context.swirchToHttp()
    const httpContext = context.switchToHttp()
    const response = httpContext.getResponse()
    const currentStatusCode = response.statuscode

    return next.handle().pipe(
      map((originalData: any) => ({
        succes:true,
        message:"Data berhasil diambil",
        statusCode:currentStatusCode,
        data: originalData ?? null
      }))
    );
  }
}
