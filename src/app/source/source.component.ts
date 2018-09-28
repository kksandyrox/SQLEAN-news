import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

import { NewsService } from '../news/news.service';
import { News } from '../news/news';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {

  news: Array<News> = [];
  error: String;

  constructor(private route: ActivatedRoute, private newsService: NewsService, private location: Location, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getSourceDetail();
  }

  getSourceDetail() {
    const id = +this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.newsService.getSourceDetail(id)
    .subscribe((data: News) => {console.log(data);
      this.news = this.news.concat(data);
      this.spinner.hide();
    }, error => {
      this.error = error;
      this.spinner.hide();
    });
  }

  goBack(): void {
    this.location.back();
  }

}
