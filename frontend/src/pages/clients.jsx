import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/navbar";

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    birthdate: "",
    birthTime: "",
    birthPlace: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load clients");
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

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Name and Phone are required!");
      return;
    }
    setSubmitting(true);
    try {
      const cleanData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") {
          cleanData[key] = formData[key];
        }
      });

      await api.post("/clients", cleanData);
      alert("Client added successfully!");
      setFormData({
        name: "",
        phone: "",
        email: "",
        gender: "",
        birthdate: "",
        birthTime: "",
        birthPlace: "",
      });
      loadClients();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add client");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await api.delete(`/clients/${id}`);
      alert("Client deleted successfully");
      loadClients();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete client");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <header className="page-header">
          <h1>Clients Management</h1>
          <p>Add new clients and view registration history</p>
        </header>

        <div className="grid-split">
          <div className="form-card">
            <h2>Add New Client</h2>
            <form onSubmit={handleAddClient} className="form-vertical">
              <div className="form-group">
                <label htmlFor="client-name">Name *</label>
                <input
                  id="client-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="client-phone">Phone Number *</label>
                <input
                  id="client-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 555-0199"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="client-email">Email Address</label>
                <input
                  id="client-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@example.com"
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label htmlFor="client-gender">Gender</label>
                  <select
                    id="client-gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="client-birthdate">Birthdate</label>
                  <input
                    id="client-birthdate"
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label htmlFor="client-birthtime">Birth Time</label>
                  <input
                    id="client-birthtime"
                    type="time"
                    name="birthTime"
                    value={formData.birthTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="client-birthplace">Birth Place</label>
                  <input
                    id="client-birthplace"
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    placeholder="e.g. Paris, France"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Adding..." : "Add Client"}
              </button>
            </form>
          </div>

          <div className="table-card">
            <h2>Clients Directory</h2>
            {loading ? (
              <div className="loading-container-inner">
                <div className="spinner"></div>
                <p>Loading clients...</p>
              </div>
            ) : clients.length === 0 ? (
              <p className="no-data">No clients found. Add a client to get started.</p>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Astrology Details</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client._id}>
                        <td className="font-semibold">{client.name}</td>
                        <td>{client.phone}</td>
                        <td>{client.email || <span className="empty-text">N/A</span>}</td>
                        <td>
                          {client.birthdate || client.birthPlace || client.birthTime ? (
                            <div className="astro-summary">
                              {client.birthdate && <span>📅 {formatDate(client.birthdate)}</span>}
                              {client.birthTime && <span>⏰ {client.birthTime}</span>}
                              {client.birthPlace && <span>📍 {client.birthPlace}</span>}
                            </div>
                          ) : (
                            <span className="empty-text">Not provided</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteClient(client._id)}
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

export default Clients;
