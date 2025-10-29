"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles.module.css";

export default function RegisterPage() {
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!uname || !password) {
      setError("Please enter username and password");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uname, password })
    });

    const data = await res.json();

    if (data.success) {
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => router.push("/"), 1500);
    } else {
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Account</h1>
      <input
        type="text"
        placeholder="Username"
        value={uname}
        onChange={(e) => setUname(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleRegister} className={styles.btn}>Register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <p>
        Already a member?{" "}
        <span
          className={styles.link}
          onClick={() => router.push("/")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
