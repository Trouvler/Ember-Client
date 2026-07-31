export interface VulnerableDistrict {
  districtName: string;
  avgArrivalMinutes: number;
  failureRate: number;
}

export interface PolicyDashboard {
  region: string;
  vulnerableDistrictTop5: VulnerableDistrict[];
  totalAnalyzedCases: number;
  avgGoldenTimeFailureRate: number;
  // 집계 전에는 null로 내려온다.
  avgAnalysisSeconds: number | null;
}
