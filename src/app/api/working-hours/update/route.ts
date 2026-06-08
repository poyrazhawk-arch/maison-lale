import { NextRequest, NextResponse } from "next/server";
import { updateWorkingHours, initializeData } from "@/lib/appointments";

export async function POST(request: NextRequest) {
  try {
    initializeData();

    const body = await request.json();
    const { dayOfWeek, startTime, endTime, isActive } = body;

    if (dayOfWeek === undefined || !startTime || !endTime || isActive === undefined) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik" },
        { status: 400 }
      );
    }

    updateWorkingHours(dayOfWeek, startTime, endTime, isActive);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Çalışma saatlerini güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Çalışma saatleri güncellenemedi" },
      { status: 500 }
    );
  }
}
