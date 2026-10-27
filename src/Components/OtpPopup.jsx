import React, { useRef, useState } from "react";

const OtpPopup = ({ onClose, onVerify, onResend }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const inputs = useRef([]);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        const updatedOtp = [...otp];

        pasted.split("").forEach((digit, index) => {
            updatedOtp[index] = digit;
        });

        setOtp(updatedOtp);
        inputs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        if (otp.some((digit) => digit === "")) return;

        setLoading(true);

        try {
            await onVerify(otp.join(""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl border border-purple-100 bg-white p-7 shadow-2xl sm:p-9">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-5 top-5 text-2xl text-gray-400 transition hover:text-purple-600"
                >
                    ×
                </button>

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-purple-600">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-8 w-8"
                    >
                        <rect x="3" y="5" width="18" height="14" rx="3" />
                        <path d="m3 7 9 6 9-6" />
                    </svg>
                </div>

                <h2 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-center text-2xl font-bold text-transparent">
                    Verify your email
                </h2>

                <p className="mt-3 text-center text-sm leading-6 text-gray-500">
                    We've sent a 6-digit verification code to your email address.
                    Enter the code below to continue.
                </p>

                <form onSubmit={handleVerify} className="mt-8">
                    <div className="flex justify-center gap-2 sm:gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                autoComplete={index === 0 ? "one-time-code" : "off"}
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                    handleChange(e.target.value, index)
                                }
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                aria-label={`OTP digit ${index + 1}`}
                                className="h-12 w-10 rounded-lg border border-gray-200 bg-slate-50 text-center text-lg font-semibold text-gray-900 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 sm:h-14 sm:w-12"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.some((digit) => digit === "")}
                        className="mt-7 w-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 py-3 font-semibold text-white shadow-md transition duration-200 hover:shadow-lg hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <div className="mt-5 text-center text-sm text-gray-500">
                    Didn't receive the code?{" "}
                    <button
                        type="button"
                        onClick={onResend}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold text-transparent transition hover:from-purple-600 hover:to-pink-500"
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpPopup;
