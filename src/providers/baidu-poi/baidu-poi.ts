import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


/*
  Generated class for the BaiduPoiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BaiduPoiProvider {

  private key:string = '2E56EA42402879ae1e6a05766d9d13d3';

  private queryUrl:string = 'http://api.map.baidu.com/place/v2/search?query={name}&' +
    'region={region}&output=json&coord_type=3&ak=2E56EA42402879ae1e6a05766d9d13d3&callback=JSONP_CALLBACK';



  private circleUrl:string = 'http://api.map.baidu.com/place/v2/search?query={tag}&' +
    'location={center}&radius={radius}&output=json&ak='+this.key+'&callback=JSONP_CALLBACK';

  private suggestionUrl:string = 'http://api.map.baidu.com/place/v2/suggestion?query={name}&' +
    'region={region}&city_limit=true&output=json&ak=2E56EA42402879ae1e6a05766d9d13d3&callback=JSONP_CALLBACK';


  private getAllLPUrl:string = 'http://192.168.1.234/lstBackend/services/hfls.asmx/getAllLP?callback=JSONP_CALLBACK';

  private getImgUrl:string = 'http://112.30.63.69:88/lstBackend/services/hfls.asmx/getImages?id={id}&type={type}&callback=JSONP_CALLBACK';

  constructor(public http: HttpClient) {

  }

  queryByCircle(tag:string,center:Array<number>,radius:number,callback:string='cbs'){
    let queryUrl = this.circleUrl.replace('{tag}',tag).
    replace('{center}',center[0]+','+center[1]).
    replace('{radius}',radius.toString());

    return this.http.jsonp(queryUrl,callback);
  }

  getSuggestions(name:string,region:string='合肥'){
    let suggestionUrl = this.suggestionUrl.replace('{name}',name).
      replace('{region}',region);
    return this.http.jsonp(suggestionUrl,'cb');
  }

  getPlaces(name:string,region:string='合肥'){
    let getPlacesUrl = this.queryUrl.replace('{name}',name).
    replace('{region}',region);
    return this.http.jsonp(getPlacesUrl,'cb');
  }

  getAllLP(){
     return this.http.jsonp(this.getAllLPUrl,'cb');
  }

  getImgs(id,type=""){
    let getImgUrl = this.getImgUrl.replace('{id}',id).
    replace('{type}',type);
    return this.http.jsonp(getImgUrl,'cb');
  }

}
