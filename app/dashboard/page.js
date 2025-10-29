"use client";

import { useState, useEffect } from "react";
import styles from "../../styles.module.css";

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", number: "" });
  const [message, setMessage] = useState("");
  const [logoutMsg, setLogoutMsg] = useState("");

  // ✅ Fetch contacts on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    fetch("/api/contacts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch(() => setMessage("⚠️ Failed to load contacts."));
  }, []);

  // ✅ Add or Edit Contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const method = form.id ? "PUT" : "POST";
    const body = form.id
      ? { id: form.id, contact_name: form.name, contact_number: form.number }
      : { contact_name: form.name, contact_number: form.number };

    const res = await fetch("/api/contacts", {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMessage(form.id ? "✅ Contact updated!" : "✅ Contact added!");
      setForm({ id: null, name: "", number: "" });
      reloadContacts();
    } else setMessage("❌ Operation failed.");
  };

  // ✅ Refresh contacts after update
  const reloadContacts = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/contacts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setContacts(data);
  };

  // ✅ Delete Contact
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/contacts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setMessage("🗑️ Contact deleted!");
      reloadContacts();
    } else setMessage("❌ Failed to delete contact.");
  };

  // ✅ Edit Mode
  const handleEdit = (contact) => {
    setForm({ id: contact.id, name: contact.contact_name, number: contact.contact_number });
  };

  // ✅ Logout with message and redirect
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogoutMsg("🚪 Logging out... Redirecting in 5 seconds ⏳");
    setTimeout(() => {
      window.location.href = "/";
    }, 5000);
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>📞 Telephone Directory Dashboard</h1>

      {/* ✅ Logout */}
      <div className={styles.logoutSection}>
        <button onClick={handleLogout} className={styles.btn}>
          Logout
        </button>
        {logoutMsg && <p className={styles.error}>{logoutMsg}</p>}
      </div>

      {/* ✅ Contact Form */}
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            className={styles.input}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            className={styles.input}
            placeholder="Number"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            required
          />
          <button type="submit" className={styles.btn}>
            {form.id ? "Update Contact" : "Add Contact"}
          </button>
        </form>
      </div>

      {message && <p className={styles.error}>{message}</p>}

      {/* ✅ Contact Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <tr key={contact.id}>
                <td data-label="Name">{contact.contact_name}</td>
                <td data-label="Number">{contact.contact_number}</td>
                <td data-label="Actions">
                  <button
                    onClick={() => handleEdit(contact)}
                    className={styles.btn}
                    style={{ marginRight: "8px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className={styles.btn}
                    style={{ backgroundColor: "#e74c3c" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No contacts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
