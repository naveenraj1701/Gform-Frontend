
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getFormResponses } from "../services/submitResponse"
import IndividualResponse from "../Components/IndividualResponse"

export default function FormResponsePage() {
    const { formId } = useParams()

    const [responses, setResponses] = useState([])
    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState([])
    const [selectedResponse, setSelectedResponse] = useState(null)

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const result = await getFormResponses(formId)

                if (result.success) {
                    setResponses(result.responses)
                    setQuestions(result.questions)
                }
            } catch (err) {
                console.log("Error fetching responses:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchResponses()
    }, [formId])

    //choice Analytics//

    const choiceAnalytics = questions
        .filter((question) => question.type === "radio" || question.type === "checkbox")
        .map((question) => {
            const counts = {}

            question.answers.forEach((option) => {
                counts[option] = 0
            })

            responses.forEach((response) => {
                const answer = response.answers[question._id]

                const selectedOptions = Array.isArray(answer)
                    ? answer
                    : answer
                        ? [answer]
                        : []

                selectedOptions.forEach((option) => {
                    if (counts[option] !== undefined) {
                        counts[option]++
                    }
                })
            })

            return {
                questionName: question.name,
                type: question.type,
                options: Object.entries(counts).map(([option, count]) => ({
                    option,
                    count
                }))
            }
        })

    return (
        <div className="min-h-screen bg-[#F0F4F9] px-4 py-8 sm:px-6">

            <div className="max-w-4xl mx-auto">

                <div className="bg-white border-t-[8px] border-[#4285F4] rounded-xl shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Form Responses
                    </h1>

                    <p className="text-gray-500 mt-2">
                        View all submitted responses for your form.
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t pt-4">
                        <span className="text-gray-600 font-medium">
                            Total Responses
                        </span>

                        <span className="bg-[#E8F0FE] text-[#4285F4] px-4 py-2 rounded-lg font-semibold">
                            {responses.length}
                        </span>
                    </div>

                    {choiceAnalytics.map((question, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        >
                            <h2 className="text-lg font-semibold text-gray-800">
                                {question.questionName}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1 mb-5">
                                {question.type === "radio" ? "Multiple choice" : "Checkboxes"}
                            </p>

                            <div className="space-y-4">
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-700">
                                                {option.option}
                                            </span>
                                            <span className="text-gray-600 font-medium">
                                                {option.count}
                                            </span>
                                        </div>

                                        <div className="w-full bg-gray-100 rounded-full h-3">
                                            <div
                                                className="bg-[#4285F4] h-3 rounded-full"
                                                style={{
                                                    width: `${responses.length
                                                        ? (option.count / responses.length) * 100
                                                        : 0
                                                        }%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                        <p className="text-gray-500">
                            Loading responses...
                        </p>
                    </div>
                ) : responses.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                        <div className="text-4xl mb-4 text-[#4285F4]">
                            <i className="fa-regular fa-clipboard"></i>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-700">
                            No responses yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Responses will appear here when someone submits your form.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {responses.map((item, index) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div className="bg-[#F8FAFD] px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <h2 className="font-semibold text-lg text-gray-800">
                                        Response {index + 1}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedResponse(item)}
                                        className="text-sm text-[#4285F4] font-medium hover:underline"
                                    >
                                        View Response
                                    </button>

                                    <span className="text-sm text-gray-500">
                                        {new Date(item.submittedAt).toLocaleString()}
                                    </span>
                                </div>

                                <div className="p-6 space-y-5">
                                    {Object.entries(item.answers).map(([questionId, answer]) => {
                                        const question = questions.find(
                                            (question) => question._id === questionId
                                        )

                                        return (
                                            <div
                                                key={questionId}
                                                className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                                            >
                                                <p className="font-medium text-gray-800 mb-2">
                                                    {question?.name || "Question not found"}
                                                </p>

                                                <div className="bg-[#F8FAFD] border border-gray-100 rounded-lg px-4 py-3">
                                                    <p className="text-gray-600 break-words">
                                                        {Array.isArray(answer)
                                                            ? answer.join(", ")
                                                            : answer || "No answer"}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            <IndividualResponse
    selectedResponse={selectedResponse}
    questions={questions}
    onClose={() => setSelectedResponse(null)}
/>
        </div>
    )
}
