import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, pluck } from 'rxjs';
export interface UserWithoutFriends extends Omit<User, "friends"> {}
interface User {
  id: number;
  firstName: string;
  lastName: string;
  profilePic: string;
  description: string;
  friends: number[];
  friendsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  [x: string]: any;
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  getUsers(page: number, perPage: number): Observable<any[]> {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const url = `${this.baseUrl}?_start=${start}&_end=${end}`;
    return this.http.get<any[]>(url);
  }

  getUserCount(): Observable<{total: number}> {
    const url = `http://localhost:3000/totalUserCount`;
    return this.http.get<{total: number}>(url);
  }

  getFriends(userId: number, startIndex: number, count: number): Observable<any> {
    const url = `${this.baseUrl}/${userId}`;
    const endIndex = startIndex + count;
    return this.http.get<any>(url).pipe(
      map(user => user.friends.slice(startIndex, endIndex))
    );
  }

  getFriendsCount(userId: number): Observable<number> {
    return this.http.get<any>(`${this.baseUrl}/${userId}`)
      .pipe(
        map(user => user.friendsCount)
      );
  }

  getFullName(user: any): Observable<string> {
    return of(user.firstName + ' ' + user.lastName);
  }
  
  getUserById(userId: number) {
    return this.http.get<{firstName: string, lastName:string, id:number, description:string, profilePic: string, friends: number[]}>(`http://localhost:3000/users/${userId}`).pipe(
      map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
        description: user.description,
      }))
    );
  }
}