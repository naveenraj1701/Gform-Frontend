import React, { useContext, useState } from "react";
import { Datacon } from "../Context/DataContext";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginPage() {
    const url = process.env.REACT_APP_URL;
    const { login, setLogin } = useContext(Datacon);
    const navigate = useNavigate();

    const [error, setError] = useState({
        email: "",
        password: "",
    });

    const [alert, setAlert] = useState({
        show: false,
        type: "",
        message: "",
    });

    const showAlert = (type, message) => {
        setAlert({
            show: true,
            type,
            message,
        });

        setTimeout(() => {
            setAlert({
                show: false,
                type: "",
                message: "",
            });
        }, 3000);
    };

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setLogin({
            ...login,
            [name]: value,
        });

        let message = "";

        if (name === "email") {
            if (!value) {
                message = "Email is required";
            } else if (!emailRegex.test(value)) {
                message = "Please enter a valid email address";
            }
        }

        if (name === "password" && !value) {
            message = "Password is required";
        }

        setError((prev) => ({
            ...prev,
            [name]: message,
        }));
    };

    const loginFetch = async () => {
        const newError = {};

        if (!login.email) {
            newError.email = "Email is required";
        } else if (!emailRegex.test(login.email)) {
            newError.email = "Please enter a valid email address";
        }

        if (!login.password) {
            newError.password = "Password is required";
        }

        setError({
            email: newError.email || "",
            password: newError.password || "",
        });

        if (Object.keys(newError).length > 0) {
            return;
        }

        try {
            const response = await fetch(`${url}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email: login.email,
                    pwd: login.password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                showAlert("success", data.message);

                localStorage.setItem("role", data.user.role);

                setTimeout(() => {
                    if (data.user.role === "admin") {
                        navigate("/admin");
                    } else if (data.user.role === "user") {
                        navigate("/blank");
                    }
                }, 1500);
            } else {
                showAlert("failed", data.message || "Login failed");
            }
        } catch (err) {
            console.log("Error in fetching the login user", err);
            showAlert("failed", "Unable to connect to server");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 flex items-center justify-center px-4 py-8">
            {alert.show && (
                <div
                    className={`fixed top-5 right-5 z-[100] w-[350px] max-w-[calc(100%-2rem)] px-5 py-4 rounded-xl shadow-lg flex items-center justify-between ${
                        alert.type === "success"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl">
                            {alert.type === "success" ? "✓" : "✕"}
                        </span>

                        <p className="font-medium">{alert.message}</p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setAlert({
                                show: false,
                                type: "",
                                message: "",
                            })
                        }
                        className="text-white text-xl ml-3"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="w-full max-w-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-3xl shadow-xl">
                <div className="bg-white rounded-[22px] p-6 sm:p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                            <span className="text-white text-3xl font-bold">
                                G
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Login to your GForm account
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>

                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />

                                <input
                                    type="email"
                                    name="email"
                                    value={login.email || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                />
                            </div>

                            {error.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {error.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />

                                <input
                                    type="password"
                                    name="password"
                                    value={login.password || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                />
                            </div>

                            {error.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {error.password}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="text-sm font-medium text-purple-600 hover:text-pink-500 transition"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={loginFetch}
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition duration-200"
                        >
                            Login
                        </button>

                        <p className="text-center text-sm text-gray-500 pt-2">
                            Don't have an account?
                            <span
                                onClick={() => navigate("/")}
                                className="text-purple-600 font-semibold ml-1 cursor-pointer hover:text-pink-500 transition"
                            >
                                Register
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
