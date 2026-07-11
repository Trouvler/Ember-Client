interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
  setPosition(latlng: KakaoLatLng): void;
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
        target: KakaoMap,
        type: string,
        handler: (event: KakaoMouseEvent) => void,
      ): void;
    };
    load(callback: () => void): void;
  };
}

interface Window {
  kakao: KakaoMapsSdk;
}
