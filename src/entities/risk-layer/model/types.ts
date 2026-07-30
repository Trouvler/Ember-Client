export interface RiskLayerProperties {
  dongName: string;
  riskScore: number;
  avgArrivalMinutes: number;
}

export interface RiskLayerFeature {
  type: string;
  properties: RiskLayerProperties;
}

export interface RiskLayerCollection {
  type: string;
  features: RiskLayerFeature[];
}
