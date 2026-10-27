
import React from "react";
import Profile from "./Profile";

export default function NavBar({ preview, setPreview }) {
    return (
        <nav className="sticky top-0 z-30 border-b border-purple-100 bg-white/95 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-1.5 rounded-full bg-gradient-to-b from-blue-600 via-purple-600 to-pink-500" />

                    <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                        Form Builder
                    </h1>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={() => setPreview(!preview)}
                        className="rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-105 hover:shadow-md sm:px-5 sm:text-base"
                    >
                        {preview ? "Edit Form" : "Preview"}
                    </button>

                    <Profile />
                </div>
            </div>
        </nav>
    );
}
