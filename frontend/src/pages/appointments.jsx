import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/navbar";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    appointmentDate: "",
    consultationType: "",
    notes: "",
    duration: 60,
    status: "scheduled",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsRes, clientsRes] = await Promise.all([
        api.get("/appointments"),
        api.get("/clients"),
      ]);
      setAppointments(appointmentsRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load appointments/clients");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!formData.clientId || !formData.appointmentDate) {
      alert("Please select a client and date!");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        clientId: formData.clientId,
        appointmentDate: formData.appointmentDate,
        consultationType: formData.consultationType,
        notes: formData.notes,
        remarks: formData.notes,
        duration: Number(formData.duration) || 60,
        status: formData.status,
      };

      await api.post("/appointments", payload);
      alert("Appointment scheduled successfully!");
      setFormData({
        clientId: "",
        appointmentDate: "",
        consultationType: "",
        notes: "",
        duration: 60,
        status: "scheduled",
      });
      const response = await api.get("/appointments");
      setAppointments(response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to schedule appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel and delete this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      alert("Appointment deleted");
      const response = await api.get("/appointments");
      setAppointments(response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete appointment");
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Appointments Calendar</h1>
          <p>Book new consultation sessions and manage your calendar</p>
        </header>

        <div className="grid-split">
          <div className="form-card">
            <h2>Schedule Session</h2>
            <form onSubmit={handleCreateAppointment} className="form-vertical">
              <div className="form-group">
                <label htmlFor="appointment-client">Client *</label>
                <select
                  id="appointment-client"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Client</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="appointment-date">Date & Time *</label>
                <input
                  id="appointment-date"
                  type="datetime-local"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment-type">Consultation Type</label>
                <input
                  id="appointment-type"
                  type="text"
                  name="consultationType"
                  value={formData.consultationType}
                  onChange={handleChange}
                  placeholder="e.g. Kundli Reading, Vastu, Career Advice"
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label htmlFor="appointment-duration">Duration (mins)</label>
                  <input
                    id="appointment-duration"
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="15"
                    max="180"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="appointment-status">Status</label>
                  <select
                    id="appointment-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="appointment-notes">Session Notes / Remarks</label>
                <textarea
                  id="appointment-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write initial concerns, birth details notes, etc."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Scheduling..." : "Schedule Appointment"}
              </button>
            </form>
          </div>

          <div className="table-card">
            <h2>Upcoming Sessions</h2>
            {loading ? (
              <div className="loading-container-inner">
                <div className="spinner"></div>
                <p>Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <p className="no-data">No appointments scheduled.</p>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Date & Time</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Notes / Remarks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt._id}>
                        <td className="font-semibold">
                          {appt.clientId ? (
                            <div className="client-details-summary">
                              <span className="client-name">{appt.clientId.name}</span>
                              <span className="client-phone-sub">{appt.clientId.phone}</span>
                            </div>
                          ) : (
                            <span className="empty-text">Deleted Client</span>
                          )}
                        </td>
                        <td>{new Date(appt.appointmentDate).toLocaleString()}</td>
                        <td>{appt.duration || 60} mins</td>
                        <td>
                          <span className={`badge badge-${appt.status || "scheduled"}`}>
                            {appt.status || "scheduled"}
                          </span>
                        </td>
                        <td className="table-notes-cell">
                          {appt.remarks || appt.notes || <span className="empty-text">No notes</span>}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteAppointment(appt._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments;
