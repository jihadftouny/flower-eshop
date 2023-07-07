import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Eventt } from './event.model';
import { environment } from 'environments/environment';

const BACKEND_URL = environment.apiUrl + '/events/';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private events: Eventt[] = []; //we dont want anyone accessing this variable from outside
  private eventsUpdated = new Subject<{
    events: Eventt[];
    eventCount: number;
  }>(); //we had to use Subject because in the beggining we were pulling a empty array so nothign showed up

  constructor(private http: HttpClient, private router: Router) {}

  getEvents(eventsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${eventsPerPage}&page=${currentPage}`; //this is a template expression
    this.http
      .get<{ message: string; events: any; maxEvents: number }>(
        BACKEND_URL + queryParams
      ) //you can be more clear about the type
      .pipe(
        map((eventData) => {
          return {
            events: eventData.events.map((event) => {
              return {
                id: event._id,
                name: event.name,
                imagePath: event.imagePath,
                creator: event.creator,
              };
            }),
            maxEvents: eventData.maxEvents,
          };
        })
      ) //allows operators (?)
      .subscribe((transformedEventData) => {
        this.events = transformedEventData.events;
        this.eventsUpdated.next({
          events: [...this.events],
          eventCount: transformedEventData.maxEvents,
        });
      });

    //return [...this.events]; //Good Practice! This is a ts/new js feature that copies an array, not only its reference
  }
  getEventUpdateListener() {
    return this.eventsUpdated.asObservable(); //returns an object that can listen but not emit
  }

  getEvent(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addEvent(name: string, image: File) {
    const eventData = new FormData(); //data format allows us to combine text values and blobs (files)_
    eventData.append('name', name);
    eventData.append('image', image, name);
    this.http
      .post<{ message: string; event: Eventt }>(BACKEND_URL, eventData)
      //redirection
      .subscribe((responseData) => {
        this.router.navigate(['/admin-panel']);
      });
    // added to subscribe method
    // this.events.push(event);
    // this.eventsUpdated.next([...this.events]);
  }

  updateEvent(id: string, name: string, image: File | string) {
    let eventData: Eventt | FormData;

    if (typeof image === 'object') {
      eventData = new FormData();
      eventData.append('id', id);
      eventData.append('name', name);
      eventData.append('image', image, name);
    } else {
      eventData = {
        id: id,
        name: name,
        imagePath: image as string,
        creator: null, // we set this as null to remove capability of user to manipulate it
      };
    }
    this.http.put(BACKEND_URL + id, eventData).subscribe((response) => {
      this.router.navigate(['/admin-panel']);
    });
  }

  deleteEvent(eventId: string) {
    return this.http.delete(BACKEND_URL + eventId);
  }
}
