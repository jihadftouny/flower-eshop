import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { AuthData } from './auth-data.model';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private phoneNumber: string;
  private authStatusListener = new Subject<boolean>();

  private users: AuthData[] = []; //we dont want anyone accessing this variable from outside
  private usersUpdated = new Subject<{
    users: AuthData[];
    userCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUsers(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`; //this is a template expression
    this.http
      .get<{ message: string; users: any; maxUsers: number }>(
        BACKEND_URL + queryParams
      ) //you can be more clear about the type
      .pipe(
        map((authData) => {
          return {
            users: authData.users.map((user) => {
              return {
                id: user._id,
                email: user.email,
                password: user.password,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,

              };
            }),
            maxUsers: authData.maxUsers,
          };
        })
      ) //allows operators (?)
      .subscribe((transformedUserData) => {
        this.users = transformedUserData.users;
        this.usersUpdated.next({
          users: [...this.users],
          userCount: transformedUserData.maxUsers,
        });
      });

    //return [...this.users]; //Good Practice! This is a ts/new js feature that copies an array, not only its reference
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable(); //returns an object that can listen but not emit
  }

  getUser(id: string) {
    return this.http.get<{
      _id: string;
      email: string;
      password: string;
      fullName: string;
      phoneNumber: string;
    }>(BACKEND_URL + id);
  }

  updateUser(
    id: string,
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string,

    // need to add the remaining data
  ) {
    let productData: AuthData | FormData;

    if (typeof email === 'string') {
      productData = new FormData();
      productData.append('id', id);
      productData.append('email', email);
      productData.append('password', password);
      productData.append('fullName', fullName);
      productData.append('phoneNumber', phoneNumber);
    } else {
      productData = {
        id: id,
        email: email,
        password: password,
        fullName: fullName,
        phoneNumber: phoneNumber
      };
    }
    //redirection
    this.http.put(BACKEND_URL + id, productData).subscribe((response) => {
      this.router.navigate(['/admin-panel']);
    });
  }

  // createUser(email: string, password: string, fullName: string, phoneNumber: string) {
  //   const authData: AuthData = { email: email, password: password, fullName: fullName, phoneNumber: phoneNumber };
  //   this.http.post(BACKEND_URL + '/signup', authData).subscribe(
  //     () => {
  //       this.router.navigate(['/auth/login']);
  //     },
  //     (error) => {
  //       this.authStatusListener.next(false);
  //     }
  //   );
  // }

  deleteUser(userId: string) {
    return this.http.delete(BACKEND_URL + userId);
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password, fullName: null, phoneNumber: null };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + 'login',
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId, this.phoneNumber);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, phoneNumber: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('phoneNumber', phoneNumber);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return {};
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
