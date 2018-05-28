import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../providers/http-service/http-service";
import {NewsDetailPage} from "../news-detail/news-detail";

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  newsList: any = [];
  hostURL = 'http://112.30.63.69:8091/';

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }


  getNews(complete?:any){
    //this.newsList = [];
    this.httpService.getNewsList().subscribe((data) => {
      let totalnewsCount = data["articlelist"].length;
      let imgurl = this.hostURL + "hflsapp";
      let articleurl = this.hostURL + "hflsapp/page/news/public/newsShow.html?uuid=";
      for (let i = 0; i < totalnewsCount; i++) {
        this.newsList.push({
          title: data["articlelist"][i].title,//标题
          //picture1:data.result.data[i].thumbnail_pic_s,//图片1
          //picture2:data.result.data[i].text_ithumbnail_pic_s02mage1,//图片2
          picture3: imgurl + data["articlelist"][i]["thumbnailspath"].split(',')[0],//图片3
          author_name: data["articlelist"][i]["author"],
          date: data["articlelist"][i]["newsTime"],
          uuid: data["articlelist"][i].uuid,
        });
      }
    },error1 => {
      console.log(error1.message);
    },complete);
  }

  ngOnInit() {
    this.getNews();
  }


  showArticle(uuid){
    this.navCtrl.push(NewsDetailPage,{uuid:uuid});
  }

  doRefresh(refresher) {
    this.getNews(()=>{
      refresher.complete();
    });
  }

  doInfinite(infinitScroll){
    this.getNews(()=>{
      infinitScroll.complete();
    });
  }


}
