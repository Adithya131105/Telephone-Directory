"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles.module.css";

export default function LoginPage() {
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!uname || !password) {
      setError("Please enter username and password");
      return;
    }

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uname, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
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
      <button onClick={handleLogin} className={styles.btn}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        New user?{" "}
        <span
          className={styles.link}
          onClick={() => router.push("/register")}
        >
          Create Account
        </span>
      </p>
    </div>
  );
}
