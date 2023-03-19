import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
  page = 1;
  perPage = 9;
  isLoading = false;
  users: any[] = [];
  totalUsers = 0;

  private subscriptions: Subscription[] = [];

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (this.users.length < this.totalUsers) {
        this.page++;
        this.getUsers();
      }
    }
  }

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getUserCount();
    this.getUsers();
  }

  private getUserCount(): void {
    this.subscriptions.push(
      this.dataService.getUserCount().subscribe((count: { total: number }) => {
        this.totalUsers = count.total;
      })
    );
  }

  private getUsers(): void {
    this.isLoading = true;
    this.subscriptions.push(
      this.dataService
        .getUsers(this.page, this.perPage)
        .subscribe((data: any[]) => {
          this.isLoading = false;
          this.users = [...this.users, ...data];
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
