import {Component, ViewChild} from '@angular/core';

import {Platform, MenuController, Nav} from 'ionic-angular';

import {HelloIonicPage} from '../pages/hello-ionic/hello-ionic';
import {ListPage} from '../pages/list/list';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {StartPage} from "../pages/start/start";
import {HousedetailPage} from "../pages/housedetail/housedetail";

//  "config": {
//    "ionic_bundler": "webpack",
//    "ionic_source_map_type": "#inline-source-map"
//  },
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = StartPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
              public menu: MenuController,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      {title: 'Hello Ionic', component: HelloIonicPage},
      {title: 'My First List', component: ListPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.statusBar.overlaysWebView(true);
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      if (this.platform.is('android')) {
        // this.statusBar.styleBlackTranslucent();
        this.statusBar.backgroundColorByHexString("#488aff");
      }
      if (this.platform.is("ios")) {
        this.statusBar.overlaysWebView(true);

      }
    });
  }

  ionViewDidLoad() {
    // Let's navigate from TabsPage to Page1
    this.nav.push(HousedetailPage);
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
