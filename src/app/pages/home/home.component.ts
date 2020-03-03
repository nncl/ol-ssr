import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare let ol: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  lat = -23.742391;
  lng = -46.527745;
  map: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    const marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([this.lng, this.lat]))
    });

    marker.setStyle(new ol.style.Style({
      image: new ol.style.Icon({
        crossOrigin: 'anonymous',
        src: '/assets/marker.png'
      })
    }));

    const vectorSource = new ol.source.Vector({
      features: [marker]
    });

    const vectorLayer = new ol.layer.Vector({
      source: vectorSource
    });

    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        vectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.lng, this.lat]),
        zoom: 15,
      })
    });
  }

}
