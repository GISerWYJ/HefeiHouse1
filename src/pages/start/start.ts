import {Component, ViewChild} from '@angular/core';
import {Events, NavController, NavParams, Tabs} from 'ionic-angular';
import {HomePage} from "../home/home";

import {NewsPage} from "../news/news";
import {UserPage} from "../user/user";
import {AdMobFree, AdMobFreeBannerConfig} from "@ionic-native/admob-free";

@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  @ViewChild('content') tabRef:Tabs;
  tab1:any;
  tab2:any;
  tab3:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private admobFree:AdMobFree,
              private events:Events) {
    this.tab1 = HomePage;
    this.tab2 = NewsPage;
    this.tab3 = UserPage;
  }

  ionViewWillEnter(){
    this.events.publish('nav:main1');
  }

  ionViewDidEnter(){
    this.events.publish('nav:main');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');

    // const bannderConfig:AdMobFreeBannerConfig = {
    //   id:'ca-app-pub-9744164684092475/5863052740',
    //   //isTesting:true,
    //   autoShow:false
    //   //overlap:true
    //
    // };
    // this.admobFree.banner.config(bannderConfig);
    // this.admobFree.banner.prepare().then(()=>{
    //   this.admobFree.banner.show();
    // }).catch(e=>{
    //   console.log(e);
    // });
  }

}
