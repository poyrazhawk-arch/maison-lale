import { NextRequest, NextResponse } from "next/server";
import { createAppointment, initializeData } from "@/lib/appointments";

export async function POST(request: NextRequest) {
  try {
    initializeData();

    const body = await request.json();
    const { firstName, lastName, phone, notes, appointmentDate, appointmentTime } = body;

    if (!firstName || !lastName || !phone || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik" },
        { status: 400 }
      );
    }

    const appointment = createAppointment({
      firstName,
      lastName,
      phone,
      notes,
      appointmentDate,
      appointmentTime,
      status: "Beklemede",
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Randevu oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Randevu oluşturulamadı" },
      { status: 500 }
    );
  }
}
