
import React, { useContext, useState } from "react";
import { Datacon } from "../Context/DataContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import OtpPopup from "../Components/OtpPopup";
import { sendOtp, verifyOtp } from "../services/apicall/authApi";

const url = process.env.REACT_APP_URL;

export default function RegisterPage() {
    const { register, setRegister } = useContext(Datacon);
    const navigate = useNavigate();

    const [error, setError] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        cpassword: ""
    });

    const [alert, setAlert] = useState({
        show: false,
        type: "",
        message: ""
    });

    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    const showAlert = (type, message) => {
        setAlert({
            show: true,
            type,
            message
        });

        setTimeout(() => {
            setAlert({
                show: false,
                type: "",
                message: ""
            });
        }, 3000);
    };

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updated = {
            ...register,
            [name]: value
        };

        setRegister(updated);

        let message = "";

        if (name === "name") {
            if (!value.trim()) {
                message = "Name is required";
            } else if (value.trim().length < 3) {
                message = "Name must be at least 3 characters";
            }

            setError((prev) => ({
                ...prev,
                name: message
            }));
        }

        if (name === "email") {
            setEmailVerified(false);

            if (!value) {
                message = "Email is required";
            } else if (!emailRegex.test(value)) {
                message = "Please enter a valid email address";
            }

            setError((prev) => ({
                ...prev,
                email: message
            }));
        }

        if (name === "phone") {
            if (!value) {
                message = "Phone number is required";
            } else if (!/^[6-9]\d{9}$/.test(value)) {
                message = "Please enter a valid 10-digit phone number";
            }

            setError((prev) => ({
                ...prev,
                phone: message
            }));
        }

        if (name === "password") {
            if (!value) {
                message = "Password is required";
            } else if (value.length < 6) {
                message = "Password must be at least 6 characters";
            }

            let cmessage = "";

            if (updated.cpassword) {
                if (value !== updated.cpassword) {
                    cmessage = "Password and confirm password do not match";
                }
            }

            setError((prev) => ({
                ...prev,
                password: message,
                cpassword: updated.cpassword ? cmessage : prev.cpassword
            }));
        }

        if (name === "cpassword") {
            if (!value) {
                message = "Confirm password is required";
            } else if (value !== updated.password) {
                message = "Password and confirm password do not match";
            }

            setError((prev) => ({
                ...prev,
                cpassword: message
            }));
        }
    };

    const registerFetch = async () => {
        const newError = {};

        if (!emailVerified) {
            showAlert("failed", "Please verify your email before registering");
            return;
        }


        if (!register.name || !register.name.trim()) {
            newError.name = "Name is required";
        } else if (register.name.trim().length < 3) {
            newError.name = "Name must be at least 3 characters";
        }

        if (!register.email) {
            newError.email = "Email is required";
        } else if (!emailRegex.test(register.email)) {
            newError.email = "Please enter a valid email address";
        }

        if (!register.phone) {
            newError.phone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(register.phone)) {
            newError.phone = "Please enter a valid 10-digit phone number";
        }

        if (!register.password) {
            newError.password = "Password is required";
        } else if (register.password.length < 6) {
            newError.password = "Password must be at least 6 characters";
        }

        if (!register.cpassword) {
            newError.cpassword = "Confirm password is required";
        } else if (register.password !== register.cpassword) {
            newError.cpassword = "Password and confirm password do not match";
        }

        setError(newError);

        if (Object.keys(newError).length > 0) {
            return;
        }

        try {
            const response = await fetch(`${url}/create-register`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    name: register.name,
                    email: register.email,
                    phone: register.phone,
                    pwd: register.password,
                    cpwd: register.cpassword
                })
            });

            const data = await response.json();

            if (data.success) {
                showAlert("success", data.message);

                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                showAlert("failed", data.message || "Registration failed");
            }
        } catch (err) {
            console.log("Error in register user", err);
            showAlert("failed", "Unable to connect to server");
        }
    };

    const handleSendOtp = async () => {
        try {
            if (!register.name || !register.email) {
                showAlert("failed", "Please enter your name and email");
                return;
            }

            if (!emailRegex.test(register.email)) {
                showAlert("failed", "Please enter a valid email address");
                return;
            }

            setLoading(true);

            const result = await sendOtp({
                name: register.name,
                email: register.email
            });

            if (result.success) {
                setShowOtp(true);
                showAlert("success", result.message);
            } else {
                showAlert("failed", result.message);
            }
        } catch (err) {
            console.log("Error in sending OTP", err);
            showAlert("failed", "Unable to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (otp) => {
        try {
            const result = await verifyOtp({
                email: register.email,
                otp: otp
            });

            if (result.success) {
                showAlert("success", result.message);
                setShowOtp(false);
                setEmailVerified(true);
            } else {
                showAlert("failed", result.message);
            }
        } catch (err) {
            console.log("Error in verifying OTP", err);
            showAlert("failed", "OTP verification failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 px-4 py-8 sm:py-12">
            {alert.show && (
                <div
                    className={`fixed right-4 top-5 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-center justify-between gap-3 rounded-xl px-5 py-4 shadow-xl sm:right-5 ${alert.type === "success"
                            ? "bg-emerald-500 text-white"
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
                                message: ""
                            })
                        }
                        className="text-xl text-white"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="mx-auto max-w-xl">
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-2xl font-bold text-white shadow-lg">
                        G
                    </div>

                    <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                        Form Builder
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Create beautiful forms with ease
                    </p>
                </div>

                <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
                    <div className="overflow-hidden rounded-[22px] bg-white">
                        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-6 py-7 text-white sm:px-8">
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-white/80">
                                Get started
                            </p>

                            <h2 className="text-3xl font-bold">
                                Create Account
                            </h2>

                            <p className="mt-2 text-sm text-white/90">
                                Join GForm and start creating your forms.
                            </p>
                        </div>

                        <div className="space-y-5 p-5 sm:p-8">
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FaUser className="text-purple-500" />
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={register.name || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />

                                {error.name && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {error.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FaEnvelope className="text-purple-500" />
                                    Email Address
                                </label>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        type="email"
                                        name="email"
                                        value={register.email || ""}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={loading || emailVerified}
                                        className={`flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70 ${emailVerified
                                                ? "bg-emerald-500"
                                                : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-md"
                                            }`}
                                    >
                                        {emailVerified ? (
                                            <>
                                                <MdVerified className="text-lg" />
                                                Verified
                                            </>
                                        ) : loading ? (
                                            "Sending..."
                                        ) : (
                                            "Send OTP"
                                        )}
                                    </button>
                                </div>

                                {error.email && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {error.email}
                                    </p>
                                )}

                                {emailVerified && (
                                    <p className="mt-1.5 text-sm font-medium text-emerald-600">
                                        Email address verified successfully.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FaPhone className="text-purple-500" />
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={register.phone || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your 10-digit phone number"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />

                                {error.phone && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {error.phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FaLock className="text-purple-500" />
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={register.password || ""}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />

                                {error.password && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {error.password}
                                    </p>
                                )}

                                <p className="mt-1.5 text-xs text-gray-400">
                                    Use at least 6 characters.
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FaLock className="text-purple-500" />
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="cpassword"
                                    value={register.cpassword || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your password again"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />

                                {error.cpassword && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {error.cpassword}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={registerFetch}
                                className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                Create Account
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-xs text-gray-400">
                                    ALREADY REGISTERED?
                                </span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            <p className="text-center text-sm text-gray-600">
                                Already have an account?
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="ml-1 font-semibold text-purple-600 transition hover:text-pink-500"
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-5 text-center text-xs text-gray-500">
                    Create, manage, and customize your forms with GForm.
                </p>
            </div>

            {showOtp && (
                <OtpPopup
                    onClose={() => setShowOtp(false)}
                    onVerify={handleVerifyOtp}
                    onResend={handleSendOtp}
                />
            )}
        </div>
    );
}
