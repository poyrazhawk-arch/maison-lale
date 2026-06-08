import { NextRequest, NextResponse } from "next/server";
import { updateAppointmentStatus, initializeData } from "@/lib/appointments";

export async function POST(request: NextRequest) {
  try {
    initializeData();

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID ve durum parametreleri gerekli" },
        { status: 400 }
      );
    }

    const appointment = updateAppointmentStatus(id, status);

    if (!appointment) {
      return NextResponse.json(
        { error: "Randevu bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Randevu durumunu güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Randevu güncellenemedi" },
      { status: 500 }
    );
  }
}
