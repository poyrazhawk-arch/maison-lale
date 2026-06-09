"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "@/styles/appointments.css";

interface CapacityInfo {
  available: number;
  total: number;
  status: "empty" | "partial" | "full";
}

// Hafta Pazartesi başlar (Türkiye standardı)
const DAYS_OF_WEEK = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [capacityInfo, setCapacityInfo] = useState<Record<string, CapacityInfo>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get calendar days
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Pazartesi = 0 offset için: Pazar(0)→6, Pazartesi(1)→0, Salı(2)→1...
  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return (day + 6) % 7;
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

  // Load capacity info for current month
  useEffect(() => {
    fetchCapacityInfo(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  // Fetch available slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchCapacityInfo = async (year: number, month: number) => {
    try {
      const response = await fetch(`/api/appointments/capacity?year=${year}&month=${month}`);
      const data = await response.json();
      setCapacityInfo(data);
    } catch (error) {
      console.error("Kapasite bilgisi getirilemedi:", error);
    }
  };

  const fetchAvailableSlots = async (date: string) => {
    try {
      const response = await fetch(`/api/appointments/available-slots?date=${date}`);
      const data = await response.json();
      setAvailableSlots(data.slots || []);
      setSelectedTime(null);
    } catch (error) {
      console.error("Boş saatler getirilemedi:", error);
      setAvailableSlots([]);
    }
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split("T")[0];
    setSelectedDate(dateStr);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      setMessage({ type: "error", text: "Lütfen tarih ve saat seçiniz" });
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.phone) {
      setMessage({ type: "error", text: "Lütfen tüm zorunlu alanları doldurunuz" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          notes: formData.notes,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Randevunuz başarıyla oluşturuldu!" });
        setFormData({ firstName: "", lastName: "", phone: "", notes: "" });
        setSelectedDate(null);
        setSelectedTime(null);
        setAvailableSlots([]);
        // Refresh capacity info
        fetchCapacityInfo(currentDate.getFullYear(), currentDate.getMonth());
      } else {
        setMessage({ type: "error", text: "Randevu oluşturulamadı" });
      }
    } catch (error) {
      console.error("Randevu oluşturma hatası:", error);
      setMessage({ type: "error", text: "Bir hata oluştu" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <>
      <Nav />
      <section className="appointments-section">
        <div className="container">
          <div className="appointments-header">
            <h1>Randevu Takvimi</h1>
            <p>Uygun bir tarih ve saat seçerek randevunuzu oluşturun</p>
            <div className="capacity-legend">
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
          </div>

          <div className="appointments-content">
            {/* Calendar */}
            <div className="calendar-wrapper">
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

              <div className="calendar-weekdays">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="weekday">
                    {day.substring(0, 3)}
                  </div>
                ))}
              </div>

              <div className="calendar-days">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="calendar-day empty"></div>;
                  }

                  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isPast = dayDate < today;
                  const capacity = capacityInfo[dateStr];
                  const isSelected = selectedDate === dateStr;
                  const isFull = capacity?.status === "full";

                  if (isPast) {
                    return (
                      <div key={index} className="calendar-day past">
                        <div className="day-number">{day}</div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className={`calendar-day active ${
                        isFull ? "full" : capacity?.status === "partial" ? "partial" : "available"
                      } ${isSelected ? "selected" : ""} ${isFull ? "disabled" : ""}`}
                      onClick={() => !isFull && handleDateClick(day)}
                      title={capacity ? `${capacity.available}/${capacity.total} uygun saat` : ""}
                    >
                      <div className="day-number">{day}</div>
                      {capacity && <div className="day-capacity">{capacity.available}/{capacity.total}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <div className="form-wrapper">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Seçilen Tarih</label>
                  <input
                    type="text"
                    value={selectedDate ? formatDate(selectedDate) : "Tarih seçiniz"}
                    disabled
                    className="input-disabled"
                  />
                </div>

                {availableSlots.length > 0 && (
                  <div className="form-group">
                    <label>Saat Seçiniz ({availableSlots.length} uygun saat)</label>
                    <div className="time-slots">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`time-slot ${selectedTime === slot ? "selected" : ""}`}
                          onClick={() => setSelectedTime(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDate && availableSlots.length === 0 && (
                  <div className="form-group">
                    <p className="no-slots">Bu tarihte uygun saat bulunmamaktadır.</p>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="firstName">Ad *</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    placeholder="Adınız"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Soyad *</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    placeholder="Soyadınız"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefon *</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+90 (5XX) XXX XX XX"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Not (İsteğe Bağlı)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    placeholder="Eklemek istediğiniz bir not varsa yazınız..."
                    rows={4}
                  />
                </div>

                {message && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "Gönderiliyor..." : "Randevu Oluştur"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
