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
}
