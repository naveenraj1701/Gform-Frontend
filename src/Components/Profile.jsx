
import React, { useEffect, useRef, useState } from "react";

export default function Profile() {
    const url = process.env.REACT_APP_URL;
    const imageInputRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        image: ""
    });

    useEffect(() => {
        const getProfile = async () => {
            try {
                console.log("Profile is Called")
                const response = await fetch(`${url}/fetch-profile`, {
                    credentials: "include"
                });

                const data = await response.json();
                console.log(data);

                if (data.success) {
                    setProfile({
                        name: data.user.name || "",
                        email: data.user.email || "",
                        phone: data.user.phone || "",
                        image: data.user.imageUrl || ""
                    });
                }
            } catch (err) {
                console.log("Error fetching profile", err);
            }
        };

        getProfile();
    }, [url]);

    useEffect(() => {
        return () => {
            if (selectedImage && profile.image.startsWith("blob:")) {
                URL.revokeObjectURL(profile.image);
            }
        };
    }, [selectedImage, profile.image]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5 MB");
            e.target.value = "";
            return;
        }

        if (profile.image.startsWith("blob:")) {
            URL.revokeObjectURL(profile.image);
        }

        setSelectedImage(file);

        setProfile((prev) => ({
            ...prev,
            image: URL.createObjectURL(file)
        }));

        e.target.value = "";
    };

    const updateProfile = async () => {
    if (!profile.name.trim() || !profile.email.trim() || !profile.phone.trim()) {
        alert("Please fill in all profile fields");
        return;
    }

    const formData = new FormData();

    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);

    if (selectedImage) {
        formData.append("image", selectedImage);
    }

    try {
        setSaving(true);

        const response = await fetch(`${url}/upload-profile-image`, {
            method: "PUT",
            credentials: "include",
            body: formData
        });

        const data = await response.json();

        console.log("Update response:", data);

        if (data.success) {
            setProfile({
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                image: data.user.imageUrl || ""
            });

            setSelectedImage(null);
            alert("Profile updated successfully");
        } else {
            alert(data.message || "Unable to update profile");
        }
    } catch (err) {
        console.log("Error updating profile:", err);
        alert("Unable to connect to server");
    } finally {
        setSaving(false);
    }
};

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open profile"
                className="relative z-50 h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-purple-500 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-sm transition hover:scale-105"
            >
                {profile.image ? (
                    <img
                        src={profile.image}
                        alt="Profile"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="flex h-full w-full items-center justify-center font-bold text-white">
                        {profile.name
                            ? profile.name.charAt(0).toUpperCase()
                            : "P"}
                    </span>
                )}
            </button>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40"
                />
            )}

            <div
                className={`fixed right-0 top-0 z-50 h-screen w-[280px] max-w-[85vw] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-4 text-white">
                    <h2 className="text-lg font-semibold">Profile</h2>

                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="text-2xl hover:text-white/70"
                    >
                        ×
                    </button>
                </div>

                <div className="flex flex-col items-center gap-2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-5">
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />

                    <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        aria-label="Upload profile image"
                        className="group relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[3px]"
                    >
                        {profile.image ? (
                            <img
                                src={profile.image}
                                alt="Profile"
                                className="h-full w-full rounded-full bg-white object-cover"
                            />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center rounded-full text-3xl font-bold text-white">
                                {profile.name
                                    ? profile.name.charAt(0).toUpperCase()
                                    : "P"}
                            </span>
                        )}

                        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                            Change
                        </span>
                    </button>

                    <p className="text-xs text-gray-500">
                        Click image to upload
                    </p>

                    <p className="break-words text-center text-sm font-semibold text-gray-800">
                        {profile.name || "Your Profile"}
                    </p>
                </div>

                <div className="space-y-4 p-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Name
                        </label>

                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) =>
                                setProfile((prev) => ({
                                    ...prev,
                                    name: e.target.value
                                }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Email
                        </label>

                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                                setProfile((prev) => ({
                                    ...prev,
                                    email: e.target.value
                                }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Phone
                        </label>

                        <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) =>
                                setProfile((prev) => ({
                                    ...prev,
                                    phone: e.target.value
                                }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={updateProfile}
                        disabled={saving}
                        className="w-full rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </div>
        </>
    );
}
