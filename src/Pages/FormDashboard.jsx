
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaFileAlt, FaRegClock } from "react-icons/fa";
import NavBar from "../Components/NavBar";
import { MdDelete } from "react-icons/md";

const url = process.env.REACT_APP_URL;

export default function FormDashboard() {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const getForms = async () => {
            try {
                const response = await fetch(`${url}/my-forms`, {
                    credentials: "include"
                });

                const data = await response.json();

                if (data.success) {
                    setForms(data.forms || []);
                }
            } catch (err) {
                console.log("Error fetching forms:", err);
            } finally {
                setLoading(false);
            }
        };

        getForms();
    }, []);

    const createBlankForm = async () => {
        if (creating) return;

        setCreating(true);

        try {
            const response = await fetch(`${url}/create-test`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    title: "Untitled form",
                    description: ""
                })
            });

            const data = await response.json();

            if (data.success) {
                navigate(`/form/${data.formId}`);
            } else {
                alert(data.message || "Unable to create form");
            }
        } catch (err) {
            console.log("Error creating form:", err);
            alert("Unable to create form");
        } finally {
            setCreating(false);
        }
    };

    const openForm = (form) => {
        localStorage.setItem("formId", form._id);

        localStorage.setItem(
            "desc",
            JSON.stringify({
                name: form.title || "Untitled Form",
                nameDesc: form.description || ""
            })
        );

        navigate(`/form/${form._id}`);
    };

    const deleteForm = async (formId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this form and all its questions?"
        );

        if (!confirmDelete) return;

        setDeletingId(formId);

        try {
            const response = await fetch(`${url}/delete-form/${formId}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await response.json();

            if (data.success) {
                setForms((prevForms) =>
                    prevForms.filter((form) => form._id !== formId)
                );
            } else {
                alert(data.message || "Unable to delete form");
            }
        } catch (err) {
            console.log("Error deleting form:", err);
            alert("Trouble deleting the form");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
            <NavBar showPreview={false} />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                        Form Builder
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Create, manage, and customize your forms
                    </p>
                </div>

                <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
                    <div className="rounded-[22px] bg-white">
                        <div className="rounded-t-[22px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-6 py-8 text-white sm:px-10">
                            <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-white/80">
                                Your workspace
                            </p>

                            <h2 className="text-3xl font-bold sm:text-4xl">
                                My Forms
                            </h2>

                            <p className="mt-2 text-sm text-white/90 sm:text-base">
                                Create a new form or continue working on an existing one.
                            </p>
                        </div>

                        <div className="p-5 sm:p-8">
                            <h3 className="mb-5 text-lg font-semibold text-gray-800">
                                Start a new form
                            </h3>

                            <button
                                type="button"
                                onClick={createBlankForm}
                                disabled={creating}
                                className="group w-full max-w-xs rounded-2xl border-2 border-dashed border-purple-300 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-5 text-left transition hover:border-purple-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <div className="flex h-32 items-center justify-center rounded-xl bg-white shadow-sm transition group-hover:scale-[1.02]">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-md">
                                        <FaPlus className="text-2xl" />
                                    </div>
                                </div>

                                <p className="mt-4 font-semibold text-gray-800">
                                    {creating ? "Creating form..." : "Blank Form"}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Start from scratch
                                </p>
                            </button>

                            <div className="mb-5 mt-10 flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Recent forms
                                </h3>

                                <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
                                    {forms.length} {forms.length === 1 ? "form" : "forms"}
                                </span>
                            </div>

                            {loading ? (
                                <p className="py-8 text-center text-gray-500">
                                    Loading forms...
                                </p>
                            ) : forms.length === 0 ? (
                                <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-10 text-center">
                                    <FaFileAlt className="mx-auto text-4xl text-purple-400" />

                                    <p className="mt-4 font-semibold text-gray-700">
                                        No forms created yet
                                    </p>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Click Blank Form to create your first form.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {forms.map((form) => (
                                        <div
                                            key={form._id}
                                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-purple-400 hover:shadow-lg"
                                        >
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => openForm(form)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        openForm(form);
                                                    }
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-md">
                                                        <FaFileAlt className="text-2xl" />
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <h4 className="truncate font-semibold text-gray-800">
                                                        {form.title || "Untitled Form"}
                                                    </h4>

                                                    <p className="mt-2 truncate text-sm text-gray-500">
                                                        {form.description || "No description"}
                                                    </p>

                                                    <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
                                                        <FaRegClock />

                                                        <span>
                                                            {form.Date
                                                                ? new Date(form.Date).toLocaleDateString()
                                                                : "Recently created"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end border-t border-gray-100 px-4 py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteForm(form._id)}
                                                    disabled={deletingId === form._id}
                                                    title="Delete form"
                                                    aria-label={`Delete ${form.title || "form"}`}
                                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <MdDelete className="text-xl" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <p className="mt-5 text-center text-sm text-gray-500">
                    Designed to make form creation simple and beautiful.
                </p>
            </div>
        </div>
    );
}
