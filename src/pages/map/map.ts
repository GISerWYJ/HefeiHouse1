import {Component} from '@angular/core';

import Tile from 'ol/layer/tile';
import Vector from 'ol/layer/vector';
import PinchZoom from 'ol/interaction/PinchZoom';
import Interaction from 'ol/Interaction';
import {DeviceOrientation, DeviceOrientationCompassHeading} from "@ionic-native/device-orientation";
import {AlertController, Events, NavController, NavParams, Platform, ToastController} from "ionic-angular";
import XYZ from 'ol/source/xyz';
import OSM from 'ol/source/osm';
import VectorSource from 'ol/source/vector';
import Point from 'ol/geom/point';
import Polygon from 'ol/geom/polygon';
import extent from 'ol/extent';
import TileDebug from 'ol/source/tiledebug';
import has from 'ol/has';
//import proj from 'ol/proj';
import Feature from 'ol/feature';
import Style from 'ol/style/style';
import Circle from 'ol/style/circle';
import GeoCircle from 'ol/geom/circle'
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Text from 'ol/style/text';
import Icon from 'ol/style/icon';
import Image from 'ol/layer/image';
import ImageArcGISRest from 'ol/source/imagearcgisrest';
import coordinate from 'ol/coordinate';
import {Geolocation} from "@ionic-native/geolocation";
import {BaiduLayer} from "../../BaiduLayer";
import KML from 'ol/format/kml';
import GeoJSON from 'ol/format/geojson';
import EsriJSON from 'ol/format/esrijson';
import {NearbyLayer} from "../../NearbyLayer";
import {BaiduPoiProvider} from "../../providers/baidu-poi/baidu-poi";
import Map from 'ol/map';
import View from 'ol/view';
import proj from 'ol/proj';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ViewResizer } from '../../providers/view-resizer/view-resizer';
import {Keyboard} from "@ionic-native/keyboard";



//import { Map } from 'openlayers';
//import ol from 'openlayers';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  selectedItem:string;
  map: any;

  positionFeature: Feature;
  accuracyFeature: Feature;

  nearbyLayer:Vector;
  nearbyLayerSource:VectorSource;
  queryFeatures:Feature[];

  currentHouseLayer:Vector;
  currentHouseLayerSource:VectorSource;

  houseLocation:any;
  houseName:string;

  locked:boolean = false;

  xiaoxueKMLLayer:Vector;
  xiaoxueKMLLayerSource:VectorSource;


  constructor(public navParams: NavParams,
              private geolocation: Geolocation,
              private deviceOrientation: DeviceOrientation,
              private screenOrientation:ScreenOrientation,
              public plt: Platform,
              public alertCtrl: AlertController,
              private navCtrl:NavController,
              private poi:BaiduPoiProvider,
              private toastCtrl:ToastController,
              private viewResizer:ViewResizer,
              private keyboard:Keyboard,

              private events:Events) {
      if(this.navParams.get('geometry')){
        this.houseLocation = this.navParams.get('geometry');
        this.houseName = this.navParams.get('name');

        //this.homeMap = this.navParams.get('homeMap');private geoUtils:GeoUtilsProvider,
        console.log("HouseGeometry:"+ this.generatePolygonFromWKT(this.houseLocation));
      }


  }

  generatePolygonFromWKT(wkt:string){
    let polygonVertices = [];
    let pointsArray  = wkt.replace("POLYGON ((",'').replace("))",'').split(', ');
    for(let i=0;i<pointsArray.length;i++){
      let coords = pointsArray[i].split(' ');
      polygonVertices.push(proj.transform([parseFloat(coords[0]),parseFloat(coords[1])],'EPSG:4326','baidu'));
    }

    return polygonVertices;
  }


  ionViewWillLeave(){
    this.navCtrl.swipeBackEnabled = true;
  }

  btnClicked(item){
    this.selectedItem = item;
    this.poi.queryByCircle(item,[this.houseLocation[1],this.houseLocation[0]],2000).subscribe(data=>{
      this.queryFeatures=[];
      this.nearbyLayerSource.clear();
      let results:any[] = data["results"];
      for(let i:number=0;i<results.length;i++){
        let result = results[i];
        let feature = new Feature({
          geometry: new Point(BaiduLayer.BD09toBM([result.location.lng,result.location.lat])),
          labelPoint: new Point(BaiduLayer.BD09toBM([result.location.lng,result.location.lat])),
          name: result.name
        });
        this.queryFeatures.push(feature);

      }
      this.nearbyLayerSource.addFeatures(this.queryFeatures);
      console.log(JSON.stringify(data));
    },err=>{
      console.log(err.message);
    });
  }

  initNearbyLayer(){
    this.nearbyLayerSource = new VectorSource();
    this.nearbyLayer = new Vector({
      source:this.nearbyLayerSource,
      style:this.defaultStyleFunction
    });
  }

  initHouseLayer(){
    this.currentHouseLayerSource = new VectorSource();
    this.currentHouseLayer = new Vector({
      source:this.currentHouseLayerSource
      //style:this.houseStyleFunction
    });
  }

  houseStyleFunction(feature:Feature,resolution:number):Style {
    return new Style({
      image: new Icon({
        anchor: [0.5, 23],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/imgs/sydw.png',
        scale: 0.5
      }),
      text: new Text({
        textAlign: 'end',
        font: 'bold 11px "微软雅黑", "Open Sans", "Arial Unicode MS", "sans-serif"',
        text: feature.get('name'),
        fill: new Fill({color: '#6b605d'}),
        stroke: new Stroke({color: '#FFF', width: 2}),
        offsetX: 15
      })
    });
  }
  defaultStyleFunction(feature:Feature,resolution:number):Style{
    return new Style({
      image: new Icon({
        anchor: [0.5, 23],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/imgs/marker.png',
        scale:0.5
      }),
      text: new Text({
        textAlign: 'end',
        font: 'bold 11px "微软雅黑", "Open Sans", "Arial Unicode MS", "sans-serif"',
        text: feature.get('name'),
        fill: new Fill({color: '#6b605d'}),
        stroke: new Stroke({ color: '#FFF', width: 2}),
        offsetX: 15
      })
    });
  }

  mapClick(event) {

  }

  lock(){
    let toast = this.toastCtrl.create({
      duration: 3000,

    });

    if(this.locked){
      this.screenOrientation.unlock();
      toast.setMessage("屏幕锁定解除");

    }else{
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
      toast.setMessage("屏幕锁定开启");
    }
    this.locked = !this.locked;
    toast.present();
    this.map.updateSize();
  }

  locate() {
    this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((resp) => {
      let newCenter = proj.transform([resp.coords.longitude, resp.coords.latitude], "EPSG:4326", "baidu");
      this.map.getView().setCenter(newCenter);
      this.map.getView().setZoom(15);
      this.positionFeature.setGeometry(new Point(newCenter));
      this.accuracyFeature.setGeometry(new GeoCircle(newCenter, resp.coords.accuracy));
    }).catch((error) => {
      console.log('error getting location', error.message);
    });
  }

  initXueQuLayer(){
    this.xiaoxueKMLLayerSource = new VectorSource({
      url:'assets/kml/xiaoxue.json',
      format:new EsriJSON({
        //extractStyles: false
      })
    });
    this.xiaoxueKMLLayer = new Vector({
      source:this.xiaoxueKMLLayerSource,
      style:new Style({
        stroke: new Stroke({
          color: '#3d5dbf',
          width: 1
        }),
        fill:new Fill({
          color:'rgba(0, 255, 0, 0)'
        })
      })
    });
  }


  ionViewDidLoad() {

    console.log('transforms:' + BaiduLayer.BD09toBM([117.27465, 31.87304]));
    this.initNearbyLayer();
    this.initHouseLayer();
    this.initXueQuLayer();
    let current = this;
    let baiduLayer = new BaiduLayer().layer;
    let center = proj.transform([117.27465, 31.87304], "EPSG:4326", "baidu");
    this.map = new Map({
      interactions: Interaction.defaults().extend([new PinchZoom({
        constrainResolution: true,
        duration: 400
      })]),
      target: 'olmap',
      layers: [
        baiduLayer, this.nearbyLayer, this.currentHouseLayer,this.xiaoxueKMLLayer
      ],
      view: new View({
        center: center,
        zoom: 17,
        projection: 'baidu',
        resolutions: new BaiduLayer().bmercResolutions,
        enableRotation: false
      }),
      loadTilesWhileAnimating: true,
      loadTilesWhileInteracting: true

    });

    //this.viewResizer.registerMap(this.map);



    this.map.on('click', function (event) {
      //let pixel:any = this.map.getEventPixel(event.originalEvent);
      let feature: Feature = current.map.forEachFeatureAtPixel(event.pixel, function (feature) {
        return feature;
      });
      if (feature) {

        let keys = feature.getKeys();
        let value: string;
        for (let i = 0; i < keys.length; i++) {
          value += "<p style='overflow: auto'>" + keys[i] + ":" + feature.get(keys[i]) + "</p>";

        }


        let alert = current.alertCtrl.create({
          title: '',
          subTitle: "<div style='overflow: auto;height: 100%' >" + value + "</div>",
          buttons: ['OK']
        });
        alert.present();
        console.log(JSON.stringify(name));
      }
      else {
        console.log('no feature');
      }
    });


    this.positionFeature = new Feature();
    this.positionFeature.setStyle(new Style({
      // image: new Circle({
      //   radius: 8,
      //   fill: new Fill({
      //     color: '#3399cc'
      //   }),
      //   stroke: new Stroke({
      //     color: '#fff',
      //     width: 1
      //   })
      // })
      image:new Icon({
        src:'assets/icon/position.png',
        scale:0.5
      })
    }));

    this.accuracyFeature = new Feature();
    this.accuracyFeature.setStyle(new Style({
        fill: new Fill({
          color: 'rgba(0,0,255,0.2)'
        }),
        stroke: new Stroke({
          color: '#319FD4',
          width: 1
        })
      }
    ));


    new Vector({
      map: this.map,
      source: new VectorSource({
        features: [this.accuracyFeature, this.positionFeature]
      })
    });
    if (this.houseLocation) {
      let geo:Polygon = (new Polygon([this.generatePolygonFromWKT(this.houseLocation)]));
      //let bdProj:any = proj.get('baidu');
      //geo.transform('EPSG:4326','baidu');
      let center = extent.getCenter(geo.getExtent());
      this.map.getView().setCenter(center);
      let feature = new Feature({
        geometry: geo,
        labelPoint: new Point(center),
        name: this.houseName
      });
      feature.setStyle(new Style({
          fill: new Fill({
            color: 'rgba(0,0,255,0.2)'
          }),
          stroke: new Stroke({
            color: '#319FD4',
            width: 1
          }),
        text: new Text({
          textAlign: 'end',
          font: 'bold 11px "微软雅黑", "Open Sans", "Arial Unicode MS", "sans-serif"',
          text: feature.get('name'),
          fill: new Fill({color: '#6b605d'}),
          stroke: new Stroke({color: '#FFF', width: 2}),
          offsetX: 15
        })
        }
      ));
      this.currentHouseLayerSource.clear();
      this.currentHouseLayerSource.addFeature(feature);
    }
    else {
      this.locate();
    }
    if (this.plt.is('ios') || this.plt.is('android')) {
      // setTimeout(() => {
      //   this.map.updateSize();
      // }, 110);
      // this.keyboard.onKeyboardShow().subscribe(() => {
      //   console.log('Map Height:' + this.map.getViewport().clientHeight);
      // });
      console.log('MainMap Heightssssss:'+this.map.getViewport().clientHeight);

      this.screenOrientation.onChange().subscribe(()=>{
        console.log('Main screen changed');
      });




    }
  }

  ionViewDidEnter(){
    console.log('MainMapEnter Heightssssss:'+this.map.getViewport().clientHeight);
    //this.map.updateSize();
    console.log('MainMapEnterUpdate Heightsssssss:'+this.map.getViewport().clientHeight);
    // this.map.updateSize();
  }



  ionViewWillEnter(){
    this.navCtrl.swipeBackEnabled = false;
    //console.log(has.DEVICE_PIXEL_RATIO);
    console.log('MainMapWillEnterUpdate Heightsssssss:'+this.map.getViewport().clientHeight);
  }

}
