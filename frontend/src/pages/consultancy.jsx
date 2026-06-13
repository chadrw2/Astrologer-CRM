import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/navbar";

function Consultancy() {
  const [consultations, setConsultations] = useState([]);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    clientId: "",
    appointmentId: "",
    consultationType: "",
    notes: "",
    recommendations: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [consultationsRes, clientsRes, appointmentsRes] = await Promise.all([
        api.get("/consultations"),
        api.get("/clients"),
        api.get("/appointments"),
      ]);
      setConsultations(consultationsRes.data);
      setClients(clientsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load consultations data");
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
  const filteredAppointments = appointments.filter(
    (appt) => appt.clientId && appt.clientId._id === formData.clientId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientId || !formData.notes || !formData.recommendations) {
      alert("Client, Notes, and Recommendations are required!");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        clientId: formData.clientId,
        appointmentId: formData.appointmentId || undefined,
        consultationType: formData.consultationType,
        notes: formData.notes,
        recommendations: formData.recommendations,
      };

      if (editingId) {
        await api.put(`/consultations/${editingId}`, payload);
        alert("Consultation updated successfully!");
      } else {
        await api.post("/consultations", payload);
        alert("Consultation logged successfully!");
      }
      resetForm();
      const response = await api.get("/consultations");
      setConsultations(response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (consultation) => {
    setEditingId(consultation._id);
    setFormData({
      clientId: consultation.clientId?._id || "",
      appointmentId: consultation.appointmentId?._id || "",
      consultationType: consultation.consultationType || "",
      notes: consultation.notes || "",
      recommendations: consultation.recommendations || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this consultation record?")) return;
    try {
      await api.delete(`/consultations/${id}`);
      alert("Consultation record deleted");
      const response = await api.get("/consultations");
      setConsultations(response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete consultation");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      clientId: "",
      appointmentId: "",
      consultationType: "",
      notes: "",
      recommendations: "",
    });
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Consultations Log</h1>
          <p>Create and update detailed consultation records and astro-remedies</p>
        </header>

        <div className="grid-split">
          <div className="form-card">
            <h2>{editingId ? "Edit Consultation" : "Log Consultation"}</h2>
            <form onSubmit={handleSubmit} className="form-vertical">
              <div className="form-group">
                <label htmlFor="consultation-client">Client *</label>
                <select
                  id="consultation-client"
                  name="clientId"
                  value={formData.clientId}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      clientId: e.target.value,
                      appointmentId: "",
                    });
                  }}
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
                <label htmlFor="consultation-appt">Associated Appointment (Optional)</label>
                <select
                  id="consultation-appt"
                  name="appointmentId"
                  value={formData.appointmentId}
                  onChange={handleChange}
                  disabled={!formData.clientId}
                >
                  <option value="">Select an Appointment</option>
                  {filteredAppointments.map((appt) => (
                    <option key={appt._id} value={appt._id}>
                      {new Date(appt.appointmentDate).toLocaleDateString()} at{" "}
                      {new Date(appt.appointmentDate).toLocaleTimeString()} ({appt.status})
                    </option>
                  ))}
                </select>
                {!formData.clientId && (
                  <span className="helper-text">Select a client first to view their appointments</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="consultation-type">Consultation Type</label>
                <input
                  id="consultation-type"
                  type="text"
                  name="consultationType"
                  value={formData.consultationType}
                  onChange={handleChange}
                  placeholder="e.g. Natal Chart Analysis, Match Making"
                />
              </div>

              <div className="form-group">
                <label htmlFor="consultation-notes">Session Notes *</label>
                <textarea
                  id="consultation-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Summarize client's status, issues raised, chart alignments..."
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="consultation-recs">Recommendations & Remedies *</label>
                <textarea
                  id="consultation-recs"
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Prescribed gems, mantras, timings, spiritual guidance..."
                  required
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Update Log" : "Save Log"}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="table-card">
            <h2>Consultation Records</h2>
            {loading ? (
              <div className="loading-container-inner">
                <div className="spinner"></div>
                <p>Loading consultations...</p>
              </div>
            ) : consultations.length === 0 ? (
              <p className="no-data">No consultations logged yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Type</th>
                      <th>Notes</th>
                      <th>Recommendations</th>
                      <th>Appointment Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultations.map((con) => (
                      <tr key={con._id}>
                        <td className="font-semibold">
                          {con.clientId ? (
                            <div className="client-details-summary">
                              <span className="client-name">{con.clientId.name}</span>
                              <span className="client-phone-sub">{con.clientId.phone}</span>
                            </div>
                          ) : (
                            <span className="empty-text">Deleted Client</span>
                          )}
                        </td>
                        <td>
                          {con.consultationType ? (
                            <span className="type-tag">{con.consultationType}</span>
                          ) : (
                            <span className="empty-text">N/A</span>
                          )}
                        </td>
                        <td className="table-notes-cell">{con.notes}</td>
                        <td className="table-notes-cell font-medium text-accent">
                          ✨ {con.recommendations}
                        </td>
                        <td>
                          {con.appointmentId ? (
                            <span>{new Date(con.appointmentId.appointmentDate).toLocaleString()}</span>
                          ) : (
                            <span className="empty-text">Direct Log (No Appt)</span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn btn-secondary btn-xs"
                              onClick={() => handleEditClick(con)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-xs"
                              onClick={() => handleDelete(con._id)}
                            >
                              Delete
                            </button>
                          </div>
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

export default Consultancy;
