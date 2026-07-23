"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import ErrorFallback from "./ErrorFallback";

const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };
const LOAD_TIMEOUT_MS = 8000;
const EMPTY_MARKERS: readonly MapMarker[] = [];

export interface MapLocation {
  lat: number;
  lng: number;
}

export interface MapMarker extends MapLocation {
  id: string | number;
}

interface MapViewProps {
  marker?: MapLocation | null;
  markers?: readonly MapMarker[];
  enableServices?: boolean;
  center?: MapLocation | null;
  onClickLocation?: (location: MapLocation) => void;
  onClickMarker?: (id: MapMarker["id"]) => void;
  onMapReady?: () => void;
}

export default function MapView({
  marker,
  markers = EMPTY_MARKERS,
  enableServices = false,
  center,
  onClickLocation,
  onClickMarker,
  onMapReady,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markerInstanceRef = useRef<KakaoMarker | null>(null);
  const markerInstancesRef = useRef(new Map<MapMarker["id"], KakaoMarker>());
  const initialMarkerRef = useRef(marker);
  const onClickLocationRef = useRef(onClickLocation);
  const onClickMarkerRef = useRef(onClickMarker);
  const onMapReadyRef = useRef(onMapReady);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    initialMarkerRef.current = marker;
    onClickLocationRef.current = onClickLocation;
    onClickMarkerRef.current = onClickMarker;
    onMapReadyRef.current = onMapReady;
  });

  // ponytail: 8초 이내 로드를 못 하면 실패로 간주. 이후 지연 성공은 놓칠 수 있음(재시도는 새로고침으로 충분)
  useEffect(() => {
    if (isSdkLoaded) {
      return;
    }
    const id = setTimeout(() => {
      console.error("MapView: Kakao Maps SDK 로드 타임아웃");
      setHasLoadError(true);
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [isSdkLoaded]);

  useEffect(() => {
    if (!isSdkLoaded || !containerRef.current) {
      return;
    }

    window.kakao.maps.load(() => {
      const center = initialMarkerRef.current ?? DEFAULT_CENTER;
      const map = new window.kakao.maps.Map(
        containerRef.current as HTMLElement,
        {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: 5,
        },
      );
      mapRef.current = map;

      window.kakao.maps.event.addListener(map, "click", (event) => {
        if (!event) return;
        onClickLocationRef.current?.({
          lat: event.latLng.getLat(),
          lng: event.latLng.getLng(),
        });
      });

      // kakao.maps.load()의 콜백은 SDK 내부적으로 비동기 실행될 수 있어, mapRef가 실제로
      // 채워진 시점을 별도 state로 알려야 marker 동기화 effect가 그 시점에 재실행됨
      setIsMapReady(true);
      onMapReadyRef.current?.();
    });
  }, [isSdkLoaded]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let debounceId: ReturnType<typeof setTimeout> | undefined;
    const observer = new ResizeObserver(() => {
      clearTimeout(debounceId);
      debounceId = setTimeout(() => {
        if (!mapRef.current) {
          return;
        }
        mapRef.current.relayout();
        const center = initialMarkerRef.current ?? DEFAULT_CENTER;
        mapRef.current.setCenter(
          new window.kakao.maps.LatLng(center.lat, center.lng),
        );
      }, 200);
    });
    observer.observe(container);
    return () => {
      clearTimeout(debounceId);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (!marker) {
      markerInstanceRef.current?.setMap(null);
      markerInstanceRef.current = null;
      return;
    }

    const position = new window.kakao.maps.LatLng(marker.lat, marker.lng);

    if (markerInstanceRef.current) {
      markerInstanceRef.current.setPosition(position);
    } else {
      markerInstanceRef.current = new window.kakao.maps.Marker({
        position,
        map: mapRef.current,
      });
    }

    mapRef.current.setCenter(position);
    // isMapReady 의존성 필요: marker가 마운트 시점부터 고정값이면 지도 준비 완료 후에도 재실행돼야 마커가 생성됨
  }, [marker, isMapReady]);

  useEffect(() => {
    if (!mapRef.current || !center) {
      return;
    }

    mapRef.current.setCenter(
      new window.kakao.maps.LatLng(center.lat, center.lng),
    );
  }, [center, isMapReady]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const activeIds = new Set(markers.map((item) => item.id));
    markerInstancesRef.current.forEach((instance, id) => {
      if (!activeIds.has(id)) {
        instance.setMap(null);
        markerInstancesRef.current.delete(id);
      }
    });

    markers.forEach((item) => {
      const position = new window.kakao.maps.LatLng(item.lat, item.lng);
      const instance = markerInstancesRef.current.get(item.id);
      if (instance) {
        instance.setPosition(position);
        return;
      }

      const nextMarker = new window.kakao.maps.Marker({
        position,
        map: mapRef.current ?? undefined,
      });
      window.kakao.maps.event.addListener(nextMarker, "click", () => {
        onClickMarkerRef.current?.(item.id);
      });
      markerInstancesRef.current.set(item.id, nextMarker);
    });
  }, [markers, isMapReady]);

  useEffect(
    () => () => {
      markerInstancesRef.current.forEach((instance) => instance.setMap(null));
      markerInstancesRef.current.clear();
    },
    [],
  );

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}${enableServices ? "&libraries=services" : ""}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setIsSdkLoaded(true)}
        onError={() => {
          console.error("MapView: Kakao Maps SDK 스크립트 로드 실패");
          setHasLoadError(true);
        }}
      />
      {hasLoadError ? (
        <ErrorFallback message="지도를 불러오지 못했습니다." />
      ) : (
        <div ref={containerRef} className="h-[440px] w-full rounded-lg" />
      )}
    </>
  );
}
