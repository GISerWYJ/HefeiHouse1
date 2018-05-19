import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import proj from "ol/proj";

/*
  Generated class for the OraSpatialParserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OraSpatialParser {

  constructor(public http: HttpClient) {
    console.log('Hello OraSpatialParserProvider Provider');
  }

  /**
   *
   * @param {string} wkt well known text from Oracle Spatial
   * @returns {any[]}
   */
  wkt2polygon(wkt:string){
    let polygonVertices = [];
    let pointsArray  = wkt.replace("POLYGON ((",'').replace("))",'').split(', ');
    for(let i=0;i<pointsArray.length;i++){
      let coords = pointsArray[i].split(' ');
      polygonVertices.push(proj.transform([parseFloat(coords[0]),parseFloat(coords[1])],'EPSG:4326','baidu'));
    }

    return polygonVertices;
  }

}
