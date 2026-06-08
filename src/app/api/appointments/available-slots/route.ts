import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots, initializeData } from "@/lib/appointments";

export async function GET(request: NextRequest) {
  try {
    initializeData();

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Tarih parametresi gerekli" },
        { status: 400 }
      );
    }

    const slots = getAvailableSlots(date);
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Boş saat dilimlerini getirme hatası:", error);
    return NextResponse.json(
      { error: "Boş saat dilimleri getirilemedi" },
      { status: 500 }
    );
  }
}
