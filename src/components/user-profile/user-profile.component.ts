import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { DataService } from 'src/services/data-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('roll', { static: true }) roll: ElementRef | undefined;

  constructor(private route: ActivatedRoute, private dataService: DataService, private elementRef: ElementRef) { }
  name='';
  surename='';
  status='';
  picture='';
  id=-1;
  friendsCount=-1;
  friends : any[]= [];
  startIndex = 0;
  count = 25;
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id: number = params['id'];// can be used later
      this.id=id;
    });
    this.dataService.getUserById(this.id).subscribe(userData => {
      this.name=userData.firstName;
      this.surename=userData.lastName;
      this.status=userData.description;
      this.picture=userData.profilePic;
    });
    this.dataService.getFriendsCount(this.id).subscribe((data) => {this.friendsCount=data});
    this.loadFriends();
  }

  loadFriends() {
    this.dataService.getFriends(this.id, this.startIndex, this.count)
      .subscribe(newFriends => {
        let temp: any[] = [];
        newFriends.forEach((el: number) => {
          this.dataService.getUserById(el).pipe(
            switchMap(userData => this.dataService.getFullName(userData)),
            catchError(() => of('Unknown'))
          ).subscribe(fullName => {
            temp.push(fullName);
            this.friends.push(fullName);
          });
        });
        this.startIndex += this.count;
      });
  }
  
  @HostListener('scroll', ['$event.target'])
  onScroll(event: Event) {
    const element = this.roll?.nativeElement;
    console.log(element.scrollHeight,element.scrollTop,element.clientHeight)
    if (element.scrollHeight - element.scrollTop-1 <= element.clientHeight) {
      this.loadFriends();
    }
  }

  ngAfterViewInit() {
    if (this.roll) {
      this.roll.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    }
  }
}
