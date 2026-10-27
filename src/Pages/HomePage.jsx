import React, { useContext, useEffect, useState, useRef } from "react";
import { Datacon } from "../Context/DataContext";
import { MdDelete, MdContentCopy } from "react-icons/md";
import { FaToggleOff, FaToggleOn, FaCircleDot } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import NavBar from "../Components/NavBar";
import PreviewForm from "../Components/PreviewForm";
import Profile from "../Components/Profile";
import { useParams } from "react-router-dom";

const url = process.env.REACT_APP_URL;

export default function HomePage() {


    const pdfInputRef = useRef(null);
    const { question, setQuestion } = useContext(Datacon);

    const [preview, setPreview] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { formId } = useParams();
    const [isFormLoaded, setIsFormLoaded] = useState(false);

    const [desc, setDesc] = useState({
        name: "Untitled Form",
        nameDesc: ""
    });

    useEffect(() => {
        if (!formId) return;

        const fetchForm = async () => {
            setIsFormLoaded(false);

            try {
                const response = await fetch(`${url}/get-forms/${formId}`, {
                    credentials: "include"
                });

                const data = await response.json();

                if (data.success) {
                    setDesc({
                        name: data.form.title || "Untitled Form",
                        nameDesc: data.form.description || ""
                    });

                    setQuestion(data.questions?.questions || []);
                    setIsFormLoaded(true);
                } else {
                    console.log(data.message);
                }
            } catch (err) {
                console.log("Error fetching form:", err);
            }
        };

        fetchForm();
    }, [formId, setQuestion]);

    useEffect(() => {
        if (!formId || !isFormLoaded) return;

        const timer = setTimeout(async () => {
            try {
                const formResponse = await fetch(`${url}/updates-form/${formId}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': "application/json"
                    },
                    body: JSON.stringify({
                        title: desc.name,
                        description: desc.nameDesc
                    })
                });

                const formData = await formResponse.json();

                if (formData.success) {
                    const questionsResponse = await fetch(`${url}/create-questions`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json"
                        },
                        body: JSON.stringify({
                            TestId: formId,
                            typeOfQuestions: "mixed",
                            questions: question
                        })
                    });

                    const questionsData = await questionsResponse.json();

                    if (questionsData.success) {
                        console.log("Form autosaved");
                    }
                }
            } catch (err) {
                console.log("UPDATE ERROR:", err);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [question, desc, formId, isFormLoaded]);

    const updateQuestion = (index, key, value) => {
        setQuestion(
            question.map((q, i) =>
                i === index ? { ...q, [key]: value } : q
            )
        );
    };

    const updateAnswer = (questionIndex, answerIndex, value) => {
        setQuestion(
            question.map((q, i) =>
                i === questionIndex
                    ? {
                        ...q,
                        answers: q.answers.map((answer, j) =>
                            j === answerIndex ? value : answer
                        )
                    }
                    : q
            )
        );
    };

    const addAnswer = (questionIndex) => {
        setQuestion(
            question.map((q, i) =>
                i === questionIndex
                    ? {
                        ...q,
                        answers: [
                            ...q.answers,
                            `Option ${q.answers.length + 1}`
                        ]
                    }
                    : q
            )
        );
    };

    const deleteAnswer = (questionIndex, answerIndex) => {
        setQuestion(
            question.map((q, i) =>
                i === questionIndex
                    ? {
                        ...q,
                        answers: q.answers.filter(
                            (_, j) => j !== answerIndex
                        )
                    }
                    : q
            )
        );
    };

    const addQuestion = () => {
        setQuestion([
            ...question,
            {
                name: "Add a Question",
                type: "checkbox",
                options: ["checkbox", "radio", "text", "image"],
                answers: ["Option 1"],
                image: null,
                required: false
            }
        ]);
    };

    const toggleRequired = (index) => {
        setQuestion(
            question.map((q, i) =>
                i === index
                    ? { ...q, required: !q.required }
                    : q
            )
        );
    };

    const createFormFetch = async () => {
        try {
        console.log("Submit Form clicked");
        console.log("Form ID:", formId);

        if (!formId) {
            alert("Form ID is missing. Please create a form first.");
            return;
        }

        const formResponse = await fetch(`${url}/update-form/${formId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: desc.name,
                description: desc.nameDesc
            })
        });

        const formData = await formResponse.json();
        console.log("Update form response:", formData);

        if (!formData.success) {
            alert(formData.message);
            return;
        }

        const questionsResponse = await fetch(`${url}/create-questions`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                TestId: formId,
                typeOfQuestions: "mixed",
                questions: question
            })
        });

        const questionsData = await questionsResponse.json();
        console.log("Save questions response:", questionsData);

        if (questionsData.success) {
            alert("Form saved successfully");
        } else {
            alert(questionsData.message);
        }
    } catch (err) {
        console.log("Error saving form:", err);
        alert("Unable to save form");
    }
};

    const deleteQuestionFetch = async (questionId, index) => {
        if (!formId || !questionId) {
            setQuestion(question.filter((_, i) => i !== index));
            return;
        }

        try {
            const response = await fetch(
                `${url}/delete-question/${formId}/${questionId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await response.text();
            console.log(data);

            setQuestion(question.filter((_, i) => i !== index));
        } catch (err) {
            console.log("Error deleting question", err);
        }
    };

    const copyQuestionFetch = async (questionId) => {
        if (!formId || !questionId) {
            alert("Submit the form before copying saved questions.");
            return;
        }

        try {
            const response = await fetch(
                `${url}/copy-question/${formId}/${questionId}`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (data.success) {
                setQuestion(data.questions);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.log("Error in copying the question", err);
        }
    };

    const imageFetch = async (selectedFile, index) => {
        if (!selectedFile) {
            alert("Please select an image");
            return;
        }

        if (!desc.name.trim() || !desc.nameDesc.trim()) {
            alert("Please enter the form title and description");
            return;
        }

        const formData = new FormData();
        formData.append("title", desc.name);
        formData.append("description", desc.nameDesc);
        formData.append("image", selectedFile);

        try {
            const response = await fetch(`${url}/upload-images`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setQuestion(
                    question.map((q, i) =>
                        i === index
                            ? { ...q, image: data.image }
                            : q
                    )
                );
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.log("Error in uploading the image", err);
        }
    };

    const extractPdf = async (selectedFile) => {
        if (!selectedFile) return;

        try {
            const formData = new FormData();
            formData.append("document", selectedFile);

            const response = await fetch(`${url}/generate-form`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setDesc({
                    name: data.data.title,
                    nameDesc: data.data.description
                });

                const questions = data.data.questions.map((item) => ({
                    ...item,
                    options: ["checkbox", "radio", "text", "image"],
                    answers: item.answers || [],
                    required: item.required || false
                }));

                setQuestion(questions);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.log("Error extracting PDF", err);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
            <NavBar
                preview={preview}
                setPreview={setPreview}
                showProfile={showProfile}
                setShowProfile={setShowProfile}
            />

            {showProfile ? (
                <Profile />
            ) : preview ? (
                <div className="min-h-screen px-4 py-8">
                    <PreviewForm desc={desc} />
                </div>
            ) : (
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                                Form Builder
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Create and customize your form
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => pdfInputRef.current?.click()}
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-medium text-white shadow-md transition hover:scale-105"
                            >
                                Upload PDF
                            </button>

                            <button
                                type="button"
                                disabled={!formId}
                                onClick={() => {
                                    if (formId) {
                                       
                                        window.open(
                                            `${url}/download-form/${formId}`,
                                            "_blank"
                                        );
                                    }
                                }}
                                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 font-medium text-white shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Download Form
                            </button>
                        </div>
                    </div>

                    <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                            const selectedFile = e.target.files?.[0];

                            if (selectedFile) {
                                extractPdf(selectedFile);
                            }

                            e.target.value = "";
                        }}
                    />

                    <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
                        <div className="rounded-[22px] bg-white">
                            <div className="rounded-t-[22px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-6 py-8 text-white sm:px-10">
                                <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-white/80">
                                    Your workspace
                                </p>

                                <h2 className="text-3xl font-bold sm:text-4xl">
                                    Create Your Form
                                </h2>

                                <p className="mt-2 text-sm text-white/90 sm:text-base">
                                    Build a beautiful form in just a few steps.
                                </p>
                            </div>

                            <div className="p-4 sm:p-8">
                                <div className="mb-8 rounded-2xl border border-purple-200 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-5 sm:p-7">
                                    <div className="mb-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                                    <input
                                        type="text"
                                        className="w-full border-b-2 border-transparent bg-transparent py-3 text-2xl font-bold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-400 sm:text-3xl"
                                        value={desc.name}
                                        onChange={(e) =>
                                            setDesc({
                                                ...desc,
                                                name: e.target.value
                                            })
                                        }
                                        placeholder="Untitled Form"
                                    />

                                    <input
                                        type="text"
                                        className="mt-3 w-full border-b border-gray-300 bg-transparent py-3 text-gray-600 outline-none transition placeholder:text-gray-400 focus:border-purple-400"
                                        value={desc.nameDesc}
                                        onChange={(e) =>
                                            setDesc({
                                                ...desc,
                                                nameDesc: e.target.value
                                            })
                                        }
                                        placeholder="Add a description for your form"
                                    />
                                </div>

                                <div className="flex flex-col gap-5">
                                    {question.map((item, index) => (
                                        <div
                                            key={item._id || index}
                                            className="rounded-2xl border border-gray-200 border-l-4 border-l-purple-500 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6"
                                        >
                                            <div className="mb-5">
                                                <input
                                                    type="text"
                                                    className="w-full border-b border-gray-300 py-3 text-lg font-semibold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500"
                                                    value={item.name}
                                                    onChange={(e) =>
                                                        updateQuestion(
                                                            index,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Add a question"
                                                />
                                            </div>

                                            {(item.type === "checkbox" ||
                                                item.type === "radio") && (
                                                    <div className="mb-5 flex flex-col gap-4">
                                                        {(item.answers || []).map(
                                                            (answer, answerIndex) => (
                                                                <div
                                                                    key={answerIndex}
                                                                    className="flex items-center gap-3"
                                                                >
                                                                    <input
                                                                        type={item.type}
                                                                        name={`question-${index}`}
                                                                        disabled
                                                                        className="accent-purple-600"
                                                                    />

                                                                    <input
                                                                        type="text"
                                                                        value={answer}
                                                                        className="min-w-0 flex-1 border-b border-gray-200 py-2 outline-none transition focus:border-purple-500"
                                                                        onChange={(e) =>
                                                                            updateAnswer(
                                                                                index,
                                                                                answerIndex,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder={`Option ${answerIndex + 1}`}
                                                                    />

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            deleteAnswer(
                                                                                index,
                                                                                answerIndex
                                                                            )
                                                                        }
                                                                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                                                        aria-label="Delete option"
                                                                    >
                                                                        <RxCross1 />
                                                                    </button>
                                                                </div>
                                                            )
                                                        )}

                                                        <button
                                                            type="button"
                                                            className="w-fit rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                                                            onClick={() =>
                                                                addAnswer(index)
                                                            }
                                                        >
                                                            + Add other option
                                                        </button>
                                                    </div>
                                                )}

                                            {item.type === "text" && (
                                                <input
                                                    type="text"
                                                    disabled
                                                    placeholder="Short answer text"
                                                    className="mb-5 w-full border-b border-gray-300 py-3 text-gray-400 outline-none"
                                                />
                                            )}

                                            {item.type === "image" && (
                                                <div className="mb-5">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:font-medium file:text-purple-700"
                                                        onChange={(e) => {
                                                            const selectedFile =
                                                                e.target.files?.[0];

                                                            if (selectedFile) {
                                                                imageFetch(
                                                                    selectedFile,
                                                                    index
                                                                );
                                                            }

                                                            e.target.value = "";
                                                        }}
                                                    />

                                                    {item.image?.filepath && (
                                                        <img
                                                            src={`${url}/${item.image.filepath}`}
                                                            alt="Uploaded"
                                                            className="mt-4 max-h-72 w-auto rounded-xl border border-gray-200 object-contain"
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                                                <div className="flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2">
                                                    <FaCircleDot className="text-purple-600" />

                                                    <select
                                                        className="max-w-[150px] bg-transparent text-sm font-medium text-gray-700 outline-none"
                                                        value={item.type}
                                                        onChange={(e) =>
                                                            updateQuestion(
                                                                index,
                                                                "type",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        {(item.options || [
                                                            "checkbox",
                                                            "radio",
                                                            "text",
                                                            "image"
                                                        ]).map((option) => (
                                                            <option
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleRequired(index)
                                                        }
                                                        title={
                                                            item.required
                                                                ? "Required"
                                                                : "Optional"
                                                        }
                                                        className="transition hover:scale-110"
                                                    >
                                                        {item.required ? (
                                                            <FaToggleOn className="text-3xl text-purple-600" />
                                                        ) : (
                                                            <FaToggleOff className="text-3xl text-gray-400" />
                                                        )}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            copyQuestionFetch(
                                                                item._id
                                                            )
                                                        }
                                                        title="Copy question"
                                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <MdContentCopy className="text-xl" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteQuestionFetch(
                                                                item._id,
                                                                index
                                                            )
                                                        }
                                                        title="Delete question"
                                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <MdDelete className="text-xl" />
                                                    </button>
                                                </div>
                                            </div>

                                            {item.required && (
                                                <p className="mt-3 text-xs font-medium text-purple-600">
                                                    * This question is required
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex flex-wrap justify-center gap-4">
                                    <button
                                        type="button"
                                        className="rounded-xl border-2 border-purple-300 bg-white px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-50"
                                        onClick={addQuestion}
                                    >
                                        + Add Question
                                    </button>

                                    <button
                                        type="button"
                                        className="rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
                                        onClick={createFormFetch}
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
            )}
        </div>
    );
}