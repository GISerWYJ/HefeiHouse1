import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Component, ViewChild } from '@angular/core';
import {AlertController, App, NavController, NavParams, Slides, Platform, Events} from 'ionic-angular';
import { HelloIonicPage } from "../hello-ionic/hello-ionic";
import { DeviceOrientation, DeviceOrientationCompassHeading } from "@ionic-native/device-orientation";
import { HousedetailPage } from "../housedetail/housedetail";
import { MapPage } from "../map/map";
import { NewhousePage } from "../newhouse/newhouse";
import { BaiduLayer } from "../../BaiduLayer";
import Map from 'ol/map';
import View from 'ol/view';
import proj from 'ol/proj';
import PinchZoom from 'ol/interaction/PinchZoom';
import Interaction from 'ol/Interaction';
import { ViewResizer } from '../../providers/view-resizer/view-resizer';
import {Keyboard} from "@ionic-native/keyboard";
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  modules: any;
  recommends: any;
  ads: any;
  scale: number;
  map: Map;

  constructor(public plt: Platform,
    private deviceOrientation: DeviceOrientation,
    public app: App, public navCtrl: NavController,
    public navParams: NavParams,
    public keyboard: Keyboard,
    private screenOrientation:ScreenOrientation,
    private viewResizer:ViewResizer, private events:Events ) {
    events.subscribe('nav:main',()=>{
      console.log('evenets didEnter fired  :'+this.map.getViewport().clientHeight);
      //this.map.updateSize();

    });
    events.subscribe('nav:main1',()=>{
      console.log('evenets willEnter fired  :'+this.map.getViewport().clientHeight);
      //this.map.updateSize();

    });
    this.scale = 1;
    this.modules = [
      { name: '新房展示', img: 'assets/imgs/house.png', width: 128 / 3 },
      { name: '房价评估', img: 'assets/imgs/calculator.png', width: 128 / 3 },
      { name: '规划信息', img: 'assets/imgs/planning.png', width: 128 / 3 },
      { name: '配套设施', img: 'assets/imgs/peitao.png', width: 128 / 3 },
      { name: '最新资讯', img: 'assets/imgs/news.png', width: 128 / 3 },
      { name: '地图显示', img: 'assets/imgs/map.png', width: 128 / 3 },
    ];
    this.recommends = [
      { src: 'assets/imgs/rec1.jpg', title: '蜀南庭院', text: '稀缺楼盘', location: [117.161267, 31.830801] },
      { src: 'assets/imgs/qs.jpg', title: '海景房值得拥有', text: '新盘出售，速速关注', location: [117.161934, 31.825375] }
    ];
    this.ads = [
      { src: 'assets/imgs/ad4.jpg' },
      { src: 'assets/imgs/ad5.jpg' },
      { src: 'assets/imgs/ad1.jpg' },
    ];

  }

 ionViewWillEnter(){
   console.log('homeWillEnter'+this.map.getViewport().clientHeight);
 }

  ionViewDidEnter(){
    console.log('homeDidEnter'+this.map.getViewport().clientHeight);
    if(this.map){
     // this.map.updateSize();
    }
  }

  ionViewDidLoad() {
    console.log('home page loaded');
    let baiduLayer = new BaiduLayer().layer;
    let center = proj.transform([117.27465, 31.87304], "EPSG:4326", "baidu");
    this.map = new Map({
      interactions: Interaction.defaults().extend([new PinchZoom({
        constrainResolution: true,
        duration: 400
      })]),
      target: 'homeMap',
      controls: [],
      layers: [
        baiduLayer
      ],
      view: new View({
        center: center,
        zoom: 14,
        projection: 'baidu',
        resolutions: new BaiduLayer().bmercResolutions,
        enableRotation: false
      }),
      loadTilesWhileAnimating: true,
      loadTilesWhileInteracting: true

    });
    let current:any = this;

    //this.viewResizer.registerMap(this.map);

    window.addEventListener('resize', function(){
      console.log('HomeMap Resized');
      console.log('Map HeightSSddddddddd d:'+current.map.getViewport().clientHeight);
      // setTimeout(()=>{
      //       current.map.updateSize();
      //     },100);
    });

    console.log('Map Height11111:'+this.map.getViewport().clientHeight);
    if (this.plt.is('ios') || this.plt.is('android')) {

      this.screenOrientation.onChange().subscribe(()=>{
        console.log('home screen changed'+this.map.getViewport().clientWidth);
       // setTimeout(()=>{current.map.updateSize()},100);
      });

      this.keyboard.onKeyboardShow().subscribe(()=>{
        console.log('Map Height:'+this.map.getViewport().clientHeight);
      });

      // this.deviceOrientation.watchHeading().subscribe(
      //   (data: DeviceOrientationCompassHeading) => {
      //     this.map.updateSize();
      //     //console.log('当前朝向？：'+data.magneticHeading);
      //   }
      // );
      // this.screenOrientation.onChange().subscribe(() => {
      //   this.map.updateSize();
      //   console.log('Screen Orientation:' + this.screenOrientation.type);
      // });
    }
    //this.map.updateSize();
  }
  openMap() {
    this.app.getRootNav().push(MapPage,{homeMap:this.map});
    //this.navCtrl.push(MapPage);
  }
  recommendHouseClick(recommend) {
    this.app.getRootNav().push(HousedetailPage, {
      info: recommend
    });
  }

  /**
   * 功能模块点击事件
   * @param name 功能模块名称
   */
  moduleClick(name) {
    switch (name) {
      case '地图显示':
        this.openMap();
        break;
      case '新房展示':
        this.app.getRootNav().push(NewhousePage, { homeMap: this.map });
        break;
    }
  }

}
