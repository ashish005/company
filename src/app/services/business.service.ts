import {Injectable, Injector} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {environment} from '@app-envs';

@Injectable()
export class TrialBusinessService {
  constructor(protected httpClient: HttpClient) {}

  public create(item: any): Observable<any> {
    return this.httpClient.post(`${environment.authBaseUrl}/trialRegister`, item)
      .pipe(
        tap(data => data),
        catchError(error => error)
      );
  }
}

@Injectable()
export class PricingService {
  constructor(protected httpClient: HttpClient) {}

  public read(softwareId: any): Observable<any> {
    return this.httpClient.get(`${environment.authBaseUrl}/software/plans/1.0.0/${softwareId}`)
      .pipe(
        tap(data => data),
        catchError(error => error)
      );
  }
}
