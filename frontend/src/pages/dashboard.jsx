import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/navbar";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      console.error(err);
      try {
        const [clientsRes, apptsRes] = await Promise.all([
          api.get("/clients"),
          api.get("/appointments")
        ]);
        setStats({
          totalClients: clientsRes.data.length,
          totalAppointments: apptsRes.data.length,
        });
      } catch (fallbackErr) {
        console.error("Fallback load stats failed", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Welcome Back, {user ? user.name : "Consultant"}!</h1>
          <p>Here is the status of your astrology consultations and client relationships.</p>
        </header>

        {loading ? (
          <div className="loading-container-inner">
            <div className="spinner"></div>
            <p>Loading your statistics...</p>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>Total Clients</h3>
                  <div className="stat-value">{stats.totalClients}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>Total Appointments</h3>
                  <div className="stat-value">{stats.totalAppointments}</div>
                </div>
              </div>
            </div>

            <div className="quick-actions-container">
              <h2>Quick Actions</h2>
              <div className="quick-actions-grid">
                <div className="quick-action-card" onClick={() => navigate("/clients")}>
                  <div className="action-icon-wrapper btn-clients">👥</div>
                  <h3>Clients</h3>
                  <p>Add and manage your clients database</p>
                </div>
                <div className="quick-action-card" onClick={() => navigate("/appointments")}>
                  <div className="action-icon-wrapper btn-appointments">📅</div>
                  <h3>Appointments</h3>
                  <p>Schedule and track user consultations</p>
                </div>
                <div className="quick-action-card" onClick={() => navigate("/consultations")}>
                  <div className="action-icon-wrapper btn-consultations">📜</div>
                  <h3>Consultations</h3>
                  <p>Log consultation notes and recommendation history</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;