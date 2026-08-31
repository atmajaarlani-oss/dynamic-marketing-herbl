import { NextResponse } from 'next/server';

export const runtime = "nodejs"

interface BiteshipPricingItem {
  courier_code: string;
  courier_name: string;
  courier_service_name: string;
  courier_service_code: string;
  price: number;
  duration: string;
}

interface BiteshipRateResponse {
  success: boolean;
  pricing: BiteshipPricingItem[];
}

interface OngkirResult {
  courier_code: string;
  service_code: string;
  courier_name: string;
  service: string;
  harga: number;
  estimasi: string;
}

const ALLOWED_COURIER_CODES = ['jne', 'jnt'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination_area_id, total_weight } = body;

    if (!destination_area_id) {
      return NextResponse.json(
        { success: false, message: 'destination_area_id diperlukan' },
        { status: 400 }
      );
    }

    if (!total_weight || total_weight <= 0) {
      return NextResponse.json(
        { success: false, message: 'total_weight (gram) diperlukan' },
        { status: 400 }
      );
    }

    const originAreaId = process.env.BITESHIP_ORIGIN_AREA_ID;
    if (!originAreaId) {
      return NextResponse.json(
        { success: false, message: 'BITESHIP_ORIGIN_AREA_ID tidak terkonfigurasi' },
        { status: 500 }
      );
    }

    const apiKey = process.env.BITESHIP_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'BITESHIP_API_KEY tidak terkonfigurasi' },
        { status: 500 }
      );
    }

    const biteshipRes = await fetch('https://api.biteship.com/v1/rates/couriers', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        origin_area_id: originAreaId,
        destination_area_id,
        couriers: 'jne,jnt',
        items: [
          {
            name: 'Produk',
            value: 0,
            weight: total_weight,
            quantity: 1,
          },
        ],
      }),
    });

    if (!biteshipRes.ok) {
      const errBody = await biteshipRes.text();
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengambil ongkir dari Biteship',
          details: errBody,
        },
        { status: biteshipRes.status }
      );
    }

    const data: BiteshipRateResponse = await biteshipRes.json();

    if (!data.success || !Array.isArray(data.pricing)) {
      return NextResponse.json(
        { success: false, message: 'Format respons Biteship tidak dikenali', data },
        { status: 502 }
      );
    }

    const results: OngkirResult[] = data.pricing
      .filter((item) => ALLOWED_COURIER_CODES.includes(item.courier_code))
      .map((item) => ({
        courier_code: item.courier_code,
        service_code: item.courier_service_code,
        courier_name: item.courier_name,
        service: item.courier_service_name,
        harga: item.price,
        estimasi: item.duration,
      }));

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Error in /api/ongkir:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
