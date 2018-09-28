import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { News } from './news';

@Injectable({
    providedIn: 'root'
})
export class NewsService {

    host: String;

    constructor(private http: HttpClient) {
        this.host = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    }

    getHeadlines(start, end) {
        const params = new HttpParams().set('start', start).set('end', end);

        return this.http.get<News>(this.host + '/news', {params})
            .pipe(
                catchError(this.handleError)
            );
    }

    getPopularNews() {
        return this.http.get<News>(this.host + '/news/popularNews')
            .pipe(
                catchError(this.handleError)
            );
    }

    getSources() {
        return this.http.get<News>(this.host + '/news/sources')
            .pipe(
                catchError(this.handleError)
            );
    }

    getSourceDetail(id) {
        const params = new HttpParams().set('id', id);

        return this.http.get<News>(this.host + '/news/source', {params})
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error) {
        return throwError('We have encountered an error. Please try again later.');
    };
}
