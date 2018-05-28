import Vector from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Feature from 'ol/feature';
import Style from 'ol/style/style';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Text from 'ol/style/text';
import Icon from 'ol/style/icon';

import EsriJSON from 'ol/format/esrijson';
import {HttpService} from "./providers/http-service/http-service";
export class NearbyLayer{

  hospital:Vector;
  parking:Vector;
  parks:Vector;
  school:Vector;
  station:Vector;
  sydw:Vector;
  current:NearbyLayer;

  vectorSource:VectorSource;
  layer:Vector;
  currentType:string;
  constructor(private poi:HttpService){

    this.vectorSource = new VectorSource();
    this.layer = new Vector({
      source:this.vectorSource,
      style:this.defaultStyleFunction
    });

    // this.hospital = new Vector({
    //   source:new VectorSource({
    //     url:'assets/kml/hospital.json',
    //     format:new EsriJSON()
    //   }),
    //   style:NearbyLayer.hospitalStyleFunction
    // });
    // this.parking = new Vector({
    //   source:new VectorSource({
    //     url:'assets/kml/parking.json',
    //     format:new EsriJSON()
    //   }),
    //   style:NearbyLayer.parkingStyleFunction
    // });
    // this.parks = new Vector({
    //   source:new VectorSource({
    //     url:'assets/kml/parks.json',
    //     format:new EsriJSON()
    //   }),
    //   style:NearbyLayer.parksStyleFunction
    // });
    // this.school = new Vector({
    //   source:new VectorSource({
    //     url:'assets/kml/school.json',
    //     format:new EsriJSON()
    //   }),
    //   style:NearbyLayer.schoolStyleFunction
    // });
    // this.sydw = new Vector({
    //   source:new VectorSource({
    //     url:'assets/kml/sydw.json',
    //     format:new EsriJSON()
    //   }),
    //   style:NearbyLayer.sydwStyleFunction
    // });
    // this.station = new Vector({
    //   source:new VectorSource({
    //     url:'assets/kml/parking.json',
    //     format:new EsriJSON()
    //   }),
    //   style:NearbyLayer.stationStyleFunction
    // });

    this.current = this;
  }


  query(type:string,center:number[]){
    this.currentType = type;
    this.poi.queryByCircle(type,center,2000).subscribe(data=>{
      let results:any[] = data["results"];

    },err=>{
      console.log(err.message);
    });
  }


   defaultStyleFunction(feature:Feature,resolution:number):Style{
    return new Style({
      image: new Icon({
        anchor: [0.5, 23],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/imgs/school.png',
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


  //  static hospitalStyleFunction(feature,resolution):Style{
  //   return NearbyLayer.defaultStyleFunction(feature,resolution,'hospital');
  //
  // }
  //  static parkingStyleFunction(feature,resolution){
  //    return NearbyLayer.defaultStyleFunction(feature,resolution,'parking');
  // }
  // static parksStyleFunction(feature,resolution){
  //    return NearbyLayer.defaultStyleFunction(feature,resolution,'parks');
  // }
  // static schoolStyleFunction(feature,resolution){
  //   return NearbyLayer.defaultStyleFunction(feature,resolution,'school');
  // }
  // static sydwStyleFunction(feature,resolution){
  //   return NearbyLayer.defaultStyleFunction(feature,resolution,'sydw');
  // }
  // static stationStyleFunction(feature,resolution){
  //   return NearbyLayer.defaultStyleFunction(feature,resolution,'station');
  // }



}
