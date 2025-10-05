import { NextResponse } from "next/server";

// Utils
import { apiAuth, postAPI } from "@utils/tracking";

export async function POST(req: Request) {
  const trackingData = await req.json();

  apiAuth();

  const urlGet = `https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${trackingData.tracking_number}&courier_code=${trackingData.courier_code}`;
  const optionsGet: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Tracking-Api-Key": process.env.TRACKINGMORE_API_KEY ?? ""
    }
  };

  try {
    await postAPI("https://api.trackingmore.com/v4/trackings/batch", trackingData);

    const result = await fetch(urlGet, optionsGet);
    const data = await result.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("🚨 Failed to create tracking: ", error);
  }
}