interface LinearDecreasing {
  length: string;
  floor: string;
  ceil: string;
}

interface Reciprocal {
  factor: number;
  xOffset: number;
  yOffset: number;
}

interface MinApproval {
  LinearDecreasing: LinearDecreasing;
}

interface MinSupport {
  Reciprocal: Reciprocal;
}

export interface TrackConfig {
  name: string;
  maxDeciding: number;
  decisionDeposit: number;
  preparePeriod: number;
  decisionPeriod: number;
  confirmPeriod: number;
  minEnactmentPeriod: number;
  minApproval: MinApproval;
  minSupport: MinSupport;
}

export type TrackEntry = [number, TrackConfig];

export interface ExtensionConfig {
  disallowed: string[];
  supported: Array<{
    id: string;
    title: string;
    description: string;
    urls: {
      main: string;
      browsers: {
        chrome: string;
        firefox: string;
      };
    };
    iconUrl: string;
  }>;
}