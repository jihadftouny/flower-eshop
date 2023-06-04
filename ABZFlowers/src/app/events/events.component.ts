import { Component, OnDestroy, OnInit } from '@angular/core';
import { Eventt } from './event.model';
import { EventsService } from './events.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events: Eventt[] = [];
  isLoading = false;
  totalPosts = 0;
  eventsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  private eventsSub: Subscription; //will avoid memory leaks when this component is not part of the display (kills the data)
  // eventsService: EventsService; the public keyword in the constructor automatically creates this and stores values on it

  constructor(
    public eventsService: EventsService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.eventsSub = this.eventsService
      .getEventUpdateListener()
      .subscribe(
        (eventData: { events: Eventt[]; eventCount: number }) => {
          this.isLoading = false;
          this.totalPosts = eventData.eventCount;
          this.events = eventData.events;
        }
      );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  //called whenever the component is about to be destroyed
  ngOnDestroy() {
    this.eventsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(eventId: string) {
    this.isLoading = true;
    this.eventsService.deleteEvent(eventId).subscribe(() => {
      this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.eventsPerPage = pageData.pageSize;
    this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
  }
}
