import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserWithoutFriends extends Omit<User, 'friends'> {}

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
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getUsers(page: number, perPage: number): Observable<any[]> {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const url = `${environment.BASE_URL}/users?_start=${start}&_end=${end}`;
    return this.http.get<any[]>(url);
  }

  getUserCount(): Observable<{ total: number }> {
    const url = `${environment.BASE_URL}/totalUserCount`;
    return this.http.get<{ total: number }>(url);
  }

  getFriends(
    userId: number,
    startIndex: number,
    count: number
  ): Observable<any> {
    const url = `${environment.BASE_URL}/users/${userId}`;
    const endIndex = startIndex + count;
    return this.http
      .get<any>(url)
      .pipe(map((user) => user.friends.slice(startIndex, endIndex)));
  }

  getFriendsCount(userId: number): Observable<number> {
    return this.http
      .get<any>(`${environment.BASE_URL}/users/${userId}`)
      .pipe(map((user) => user.friendsCount));
  }

  getUserById(userId: number) {
    return this.http
      .get<{
        firstName: string;
        lastName: string;
        id: number;
        description: string;
        profilePic: string;
        friends: number[];
      }>(`${environment.BASE_URL}/users/${userId}`)
      .pipe(
        map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePic: user.profilePic,
          description: user.description,
        }))
      );
  }
}
