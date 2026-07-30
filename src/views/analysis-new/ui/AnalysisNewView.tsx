"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import DispatchRequestForm from "@/widgets/dispatch-request-form/ui/DispatchRequestForm";
import MapView from "@/shared/ui/MapView";
import type { DispatchLocation } from "@/entities/dispatch-analysis/model/types";
import { useDispatchAnalysis } from "@/entities/dispatch-analysis/model/DispatchAnalysisProvider";

interface SearchResult {
  id: string;
  name: string;
  address: string;
  location: DispatchLocation;
}

export default function AnalysisNewView() {
  const router = useRouter();
  const { setAnalysis } = useDispatchAnalysis();
  const [location, setLocation] = useState<DispatchLocation | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const searchLocations = async (event: FormEvent) => {
    event.preventDefault();
    const keyword = query.trim();
    if (!keyword) {
      setResults([]);
      setSearchError("주소 또는 장소명을 입력하세요.");
      return;
    }
    if (!window.kakao?.maps.services) {
      setSearchError("지도를 준비 중입니다. 잠시 후 다시 시도하세요.");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      const { services } = window.kakao.maps;
      const [addressResults, placeResults] = await Promise.all([
        new Promise<SearchResult[]>((resolve) => {
          new services.Geocoder().addressSearch(keyword, (items, status) =>
            resolve(
              status === services.Status.OK
                ? items.map((item) => ({
                    id: `address-${item.x}-${item.y}`,
                    name: item.address_name,
                    address: item.address_name,
                    location: { lat: Number(item.y), lng: Number(item.x) },
                  }))
                : [],
            ),
          );
        }),
        new Promise<SearchResult[]>((resolve) => {
          new services.Places().keywordSearch(keyword, (items, status) =>
            resolve(
              status === services.Status.OK
                ? items.map((item) => ({
                    id: `place-${item.x}-${item.y}`,
                    name: item.place_name,
                    address: item.road_address_name || item.address_name,
                    location: { lat: Number(item.y), lng: Number(item.x) },
                  }))
                : [],
            ),
          );
        }),
      ]);
      const uniqueResults = [...addressResults, ...placeResults].filter(
        (item, index, all) =>
          all.findIndex(
            (candidate) =>
              candidate.location.lat === item.location.lat &&
              candidate.location.lng === item.location.lng,
          ) === index,
      );
      setResults(uniqueResults.slice(0, 5));
      if (uniqueResults.length === 0) {
        setSearchError("검색 결과가 없습니다.");
      }
    } catch {
      setResults([]);
      setSearchError("검색에 실패했습니다. 잠시 후 다시 시도하세요.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-[22px] sm:py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-[-0.03em] text-ink">
          신고 시뮬레이션
        </h1>
        <p className="mt-1.5 text-[13px] text-[#5c6672]">
          신고 위치와 사고 정보를 입력하면 AI가 출동 분석 결과를 산출합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* 좌: 지도 */}
        <section className="rounded-xl border border-[#ebedf0] card-shadow">
          <div className="flex items-center justify-between border-b border-[#e6e9ee] px-4 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-[3px] bg-ember" />
              <h2 className="text-sm font-bold text-ink">신고 위치 지정</h2>
            </div>
            <span className="text-[11.5px] text-[#6b7280]">
              지도를 클릭해 위치를 지정하세요
            </span>
          </div>
          <div className="relative">
            <MapView
              marker={location}
              enableServices
              onClickLocation={(nextLocation) => {
                setLocation(nextLocation);
                setResults([]);
                setSearchError(null);
              }}
              onMapReady={() => setIsMapReady(true)}
            />

            {location ? (
              <div className="pointer-events-none absolute top-[47%] left-1/2 z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <span className="rounded bg-black px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-white">
                  선택한 위치
                </span>
              </div>
            ) : null}

            <form
              className="absolute top-3 right-3 left-3 z-10"
              onSubmit={(event) => void searchLocations(event)}
            >
              <div className="flex gap-2">
                <label className="flex flex-1 items-center gap-2 rounded-xl border border-[#ebedf0] bg-white px-3 py-2.5 card-shadow">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9aa1ab"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    aria-label="주소 또는 장소명"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="주소 또는 장소명을 검색하세요"
                    className="min-w-0 flex-1 bg-transparent text-[13px] text-[#374151] outline-none placeholder:text-[#5c6672]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!isMapReady || isSearching}
                  className="rounded-xl bg-[#f2f4f6] px-3.5 py-2.5 text-[13px] font-semibold text-[#374151] disabled:text-[#adb3bd]"
                >
                  {isSearching ? "검색 중" : "주소 검색"}
                </button>
              </div>
              {searchError ? (
                <p className="mt-2 rounded-lg bg-white px-3 py-2 text-xs text-risk-high card-shadow">
                  {searchError}
                </p>
              ) : null}
              {results.length > 0 ? (
                <ul className="mt-2 overflow-hidden rounded-xl border border-[#ebedf0] bg-white card-shadow">
                  {results.map((result) => (
                    <li
                      key={result.id}
                      className="border-b border-[#eef0f3] last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setLocation(result.location);
                          setQuery(result.address);
                          setResults([]);
                        }}
                        className="w-full px-3 py-2.5 text-left"
                      >
                        <span className="block text-[13px] font-semibold text-ink">
                          {result.name}
                        </span>
                        <span className="block text-[11px] text-[#6b7280]">
                          {result.address}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </form>

            {location ? (
              <div className="absolute right-3 bottom-3 z-10 rounded-xl border border-[#ebedf0] bg-white/96 px-3 py-2 text-[11.5px] text-[#5c6672] card-shadow">
                좌표{" "}
                <span className="mono text-ink">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              </div>
            ) : null}
          </div>
        </section>

        {/* 우: 입력 폼 */}
        <section className="rounded-xl border border-[#ebedf0] card-shadow">
          <div className="flex items-center gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
            <span className="h-3.5 w-[3px] bg-ember" />
            <h2 className="text-sm font-bold text-ink">신고 정보 입력</h2>
          </div>
          <div className="px-4 pt-5 pb-6 sm:px-6 sm:pt-6 sm:pb-8">
            <DispatchRequestForm
              location={location}
              onSubmitted={(result, equipmentError) => {
                if (!location) return;
                setAnalysis({ result, location, equipmentError });
                router.push(`/analysis/${result.analysisId}`);
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
