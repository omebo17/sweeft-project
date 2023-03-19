import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError, map, of } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('roll', { static: true }) roll: ElementRef | undefined;
  name = '';
  surename = '';
  status = '';
  picture = '';
  id = -1;
  friendsCount = -1;
  friends: any[] = [];
  startIndex = 0;
  count = 25;

  bindedOnScroll = this.onScroll.bind(this);

  private subscriptions: Subscription[] = [];

  @HostListener('scroll', ['$event.target'])
  onScroll(event: Event) {
    const element = this.roll?.nativeElement;
    if (element.scrollHeight - element.scrollTop - 1 <= element.clientHeight) {
      this.loadFriends();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        const id: number = params['id'];
        this.id = id;
      })
    );
    this.subscriptions.push(
      this.dataService.getUserById(this.id).subscribe((userData) => {
        this.name = userData.firstName;
        this.surename = userData.lastName;
        this.status = userData.description;
        this.picture = userData.profilePic;
      })
    );
    this.subscriptions.push(
      this.dataService.getFriendsCount(this.id).subscribe((data) => {
        this.friendsCount = data;
      })
    );
    this.loadFriends();
  }

  ngAfterViewInit() {
    this.roll?.nativeElement.addEventListener('scroll', this.bindedOnScroll);
  }

  loadFriends() {
    this.subscriptions.push(
      this.dataService
        .getFriends(this.id, this.startIndex, this.count)
        .subscribe((newFriends) => {
          let temp: any[] = [];
          newFriends.forEach((el: number) => {
            this.subscriptions.push(
              this.dataService
                .getUserById(el)
                .pipe(
                  map((user) => user.firstName + ' ' + user.lastName),
                  catchError(() => of('Unknown'))
                )
                .subscribe((fullName) => {
                  temp.push(fullName);
                  this.friends.push(fullName);
                })
            );
          });
          this.startIndex += this.count;
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.roll?.nativeElement.removeEventListener('scroll', this.bindedOnScroll);
  }
}
