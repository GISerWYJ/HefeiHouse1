import {Component} from '@angular/core';
import Map from 'ol/map';
import View from 'ol/view';
import Tile from 'ol/layer/tile';
import OSM from 'ol/source/osm';
import PinchZoom from 'ol/interaction/PinchZoom';
import Interaction from 'ol/Interaction';
import {DeviceOrientation, DeviceOrientationCompassHeading} from "@ionic-native/device-orientation";
import {AlertController, normalizeURL, Platform} from "ionic-angular";
import XYZ from 'ol/source/xyz';
import TileDebug from 'ol/source/tiledebug';
import has from 'ol/has';
import proj from 'ol/proj';
import Image from 'ol/layer/image';
import ImageArcGISRest from 'ol/source/imagearcgisrest';
import coordinate from 'ol/coordinate';
import {File} from "@ionic-native/file";
import {FileTransfer, FileTransferError, FileTransferObject} from "@ionic-native/file-transfer";
import {URLSearchParams} from "@angular/http";
import TileGrid from 'ol/tilegrid/tilegrid'
import { ImageTile } from 'openlayers';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {


  map: Map;
  fileTransfer: FileTransferObject;

  constructor(private deviceOrientation: DeviceOrientation, public plt: Platform, public alertCtrl: AlertController, public file: File, public transfer: FileTransfer) {
    this.fileTransfer = this.transfer.create();
  }

  getPixelRatio() {
    let alert = this.alertCtrl.create({
      title: 'New Friend!',
      subTitle: this.file.dataDirectory,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidEnter() {
    // this.map.updateSize();
    console.log('Enter ViewHAHAHA');
  }


  mapClick(event) {

  }


  getParam(url, name) {
    let reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(url)) return (RegExp.$2.replace(/\+/g, " "));
    return "";
  }

  ionViewDidLoad() {
    if (this.plt.is('android')) {

    }

    let current = this;
    let imgLayer = new Image({
      source: new ImageArcGISRest({
        url: 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/' +
        'Specialty/ESRI_StateCityHighway_USA/MapServer',
        ratio: 2,
        projection:'baidu'
      })
    });

    let tdtVec: Tile = new Tile({
      source: new XYZ({
        attributions: 'TDT',
        url: 'http://t4.tianditu.com/DataServer?T=vec_w&l={z}&y={y}&x={x}',
        tileSize: 128,
        tilePixelRatio: 2
      })

    });


    let tdtAnno: Tile = new Tile({
      source: new XYZ({
        attributions: 'TDT',
        url: 'http://t4.tianditu.com/DataServer?T=cva_w&l={z}&y={y}&x={x}',
        tileSize: 128,
        tilePixelRatio: 2
      })

    });

    // let resolutions = [];
    // for(let i=0; i<=18; i++){
    //   resolutions[i] = Math.pow(2, 18-i);
    // }
    //
    // let tilegrid  = new TileGrid({
    //   origin: [0,0],  // 设置原点坐标
    //   resolutions: this.map.getView().getResolutions()    // 设置分辨率
    // });

    let amap = new Tile({
      source: new XYZ({
        // url:'https://server.arcgisonline.com/ArcGIS/rest/services/' +
        // 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        // tileSize:128,
        // tilePixelRatio:2
        //url:'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity_Mobile/MapServer/tile/{z}/{y}/{x}',
        url: 'http://webst02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
        //url:'http://mt1.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=1',
       // url:'http://online1.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20160804&scaler=2&p=1',
        tileSize: 128,
        tilePixelRatio: 2,
        //tileGrid:tilegrid,
        //cacheSize:10,
       //  tileUrlFunction: function (tileCoord) {
       //    let z = tileCoord[0];
       //    let x = tileCoord[1];
       //    let y = tileCoord[2] ;
       //
       //
       //    if (x < 0) {
       //       x = 'M' + (-x);
       //    }
       //    if (y < 0) {
       //      y = 'M' + (-y);
       //    }
       //    //let num = (x + y) % 8 + 1;
       //
       //    return 'http://online1.map.bdimg.com/onlinelabel/?qt=tile&x='+x+'&y='+y+'&z='+z+'&styles=pl&udt=20160804&scaler=2&p=1';
       //    // return current.file.dataDirectory + z + "_" + x + "_" + y + ".png";
       //    //
       //    //   current.file.checkFile(current.file.dataDirectory, z + "_" + x + "_" + y + ".png").then(()=>{
       //    //
       //    //     }
       //    //   ,()=>{
       //    //       return 'http://webst02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x='+x+'&y='+y+'&z='+z;
       //    //   }
       //    // );
       //  }
       // ,
        tileLoadFunction: function (imageTile, src) {

          let z = current.getParam(src, "z");
          let x = current.getParam(src, "x");
          let y = current.getParam(src, "y");
          current.file.checkFile(current.file.dataDirectory, z + "_" + x + "_" + y + ".png").then(() => {
            imageTile.getImage().src = normalizeURL(current.file.dataDirectory + z + "_" + x + "_" + y + ".png");
            console.log("used local file");
          }, () => {
            imageTile.getImage().src = src;
            console.log("used online file");
            current.fileTransfer.download(src, current.file.dataDirectory + z + "_" + x + "_" + y + ".png").then((entry) => {
              console.log(current.file.dataDirectory + z + "_" + x + "_" + y + ".png downloaded...");
            }, (error) => {
                console.log('download error');
            });
          });


        }

      })
    });

    let grid = new Tile({
      source: new TileDebug({
        projection: 'EPSG:3857',
        tileGrid: amap.getSource().getTileGrid()
      })
    });
    let center = proj.transform([117.280128, 31.871163], "EPSG:4326", "EPSG:3857");
    this.map = new Map({

      interactions: Interaction.defaults().extend([new PinchZoom({
        constrainResolution: true,
        duration: 400
      })]),
      target: 'olmap',
      layers: [
        //tdtVec,tdtAnno,grid
        amap
      ],
      view: new View({
        center: center,
        zoom: 19,
        maxZoom:20
      }),
      loadTilesWhileAnimating:true,
      loadTilesWhileInteracting: true

    });


    this.map.on('click', function (event) {
      console.log(amap.getSource().getTileGrid().getResolutions());
      let coord = event.coordinate;
      //var degrees = ol.proj.transform(coord, 'EPSG:2436', 'EPSG:4326');
      let hdms = coordinate.toStringXY(coord, 2);
      let alert = current.alertCtrl.create({
        title: 'New Friend!',
        subTitle: hdms,
        buttons: ['OK']
      });
      //alert.present();
    });

    if (this.plt.is('ios') || this.plt.is('android')) {
      console.log('helloworld6');
      this.deviceOrientation.watchHeading().subscribe(
        (data: DeviceOrientationCompassHeading) => {

          this.map.updateSize();
        }
      );
    }

  }

}
