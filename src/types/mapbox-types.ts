// mapbox types + geojson imports

import { FeatureCollection } from "geojson";
import { SelectedLocation } from "./map-types"

export type IsochroneInterfaceProps = {
    selectedLocation: SelectedLocation | null;
    isochrone: FeatureCollection;
    setIsochrone: React.Dispatch<React.SetStateAction<FeatureCollection>>
}

// DEPRECATED
// export type IsochroneResult = {
//     result: FeatureCollection;
// };
  
// export type IsochroneError = {
//     error: string;
//     profile?: string;
//     lat?: number;
//     lng?: number;
//     contours_minutes?: string;
//     polygons?: boolean;
// };