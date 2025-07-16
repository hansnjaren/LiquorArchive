// global.d.ts


declare global {
  interface Window {
    kakao: any;
  }

  namespace kakao {
    namespace maps {
      class Map {
        constructor(container: HTMLElement, options: any);
      }
      class LatLng {
        constructor(lat: number, lng: number);
      }
      class Marker {
        constructor(options: any);
      }
      class InfoWindow {
        constructor(options: any);
        open(map: any, marker: any): void;
        close(): void;
      }
    }
  }
}

export {};
