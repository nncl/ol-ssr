import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import Feature from 'ol/Feature';
import Map from 'ol/Map';
import { createEmpty, extend } from 'ol/extent';
import Point from 'ol/geom/Point';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Cluster, OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  map: any;
  source: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const distance = {value: 40};

    const count = 200;
    const features = new Array(count);
    const e = 4500000;
    for (let i = 0; i < count; ++i) {
      const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
      features[i] = new Feature(new Point(coordinates));
    }

    this.source = new VectorSource({
      features
    });

    const clusterSource = new Cluster({
      distance: distance.value,
      source: this.source
    });

    const styleCache = {};
    const clusters = new VectorLayer({
      source: clusterSource,
      style: (feature) => {
        const size = feature.get('features').length;
        let style = styleCache[size];
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({
                color: '#fff'
              }),
              fill: new Fill({
                color: '#3399CC'
              })
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({
                color: '#fff'
              })
            })
          });
          styleCache[size] = style;
        }
        return style;
      }
    });

    const raster = new TileLayer({
      source: new OSM()
    });

    this.map = new Map({
      layers: [raster, clusters],
      target: 'map'
    });

    this.map.on('click', (evt: any) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, item => {
        return item;
      });

      if (feature) {

        const items = feature.get('features');
        if (items.length > 1) {

          const extent = createEmpty();
          items.forEach((item) => {
            extend(extent, item.getGeometry().getExtent());
          });

          this.center(extent);

        }

      }
    });

    this.center();
  }

  center(extent?) {
    this.map.getView().fit(extent ? extent : this.source.getExtent(), {maxZoom: 16, padding: [24, 24, 24, 24]});
  }

}
