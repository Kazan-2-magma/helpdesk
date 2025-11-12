import { HttpInterceptorFn } from '@angular/common/http';
import { Constants } from '../../shared/constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(Constants.TOKEN_KEY)

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  return next(req);
};
