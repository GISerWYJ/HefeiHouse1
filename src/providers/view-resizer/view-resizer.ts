import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ViewResizer {

  maps:any;
  constructor(public http: HttpClient) {
    this.maps = [];
    let current = this;
    window.onresize = function(){
      setTimeout(()=>{
        for(let i=0;i<current.maps.length;i++){
          current.maps[i].updateSize();
        }
      },100);
    }
  }



  registerMap(map:any){
    this.maps.push(map);
  }

  resizeMap(map:any){
    map.updateSize();
  }


}
