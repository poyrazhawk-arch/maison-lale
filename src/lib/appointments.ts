// In-memory database for appointments (for demo purposes)
// In production, use a real database like PostgreSQL or MongoDB

interface Appointment {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  notes?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "Beklemede" | "Onaylandı" | "İptal Edildi";
  createdAt: Date;
}

interface WorkingHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isActive: number; // 0 or 1
}

interface SystemSettings {
  appointmentDurationMinutes: number;
  dailyCapacity: number;
  adminPassword: string;
}

interface Holiday {
  id: number;
  date: string; // YYYY-MM-DD
  description?: string;
}

// In-memory storage
let appointments: Appointment[] = [];
let workingHours: WorkingHours[] = [];
let systemSettings: SystemSettings | null = null;
let holidays: Holiday[] = [];
let nextAppointmentId = 1;
let nextHolidayId = 1;

// Initialize default data
export function initializeData() {
  if (workingHours.length === 0) {
    workingHours = [
      { dayOfWeek: 0, startTime: "00:00", endTime: "00:00", isActive: 0 }, // Sunday
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isActive: 1 }, // Monday
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isActive: 1 }, // Tuesday
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isActive: 1 }, // Wednesday
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isActive: 1 }, // Thursday
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isActive: 1 }, // Friday
      { dayOfWeek: 6, startTime: "00:00", endTime: "00:00", isActive: 0 }, // Saturday
    ];
  }

  if (!systemSettings) {
    // Hash of "admin123" using bcryptjs
    systemSettings = {
      appointmentDurationMinutes: 60,
      dailyCapacity: 10,
      adminPassword: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm", // admin123
    };
  }
}

// Appointments
export function createAppointment(data: Omit<Appointment, "id" | "createdAt">) {
  const appointment: Appointment = {
    ...data,
    id: nextAppointmentId++,
    createdAt: new Date(),
  };
  appointments.push(appointment);
  return appointment;
}

export function getAppointments() {
  return appointments;
}

export function getAppointmentById(id: number) {
  return appointments.find((a) => a.id === id);
}

export function updateAppointmentStatus(
  id: number,
  status: "Beklemede" | "Onaylandı" | "İptal Edildi"
) {
  const appointment = appointments.find((a) => a.id === id);
  if (appointment) {
    appointment.status = status;
  }
  return appointment;
}

// Working Hours
export function getWorkingHours() {
  return workingHours;
}

export function updateWorkingHours(
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  isActive: number
) {
  const hours = workingHours.find((h) => h.dayOfWeek === dayOfWeek);
  if (hours) {
    hours.startTime = startTime;
    hours.endTime = endTime;
    hours.isActive = isActive;
  }
}

// Holidays
export function getHolidays() {
  return holidays;
}

export function addHoliday(date: string, description?: string) {
  const holiday: Holiday = {
    id: nextHolidayId++,
    date,
    description,
  };
  holidays.push(holiday);
  return holiday;
}

export function deleteHoliday(id: number) {
  holidays = holidays.filter((h) => h.id !== id);
}

// System Settings
export function getSystemSettings() {
  return systemSettings;
}

export function updateSystemSettings(
  appointmentDurationMinutes: number,
  dailyCapacity: number
) {
  if (systemSettings) {
    systemSettings.appointmentDurationMinutes = appointmentDurationMinutes;
    systemSettings.dailyCapacity = dailyCapacity;
  }
}

export function updateAdminPassword(newPassword: string) {
  if (systemSettings) {
    systemSettings.adminPassword = newPassword;
  }
}

// Utility functions
export function getAvailableSlots(date: string) {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();
  const hours = workingHours.find((h) => h.dayOfWeek === dayOfWeek);

  if (!hours || !hours.isActive) {
    return [];
  }

  // Check if date is a holiday
  const isHoliday = holidays.some((h) => h.date === date);
  if (isHoliday) {
    return [];
  }

  // Generate time slots
  const slots: string[] = [];
  const [startHour, startMin] = hours.startTime.split(":").map(Number);
  const [endHour, endMin] = hours.endTime.split(":").map(Number);
  const duration = systemSettings?.appointmentDurationMinutes || 60;

  let currentTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  while (currentTime + duration <= endTime) {
    const hour = Math.floor(currentTime / 60);
    const min = currentTime % 60;
    const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;

    // Check if slot is available
    const isBooked = appointments.some(
      (a) =>
        a.appointmentDate === date &&
        a.appointmentTime === timeStr &&
        a.status !== "İptal Edildi"
    );

    if (!isBooked) {
      slots.push(timeStr);
    }

    currentTime += duration;
  }

  return slots;
}
