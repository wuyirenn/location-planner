export type BaseMapType = {
    center: [number, number]
    zoom: number
    height: string
    onLocationClick: (lat: number, lng: number) => void
}