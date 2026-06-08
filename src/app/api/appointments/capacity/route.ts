import { NextRequest, NextResponse } from "next/server";
import { getAppointments, getWorkingHours, getHolidays, getSystemSettings, initializeData } from "@/lib/appointments";

export async function GET(request: NextRequest) {
  try {
    initializeData();

    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get("month") || new Date().getMonth().toString());

    const appointments = getAppointments();
    const workingHours = getWorkingHours();
    const holidays = getHolidays();
    const settings = getSystemSettings();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const capacity: Record<string, { available: number; total: number; status: "empty" | "partial" | "full" }> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dateObj = new Date(dateStr + "T00:00:00");
      const dayOfWeek = dateObj.getDay();

      // Check if holiday
      const isHoliday = holidays.some((h) => h.date === dateStr);
      if (isHoliday) {
        capacity[dateStr] = { available: 0, total: 0, status: "full" };
        continue;
      }

      // Get working hours for this day
      const hours = workingHours.find((h) => h.dayOfWeek === dayOfWeek);
      if (!hours || !hours.isActive) {
        capacity[dateStr] = { available: 0, total: 0, status: "full" };
        continue;
      }

      // Calculate total slots for the day
      const [startHour, startMin] = hours.startTime.split(":").map(Number);
      const [endHour, endMin] = hours.endTime.split(":").map(Number);
      const duration = settings?.appointmentDurationMinutes || 60;

      let currentTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      let totalSlots = 0;
      let availableSlots = 0;

      while (currentTime + duration <= endTime) {
        const hour = Math.floor(currentTime / 60);
        const min = currentTime % 60;
        const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;

        totalSlots++;

        // Check if slot is booked
        const isBooked = appointments.some(
          (a) =>
            a.appointmentDate === dateStr &&
            a.appointmentTime === timeStr &&
            a.status !== "İptal Edildi"
        );

        if (!isBooked) {
          availableSlots++;
        }

        currentTime += duration;
      }

      // Determine status
      let status: "empty" | "partial" | "full" = "empty";
      if (availableSlots === 0 && totalSlots > 0) {
        status = "full";
      } else if (availableSlots < totalSlots) {
        status = "partial";
      }

      capacity[dateStr] = { available: availableSlots, total: totalSlots, status };
    }

    return NextResponse.json(capacity);
  } catch (error) {
    console.error("Kapasite bilgisi getirme hatası:", error);
    return NextResponse.json(
      { error: "Kapasite bilgisi getirilemedi" },
      { status: 500 }
    );
  }
}
