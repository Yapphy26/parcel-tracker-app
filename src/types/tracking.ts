type TrackEvent = {
  checkpoint_date: string;
  checkpoint_delivery_status: string;
  tracking_detail: string;
  location: string;
};

type OriginInfo = {
  trackinfo: TrackEvent[];
};

export type TrackingItem = {
  tracking_number: string;
  courier_code: string;
  delivery_status: string;
  latest_checkpoint_time: string;
  origin_info: OriginInfo;
};

export type TrackingResponse = {
  meta?: any;
  data?: TrackingItem[];
};

export type TrackingField = {
  id: string;
  tracking_number: string;
  courier_code: string;
};

export type DetectRequest = { tracking_number: string }[];