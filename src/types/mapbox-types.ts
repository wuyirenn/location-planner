// mapbox types + geojson imports

import { FeatureCollection } from "geojson";
import { SelectedLocation } from "./map-types"

export type IsochroneInterfaceProps = {
    selectedLocation: SelectedLocation | null;
}

export type IsochroneResult = {
    result: FeatureCollection;
};
  
export type IsochroneError = {
    error: string;
    profile?: string;
    lat?: number;
    lng?: number;
    contours_minutes?: number;
    polygons?: boolean;
};