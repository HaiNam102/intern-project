export interface Camera {
    id: number;
    name: string;
    brand: string;
    ipAddress: string;
    status: 'online' | 'offline';
    location: string;
}

export interface WebSocketMessage {
    type: string;
    payload: any;
}

// --- Shelf Monitoring Types ---

export interface Shelf {
  shelfId: string;
  name: string;
  area: string;
  emptyRatioThreshold: number;
  isActive: boolean;
  createdAt: number;
}

export interface RealtimeShelfOsaRate {
  type: "RealtimeShelfOsaRate";
  shelfId: string;
  shelfName: string;
  ts: number;
  osaRatePct: number;
  durationAboveThresholdMinutes: number;
  durationEmptyRatio100Minutes: number;
}

export interface RealtimeShelfDetail {
  type: "RealtimeShelfDetail";
  shelfId: string;
  shelfName: string;
  windowStart: number;
  windowEnd: number;
  shelfOperatingHours: number;
  shelfShortageHours: number;
  shelfShortageRate: number;
  timesAlerted: number;
  timesReplenished: number;
}

export type ShelfWebSocketMessage = RealtimeShelfOsaRate | RealtimeShelfDetail;