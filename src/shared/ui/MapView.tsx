"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

interface MapViewProps {
  marker?: { lat: number; lng: number } | null;
  onClickLocation?: (location: { lat: number; lng: number }) => void;
}

export default function MapView({ marker, onClickLocation }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markerInstanceRef = useRef<KakaoMarker | null>(null);
  const initialMarkerRef = useRef(marker);
  const onClickLocationRef = useRef(onClickLocation);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  useEffect(() => {
    initialMarkerRef.current = marker;
    onClickLocationRef.current = onClickLocation;
  });

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
        onClickLocationRef.current?.({
          lat: event.latLng.getLat(),
          lng: event.latLng.getLng(),
        });
      });
    });
  }, [isSdkLoaded]);

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
  }, [marker]);

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setIsSdkLoaded(true)}
      />
      <div ref={containerRef} className="h-96 w-full rounded-lg" />
    </>
  );
}
