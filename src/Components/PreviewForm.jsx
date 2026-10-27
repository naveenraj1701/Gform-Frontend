import React, { useContext } from "react";
import { Datacon } from "../Context/DataContext";

export default function PreviewForm({ desc }) {
    const { question } = useContext(Datacon);
    const url = process.env.REACT_APP_URL;

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                    Form Preview
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Preview how your form will appear to users.
                </p>
            </div>

            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
                <div className="rounded-[22px] bg-white">
                    <div className="rounded-t-[22px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-6 py-8 text-white sm:px-10">
                        <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-white/80">
                            Your workspace
                        </p>

                        <h2 className="break-words text-3xl font-bold sm:text-4xl">
                            {desc.name}
                        </h2>

                        {desc.nameDesc && (
                            <p className="mt-3 break-words text-sm text-white/90 sm:text-base">
                                {desc.nameDesc}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-5 p-4 sm:p-8">
                        {question.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="rounded-2xl border border-gray-200 border-l-4 border-l-purple-500 bg-white p-4 shadow-sm sm:p-6"
                            >
                                <div className="mb-5 flex gap-1">
                                    <p className="break-words text-lg font-semibold text-gray-800">
                                        {item.name}
                                    </p>

                                    {item.required && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </div>

                                {item.type === "text" && (
                                    <input
                                        type="text"
                                        placeholder="Short answer text"
                                        className="mb-5 w-full border-b border-gray-300 py-3 text-gray-700 outline-none focus:border-purple-500"
                                    />
                                )}

                                {item.type === "radio" && (
                                    <div className="mb-5 flex flex-col gap-4">
                                        {(item.answers || []).map((answer, answerIndex) => (
                                            <label
                                                key={answerIndex}
                                                className="flex items-center gap-3"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    className="accent-purple-600"
                                                />
                                                <span className="break-words text-gray-700">
                                                    {answer}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {item.type === "checkbox" && (
                                    <div className="mb-5 flex flex-col gap-4">
                                        {(item.answers || []).map((answer, answerIndex) => (
                                            <label
                                                key={answerIndex}
                                                className="flex items-center gap-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="accent-purple-600"
                                                />
                                                <span className="break-words text-gray-700">
                                                    {answer}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {item.type === "image" && item.image?.filepath && (
                                    <img
                                        src={`${url}/${item.image.filepath}`}
                                        alt="Uploaded"
                                        className="mt-4 max-h-72 w-auto rounded-xl border border-gray-200 object-contain"
                                    />
                                )}

                                {item.required && (
                                    <p className="mt-3 text-xs font-medium text-purple-600">
                                        * This question is required
                                    </p>
                                )}
                            </div>
                        ))}

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                className="rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
                            >
                                Submit Form
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-5 text-center text-sm text-gray-500">
                Designed to make form creation simple and beautiful.
            </p>
        </div>
    );
}