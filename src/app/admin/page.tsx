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

const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export default function AdminPanel() {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load data when token is set
  useEffect(() => {
    if (adminToken) {
      loadAppointments();
      loadWorkingHours();
    }
  }, [adminToken]);

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
        setMessage({ type: "success", text: "Çalışma saatleri güncellendi" });
      }
    } catch (error) {
      console.error("Çalışma saatleri güncelleme hatası:", error);
      setMessage({ type: "error", text: "Güncelleme başarısız" });
    }
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
