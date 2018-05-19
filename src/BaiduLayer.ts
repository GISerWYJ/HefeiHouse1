//import Map from 'ol/map';
import View from 'ol/view';
import proj from 'ol/proj';
import Tile from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import Projection from 'ol/proj/projection';
import ol_extent from 'ol/extent';
import TileGrid from 'ol/tilegrid/tilegrid';
import has from 'ol/has';
//import { Map } from 'openlayers';
//let projzh = require('../node_modules/projzh/index');
import projzh from 'projzh/index';



export class BaiduLayer{
  layer:Tile;
  bmercResolutions:Array<number>=[];
  constructor() {


    let baiduMercator = new Projection({
      code:'baidu',
      extent:ol_extent.applyTransform([72.004, 0.8293, 137.8347, 55.8271],projzh.ll2bmerc),
      units:'m'
    });

    proj.addProjection(baiduMercator);
    proj.addCoordinateTransforms('EPSG:4326', baiduMercator, projzh.ll2bmerc, projzh.bmerc2ll);
    proj.addCoordinateTransforms('EPSG:3857', baiduMercator, projzh.smerc2bmerc, projzh.bmerc2smerc);


    for (let i = 0; i <= 19; i++) {
      this.bmercResolutions[i] = Math.pow(2, 18- i)*has.DEVICE_PIXEL_RATIO/2;


    }
    let urlTemplate = 'https://ss1.bdstatic.com/8bo_dTSlR1gBo1vgoIiO_jowehsv/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20180321&scaler=2&p=3';

    this.layer = new Tile({
      source: new XYZ({
        projection: 'baidu',
        //maxZoom: 19,
        tileUrlFunction: function(tileCoord) {
          return urlTemplate.replace('{z}', (tileCoord[0]).toString())
            .replace('{x}', tileCoord[1].toString())
            .replace('{y}', tileCoord[2].toString());
        },
        tileSize:512/has.DEVICE_PIXEL_RATIO,
        tilePixelRatio:has.DEVICE_PIXEL_RATIO,
        tileGrid: new TileGrid({
          resolutions: this.bmercResolutions,
          origin: [0, 0],
          tileSize: [512/has.DEVICE_PIXEL_RATIO, 512/has.DEVICE_PIXEL_RATIO]
        })
      })
    });

  }

  /**
   *
   * @param point  [lng.lat]
   * @returns {any}
   * @constructor
   */
  static BD09toWGS84(point){
    return projzh.datum.bd09.toWGS84(point);
  }

  static WGS84toBD09(point){
    return projzh.datum.bd09.fromWGS84(point);
  }

  static BD09toBM(point){
    return proj.transform(BaiduLayer.BD09toWGS84(point), "EPSG:4326", "baidu");
  }

  static WGS84toBM(point){
    BaiduLayer.BD09toBM(BaiduLayer.WGS84toBD09(point));
  }

}
