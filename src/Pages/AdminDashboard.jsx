
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
   

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="flex flex-col gap-3 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Admin Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your application
                    </p>
                </div>

                <span className="w-fit rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
                    Administrator
                </span>
            </header>

            <main className="p-6">
                <h2 className="mb-5 text-xl font-semibold text-gray-800">
                    Overview
                </h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <h3 className="mt-3 text-3xl font-bold text-teal-600">
                            0
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Registered accounts
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">Total Forms</p>
                        <h3 className="mt-3 text-3xl font-bold text-blue-600">
                            0
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Forms created
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">Admin Status</p>
                        <h3 className="mt-3 text-2xl font-bold text-green-600">
                            Active
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Administrator access
                        </p>
                    </div>
                </div>

                <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Admin Actions
                    </h2>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <button
                            type="button"
                            className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-teal-500 hover:bg-teal-50"
                        >
                            <h3 className="font-semibold text-gray-800">
                                Manage Users
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                View and manage registered users.
                            </p>
                        </button>

                        <button
                            type="button"
                            className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-teal-500 hover:bg-teal-50"
                        >
                            <h3 className="font-semibold text-gray-800">
                                Manage Forms
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                View and manage created forms.
                            </p>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
