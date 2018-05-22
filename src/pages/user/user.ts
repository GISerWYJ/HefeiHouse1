import {Component, ViewChild} from '@angular/core';
import {App, Content, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ImageViewerPage} from "../image-viewer/image-viewer";
import {StatusBar} from "@ionic-native/status-bar";
import {BaiduPoiProvider} from "../../providers/baidu-poi/baidu-poi";
import {JsonpModule} from "@angular/http";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";


let PhotoSwipe = require('../../photoswipe/dist/photoswipe');
let PhotoSwipeUI_Default = require('../../photoswipe/dist/photoswipe-ui-default');

// import PhotoSwipe from '../../photoswipe/dist/photoswipe';
// import PhotoSwipeUI_Default from '../../photoswipe/dist/photoswipe-ui-default';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare let cordova;

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  @ViewChild(Content) content: Content;
  imgSrc: any;
  myDate: any;
  books: any = [];

  constructor(public app: App,
              public navCtrl: NavController,
              private modalCtrl: ModalController,
              public navParams: NavParams,
              public camera: Camera,
              private statusbar: StatusBar,
              private poi: BaiduPoiProvider,
              private barcodeScanner: BarcodeScanner,
              private doubanBook:BaiduPoiProvider
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter UserPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter UserPage');
  }

  previewPhoto() {
    let current = this;
    // let imgViewer = this.modalCtrl.create(ImageViewerPage);
    // imgViewer.present().then(()=>{
    //
    // });
    let pswpElement = document.querySelectorAll('.pswp')[0];

// build items array
    let items = [
      {
        src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523160211844&di=423efbc37748981109ac6f21cc835933&imgtype=0&src=http%3A%2F%2Fimages2015.cnblogs.com%2Fblog%2F297344%2F201608%2F297344-20160823111106105-1681939703.png',
        w: 693,
        h: 693,
        title: 'this is img 1'
      },
      {
        src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523160289729&di=fb7c862194e81b57849c0ed22c5093bc&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fd009b3de9c82d15853b891be8c0a19d8bc3e4283.jpg',
        w: 1153,
        h: 769,
        title: 'this is img  '
      }
    ];

// define options (if needed)
    let options = {
      // optionName: 'option value'
      // for example:
      index: 0 // start at first slide
    };

// Initializes and opens PhotoSwipe
    let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
    this.statusbar.hide();
    gallery.listen('close', function () {
      //current.app.getRootNav().pop();
      current.statusbar.show();
    });

  }

  selectPhoto() {
    // const options:CameraOptions = {
    //   quality:100,
    //   destinationType:this.camera.DestinationType.DATA_URL,
    //   sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
    //   allowEdit:false,
    //   encodingType:this.camera.EncodingType.JPEG,
    //   saveToPhotoAlbum:false,
    //   mediaType:this.camera.MediaType.PICTURE
    // };
    //
    // this.camera.getPicture(options).then((imageData)=>{
    //
    //   this.imgSrc = 'data:image/jpeg;base64,'+imageData;
    //   this.content.resize();
    // },(error)=>{
    //
    // });
    this.poi.queryByCircle('中学', [31.87304, 117.27465], 2000).subscribe(data => {
      console.log('Success:' + JSON.stringify(data));
    }, err => {
      console.log('failed:' + err.message + ',' + err.status);
    });
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {

      this.imgSrc = 'data:image/jpeg;base64,' + imageData;
      this.content.resize();
    }, (error) => {

    });

  }

  sendNotification() {
    // this.localNotifications.schedule({
    //     //     //   id:1,
    //     //     //   text:`GISerWYJ提醒您，it's coding time`,
    //     //     //   led: 'FF0000',
    //     //     // });
    cordova.plugins.notification.local.schedule({
      title: 'Go Hello111',
      text: 'Thats pretty easy...',
      foreground: true
    });
  }

  startScan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data ', barcodeData.text);
      //this.books.push({barcodeData.text});
      this.doubanBook.getBook(barcodeData.text).subscribe((data)=>{
        console.log(data['image']);
        this.books.push({title:data['title'],img:data['images'].small,author:data['author'].toString()});
      },error1 => {
        console.log('getBookErr:',error1.message);
      });
    }).catch(err => {
      console.log(err.message);
    });
  }

}
