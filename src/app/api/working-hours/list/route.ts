import { NextRequest, NextResponse } from "next/server";
import { getWorkingHours, initializeData } from "@/lib/appointments";

export async function GET(request: NextRequest) {
  try {
    initializeData();
    const hours = getWorkingHours();
    return NextResponse.json(hours);
  } catch (error) {
    console.error("Çalışma saatlerini getirme hatası:", error);
    return NextResponse.json(
      { error: "Çalışma saatleri getirilemedi" },
      { status: 500 }
    );
  }
}
