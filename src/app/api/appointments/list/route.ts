import { NextRequest, NextResponse } from "next/server";
import { getAppointments, initializeData } from "@/lib/appointments";

export async function GET(request: NextRequest) {
  try {
    initializeData();
    const appointments = getAppointments();
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Randevuları listeleme hatası:", error);
    return NextResponse.json(
      { error: "Randevular listelenemiyor" },
      { status: 500 }
    );
  }
}
