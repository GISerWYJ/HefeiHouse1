import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

<<<<<<< HEAD
import { DeviceOrientation } from "@ionic-native/device-orientation";
import { HomePage } from "../pages/home/home";
import { StartPage } from "../pages/start/start";
import { NewsPage } from "../pages/news/news";
import { UserPage } from "../pages/user/user";
import { HousedetailPage } from "../pages/housedetail/housedetail";
import { Camera } from "@ionic-native/camera";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { MapPage } from "../pages/map/map";
import { Geolocation } from "@ionic-native/geolocation";
import { AdMobFree } from "@ionic-native/admob-free";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { IonicImageViewerModule } from "ionic-img-viewer";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { ZoomPanDirective } from "../directives/zoom-pan/zoom-pan";
import { ImageViewerPage } from "../pages/image-viewer/image-viewer";
import { BaiduPoiProvider } from '../providers/baidu-poi/baidu-poi';
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";

import { NewhousePage } from "../pages/newhouse/newhouse";
import { Keyboard } from "@ionic-native/keyboard";
import {ScreenOrientation} from "@ionic-native/screen-orientation"
import { ViewResizer } from '../providers/view-resizer/view-resizer';
import { OraSpatialParser } from '../providers/ora-spatial-parser/ora-spatial-parser';
import { HelloProvider } from '../providers/hello/hello';




=======
>>>>>>> b239435... Initial commit
@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
<<<<<<< HEAD
    ListPage,
    HomePage,
    StartPage,
    NewsPage,
    UserPage,
    HousedetailPage,
    MapPage,
    ZoomPanDirective,
    ImageViewerPage,
    NewhousePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '返回',
      mode:'ios'
    }),

    IonicImageViewerModule,
    BrowserAnimationsModule,


=======
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
>>>>>>> b239435... Initial commit
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
<<<<<<< HEAD
    ListPage,
    HomePage,
    StartPage,
    NewsPage,
    UserPage,
    HousedetailPage,
    MapPage,
    ImageViewerPage,
    NewhousePage
=======
    ListPage
>>>>>>> b239435... Initial commit
  ],
  providers: [
    StatusBar,
    SplashScreen,
<<<<<<< HEAD
    DeviceOrientation,
    Camera,
    FileTransfer,
    File,
    Geolocation,
    AdMobFree,
    PhotoViewer,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BaiduPoiProvider,
    Keyboard,
    ScreenOrientation,
    ViewResizer,
    OraSpatialParser,
    HelloProvider
  ]
})
export class AppModule { }
=======
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
>>>>>>> b239435... Initial commit
