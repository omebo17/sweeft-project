import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/services/data-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  page = 1;
  perPage = 9;
  isLoading = false;
  public users: any[] = [];
  totalUsers = 0;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.getUserCount();
    this.getUsers();
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (this.users.length < this.totalUsers) {
        this.page++;
        this.getUsers();
      }
    }
  }

  private getUserCount(): void {
    this.dataService.getUserCount()
      .subscribe((count: {total: number}) => {
        this.totalUsers = count.total;
      });
  }

  private getUsers(): void {
    this.isLoading = true;
    this.dataService.getUsers(this.page, this.perPage)
      .subscribe((data: any[]) => {
        this.isLoading = false;
        this.users = [...this.users, ...data];
      });
  }
}