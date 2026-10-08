import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const biteshipOrderId = request.nextUrl.searchParams.get("biteship_order_id");

  if (!biteshipOrderId) {
    return NextResponse.json(
      { error: "biteship_order_id is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.biteship.com/v1/orders/${biteshipOrderId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BITESHIP_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch order" },
        { status: response.status }
      );
    }

    const order = await response.json();
    const courier = order.couriers?.[0];

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        awb: courier?.awb,
        estimated_delivery: courier?.estimated_delivery,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
