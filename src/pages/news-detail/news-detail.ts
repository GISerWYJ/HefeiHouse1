import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import {HttpService} from "../../providers/http-service/http-service";
import {Arcticle} from "./Arcticle";



@Component({
  selector: 'page-news-detail',
  templateUrl: 'news-detail.html',
})
export class NewsDetailPage {

  arcticle:any={};
  articleID:any;
  hiddenPre=document.createElement("pre");
  constructor(public navCtrl: NavController, public navParams: NavParams,private httpService:HttpService) {
      this.articleID = this.navParams.get('uuid');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsDetailPage');
    this.httpService.getArticle(this.articleID).subscribe((data)=>{

      this.arcticle.articlecontent = this.decodeEntities(data['articlecontent']);
      this.arcticle.articletitle = this.decodeEntities(data['articletitle']);
      this.arcticle.articleauthor = this.decodeEntities(data['articleauthor']);
      this.arcticle.articletime = this.decodeEntities(data['articletime']);


    },error => {
      console.log('get article error');
    });
  }

  decodeEntities(value) {
    if (!value) { return ''; }

    this.hiddenPre.innerHTML = value.replace(/</g,"&lt;");
    // innerText depends on styling as it doesn't display hidden elements.
    // Therefore, it's better to use textContent not to cause unnecessary reflows.
    return this.hiddenPre.textContent;
  }

}
