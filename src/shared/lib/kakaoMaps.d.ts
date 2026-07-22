interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  relayout(): void;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
  setPosition(latlng: KakaoLatLng): void;
}

interface KakaoAddressSearchResult {
  x: string;
  y: string;
  address_name: string;
}

interface KakaoPlaceSearchResult extends KakaoAddressSearchResult {
  place_name: string;
  road_address_name: string;
}

interface KakaoMapServices {
  Geocoder: new () => {
    addressSearch(
      query: string,
      callback: (result: KakaoAddressSearchResult[], status: string) => void,
    ): void;
  };
  Places: new () => {
    keywordSearch(
      query: string,
      callback: (result: KakaoPlaceSearchResult[], status: string) => void,
    ): void;
  };
  Status: { OK: string };
}

interface KakaoMouseEvent {
  latLng: KakaoLatLng;
}

interface KakaoMapsSdk {
  maps: {
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Map: new (
      container: HTMLElement,
      options: { center: KakaoLatLng; level?: number },
    ) => KakaoMap;
    Marker: new (options: {
      position: KakaoLatLng;
      map?: KakaoMap;
    }) => KakaoMarker;
    event: {
      addListener(
        target: KakaoMap | KakaoMarker,
        type: string,
        handler: (event?: KakaoMouseEvent) => void,
      ): void;
    };
    services?: KakaoMapServices;
    load(callback: () => void): void;
  };
}

interface Window {
  kakao: KakaoMapsSdk;
}
