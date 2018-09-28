import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { NewsService } from '../news/news.service';
import { News } from '../news/news';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    news: Array<News> = [];
    popularNews: News;
    sources: News;
    error: String;
    startLimit;
    endLimit;

    constructor(private newsService: NewsService, private spinner: NgxSpinnerService) { 
        this.startLimit = 0;
        this.endLimit = 6;
    }

    ngOnInit() {
        this.getPopularNews();
        this.getSources();
        this.getHeadlines(this.startLimit, this.endLimit);
    }

    getHeadlines(start, end) {
        this.newsService.getHeadlines(start, end)
        .subscribe((data: News) => {
            this.news = this.news.concat(data);
            this.spinner.hide();
        }, error => {
            this.error = error;
            this.spinner.hide();
        });
    }

    onScroll() {
        this.startLimit = this.startLimit + this.endLimit;
        this.getHeadlines(this.startLimit, this.endLimit);
    }

    getPopularNews() {
        this.newsService.getPopularNews()
        .subscribe((data: News) => {
            this.popularNews = data;
        }, error => {
            this.error = error;
            this.spinner.hide();
        });
    }

    getSources() {
        this.newsService.getSources()
        .subscribe((data: News) => {
            this.sources = data;
        }, error => {
            this.error = error;
            this.spinner.hide();
        });
    }
}
