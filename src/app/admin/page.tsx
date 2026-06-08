"use client";

import { useState, useEffect } from "react";
import "@/styles/admin.css";

interface Appointment {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  notes?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "Beklemede" | "Onaylandı" | "İptal Edildi";
  createdAt: string;
}

interface WorkingHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: number;
}

interface CapacityInfo {
  available: number;
  total: number;
  status: "empty" | "partial" | "full";
}

const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export default function AdminPanel() {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [capacityInfo, setCapacityInfo] = useState<Record<string, CapacityInfo>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load data when token is set
  useEffect(() => {
    if (adminToken) {
      loadAppointments();
      loadWorkingHours();
      loadCapacityInfo();
    }
  }, [adminToken]);

  // Reload capacity when month changes
  useEffect(() => {
    if (adminToken) {
      loadCapacityInfo();
    }
  }, [currentDate, adminToken]);

  const loadAppointments = async () => {
    try {
      const response = await fetch("/api/appointments/list");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Randevuları yükleme hatası:", error);
    }
  };

  const loadWorkingHours = async () => {
    try {
      const response = await fetch("/api/working-hours/list");
      const data = await response.json();
      setWorkingHours(data);
    } catch (error) {
      console.error("Çalışma saatlerini yükleme hatası:", error);
    }
  };

  const loadCapacityInfo = async () => {
    try {
      const response = await fetch(
        `/api/appointments/capacity?year=${currentDate.getFullYear()}&month=${currentDate.getMonth()}`
      );
      const data = await response.json();
      setCapacityInfo(data);
    } catch (error) {
      console.error("Kapasite bilgisi getirilemedi:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAdminToken(data.token);
        setPassword("");
        setMessage({ type: "success", text: "Giriş başarılı" });
      } else {
        setMessage({ type: "error", text: "Yanlış şifre" });
      }
    } catch (error) {
      console.error("Login hatası:", error);
      setMessage({ type: "error", text: "Bir hata oluştu" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    setPassword("");
    setMessage(null);
  };

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/appointments/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appointmentId, status: newStatus }),
      });

      if (response.ok) {
        loadAppointments();
        loadCapacityInfo();
        setMessage({ type: "success", text: "Durum güncellendi" });
      }
    } catch (error) {
      console.error("Durum güncelleme hatası:", error);
      setMessage({ type: "error", text: "Durum güncellenemedi" });
    }
  };

  const handleWorkingHoursChange = async (dayOfWeek: number, field: string, value: string | number) => {
    const hours = workingHours.find((h) => h.dayOfWeek === dayOfWeek);
    if (!hours) return;

    const updated = {
      ...hours,
      [field]: value,
    };

    try {
      const response = await fetch("/api/working-hours/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (response.ok) {
        loadWorkingHours();
        loadCapacityInfo();
        setMessage({ type: "success", text: "Çalışma saatleri güncellendi" });
      }
    } catch (error) {
      console.error("Çalışma saatleri güncelleme hatası:", error);
      setMessage({ type: "error", text: "Güncelleme başarısız" });
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const calendarDays = [];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getAppointmentsForDate = (dateStr: string) => {
    return appointments.filter((a) => a.appointmentDate === dateStr);
  };

  if (!adminToken) {
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <h1>Yönetim Paneli</h1>
          <p>Erişim için şifre girin</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                disabled={loading}
              />
              <small>Varsayılan şifre: admin123</small>
            </div>

            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Yönetim Paneli</h1>
        <button onClick={handleLogout} className="logout-btn">
          Çıkış Yap
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "calendar" ? "active" : ""}`}
          onClick={() => setActiveTab("calendar")}
        >
          Takvim
        </button>
        <button
          className={`tab-btn ${activeTab === "appointments" ? "active" : ""}`}
          onClick={() => setActiveTab("appointments")}
        >
          Randevular ({appointments.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "working-hours" ? "active" : ""}`}
          onClick={() => setActiveTab("working-hours")}
        >
          Çalışma Saatleri
        </button>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === "calendar" && (
        <div className="admin-content">
          <div className="calendar-admin-wrapper">
            <div className="calendar-header">
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                ←
              </button>
              <h2>
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                →
              </button>
            </div>

            <div className="calendar-legend-admin">
              <div className="legend-item">
                <div className="legend-color available"></div>
                <span>Uygun</span>
              </div>
              <div className="legend-item">
                <div className="legend-color partial"></div>
                <span>Kısmen Dolu</span>
              </div>
              <div className="legend-item">
                <div className="legend-color full"></div>
                <span>Tamamen Dolu</span>
              </div>
            </div>

            <div className="calendar-weekdays">
              {DAYS.map((day) => (
                <div key={day} className="weekday">
                  {day.substring(0, 3)}
                </div>
              ))}
            </div>

            <div className="calendar-days-admin">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={index} className="calendar-day-admin empty"></div>;
                }

                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const capacity = capacityInfo[dateStr];
                const dayAppointments = getAppointmentsForDate(dateStr);

                return (
                  <div
                    key={index}
                    className={`calendar-day-admin ${
                      capacity?.status === "full" ? "full" : capacity?.status === "partial" ? "partial" : "available"
                    }`}
                    title={`${dateStr}: ${dayAppointments.length} randevu`}
                  >
                    <div className="day-number">{day}</div>
                    <div className="day-info">
                      <div className="capacity">{capacity?.available || 0}/{capacity?.total || 0}</div>
                      <div className="appointments-count">{dayAppointments.length} randevu</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <div className="admin-content">
          <div className="appointments-list">
            {appointments.length === 0 ? (
              <p className="empty-state">Henüz randevu yok</p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <h3>{appointment.firstName} {appointment.lastName}</h3>
                    <span className={`status ${appointment.status.toLowerCase().replace(" ", "-")}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="appointment-details">
                    <p><strong>Telefon:</strong> {appointment.phone}</p>
                    <p><strong>Tarih:</strong> {appointment.appointmentDate}</p>
                    <p><strong>Saat:</strong> {appointment.appointmentTime}</p>
                    {appointment.notes && <p><strong>Not:</strong> {appointment.notes}</p>}
                  </div>

                  <div className="appointment-actions">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Beklemede">Beklemede</option>
                      <option value="Onaylandı">Onaylandı</option>
                      <option value="İptal Edildi">İptal Edildi</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Working Hours Tab */}
      {activeTab === "working-hours" && (
        <div className="admin-content">
          <div className="working-hours-grid">
            {workingHours.map((hours) => (
              <div key={hours.dayOfWeek} className="working-hours-card">
                <h3>{DAYS[hours.dayOfWeek]}</h3>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={hours.isActive === 1}
                      onChange={(e) =>
                        handleWorkingHoursChange(hours.dayOfWeek, "isActive", e.target.checked ? 1 : 0)
                      }
                    />
                    Açık
                  </label>
                </div>

                {hours.isActive === 1 && (
                  <>
                    <div className="form-group">
                      <label>Başlangıç Saati</label>
                      <input
                        type="time"
                        value={hours.startTime}
                        onChange={(e) =>
                          handleWorkingHoursChange(hours.dayOfWeek, "startTime", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Bitiş Saati</label>
                      <input
                        type="time"
                        value={hours.endTime}
                        onChange={(e) =>
                          handleWorkingHoursChange(hours.dayOfWeek, "endTime", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
