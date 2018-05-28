import {Component, ViewChild} from '@angular/core';
import {Content, NavController, NavParams} from 'ionic-angular';
import {MapPage} from "../map/map";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {StatusBar} from "@ionic-native/status-bar";
import {HttpService} from "../../providers/http-service/http-service";
let PhotoSwipe = require('../../photoswipe/dist/photoswipe');
let PhotoSwipeUI_Default = require('../../photoswipe/dist/photoswipe-ui-default');
/**
 * Generated class for the HousedetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-housedetail',
  templateUrl: 'housedetail.html',
})
export class HousedetailPage {

  title:any;

  lpInfo:any;

  scale:number = 1;

  @ViewChild(Content) content:Content;

  constructor(public statusbar:StatusBar,
              public navCtrl: NavController,
              public navParams: NavParams,
              private photoViewer:PhotoViewer,
              private poi:HttpService
  ) {
    this.lpInfo = this.navParams.get('info');
  }

  viewInMap(geometry,name){
    this.navCtrl.push(MapPage,{geometry:geometry,name:name});
  }

  openGallry(lpID,category=''){

    let current  = this;
    let pswpElement = document.querySelectorAll('.pswp')[0];
    let items:any[];
    let options = {
      index: 0
    };

    this.poi.getImgs(lpID,category).subscribe(data=>{
      items = data["Table"];
      console.log(JSON.stringify(items));
      let gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
      this.statusbar.hide();
      gallery.listen('close',function () {
        //current.app.getRootNav().pop();
        current.statusbar.show();
      });

    },err=>{
      console.log(err.message);
    });


  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HousedetailPage');
    console.log(this.navCtrl.canGoBack());

  }

  onImgClick(imgSrc:string){
    this.photoViewer.show(imgSrc);
  }

}
