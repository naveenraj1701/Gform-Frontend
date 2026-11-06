import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getSharingForm } from "../services/apicall/sharingFormApi"
import { submitFormResponse } from "../services/submitResponse"

function AnswerForm() {
    const { formId } = useParams()

    const [form, setForm] = useState(null)
    const [questions, setQuestion] = useState([])
    const [loading, setLoading] = useState(true)
    const [answers, setAnswers] = useState({})

    useEffect(() => {


        const fetchForm = async () => {
            try {
                const result = await getSharingForm(formId)

                if (result.success) {
                    setForm(result.form)
                    setQuestion(result.questions.questions)
                }
            } catch (err) {
                console.log("Error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchForm()

    }, [formId])

    const handleSubmitFormResponse = async () => {
        try {
            const result = await submitFormResponse(formId, answers)

            if (result.success) {
                alert(result.message)
            }
            else {
                alert(result.message)
            }
        } catch (err) {
            console.log("Error submitting response:", err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            {loading ? (
                <p className="text-center text-gray-600">Loading form...</p>
            ) : !form ? (
                <p className="text-center text-red-500">Form not found</p>
            ) : (
                <div className="max-w-2xl mx-auto space-y-5">
                    <div className="bg-white border-t-8 border-blue-500 rounded-xl p-6 shadow">
                        <h1 className="text-2xl font-semibold">
                            {form.title}
                        </h1>
                    </div>

                    {questions.map((item, index) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl p-6 shadow"
                        >
                            <h2 className="font-medium text-lg">
                                {item.name}
                                {item.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </h2>
                            {item.type === "text" && (
                                <input
                                    type="text"
                                    placeholder="Your answer"
                                    onChange={(e) =>
                                        setAnswers({
                                            ...answers,
                                            [item._id]: e.target.value
                                        })
                                    }
                                    className="w-full mt-4 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                />
                            )}
                            {item.type === "radio" && (
                                <div className="mt-4 space-y-3">
                                    {item.answers.map((option, index) => (
                                        <label key={index} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name={`question-${item._id}`}
                                                value={option}
                                                onChange={(e) =>
                                                    setAnswers({
                                                        ...answers,
                                                        [item._id]: e.target.value
                                                    })
                                                }
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {item.type === "checkbox" && (
                                <div className="mt-4 space-y-3">
                                    {item.answers.map((option, index) => (
                                        <label key={index} className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                value={option}
                                                checked={(answers[item._id] || []).includes(option)}
                                                onChange={(e) => {
                                                    const currentAnswers = answers[item._id] || []

                                                    const updatedAnswers = e.target.checked
                                                        ? [...currentAnswers, option]
                                                        : currentAnswers.filter((answer) => answer !== option)

                                                    setAnswers({
                                                        ...answers,
                                                        [item._id]: updatedAnswers
                                                    })
                                                }}
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                      onClick={handleSubmitFormResponse}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    )
}

export default AnswerForm