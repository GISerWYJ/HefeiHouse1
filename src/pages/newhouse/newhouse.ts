import { Component } from '@angular/core';
import {App, Loading, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {getDefaultConfig} from "@ionic/storage/dist/storage";
import {Keyboard} from "@ionic-native/keyboard";
import {HousedetailPage} from "../housedetail/housedetail";
import {HttpService} from "../../providers/http-service/http-service";


@Component({
  selector: 'page-newhouse',
  templateUrl: 'newhouse.html',
})
export class NewhousePage {

  searchValue:string; //搜索文字
  autoCompleteShow:boolean;
  searchItems:string[];
  suggestItems:string[];
  lpArray:any[];
  homeMap:any;
  loading:Loading;
  constructor(private app:App,
              public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl:ViewController,
              private lpService:HttpService,
              private keyboard:Keyboard,
              private loadCtrl:LoadingController) {

               this.homeMap = this.navParams.get("homeMap");

  }

  ionViewDidLoad() {
    //this.viewCtrl.setBackButtonText("");
    this.loading = this.loadCtrl.create({
      content:'正在加载新房列表'
    });
    this.loading.present();
    this.lpService.getAllLP().subscribe(data=>{
       //console.log(JSON.stringify(data)) ;

        this.lpArray = data['Table'];
        this.loading.dismiss();
    },err => {
      console.log(err.message);
    });
    // this.keyboard.onKeyboardHide().subscribe(()=>{
    //   this.homeMap.updateSize();
    // });
    // this.keyboard.onKeyboardShow().subscribe(()=>{
    //   this.homeMap.updateSize();
    // });

    console.log('Hidden home map:'+this.homeMap.getViewport().clientHeight);
  }

  test(){
    console.log('vvvvQ:'+this.homeMap.getViewport().clientHeight);
  }
  ionViewWillLeave(){
    console.log('vvvv:'+this.homeMap.getViewport().clientHeight);
    this.homeMap.updateSize();
  }

  openLPDetail(lpInfo){

    this.app.getRootNav().push(HousedetailPage,{info:lpInfo});
    console.log('Hidden home map:'+this.homeMap.getViewport().clientHeight);
  }

  onInput(){
    console.log(this.searchValue);
    // this.suggestItems = this.items.filter((item)=>{
    //   return (item.indexOf(this.searchValue)>-1);
    // });
    let searchValueEmpty:boolean = this.searchValue.length==0;
    if(searchValueEmpty){
      this.suggestItems = [];
      return;
    }

    this.autoCompleteShow = !searchValueEmpty;
    this.lpService.getSuggestions(this.searchValue).subscribe(data=>{
      //console.log(JSON.stringify(data))
      if(data['message']=='ok'){
        this.suggestItems = data['result'];
      }
    },err => {
      console.log(err.message);
    });

  }

  beginSearch(item){
    this.searchValue = '';
    let queryName = item['name'];
    //this.poi.
  }

  onSumbit(){
    this.keyboard.close();
    console.log('submitted..');

    this.lpService.getPlaces(this.searchValue).subscribe(data=>{
      if(data['message']=='ok'){
        this.searchItems = data['results'];
      }
    },err => {
      console.log(err.message);
    });
    this.searchValue='';
    this.autoCompleteShow = false;
  }

}
