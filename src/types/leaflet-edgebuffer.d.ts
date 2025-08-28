// leaflet types for plugins

import "leaflet";

declare module "leaflet" {
  namespace GridLayer {
    interface Options {
      edgeBufferTiles?: number;
    }
  }
}

declare module "leaflet-edgebuffer" {
  // Plugin extends Leaflet automatically when imported
}