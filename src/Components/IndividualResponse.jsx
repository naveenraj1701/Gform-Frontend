import React from "react"

export default function IndividualResponse({
    selectedResponse,
    questions,
    onClose
}) {
    if (!selectedResponse) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl shadow-xl p-6">

                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Individual Response
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-[#4285F4] font-medium hover:underline"
                    >
                        Close
                    </button>
                </div>

                <p className="text-sm text-gray-500 mb-5">
                    Submitted: {new Date(selectedResponse.submittedAt).toLocaleString()}
                </p>

                <div className="space-y-5">
                    {Object.entries(selectedResponse.answers).map(([questionId, answer]) => {
                        const question = questions.find(
                            (question) => question._id === questionId
                        )

                        return (
                            <div key={questionId} className="border-b pb-4">
                                <p className="font-medium text-gray-800 mb-2">
                                    {question?.name || "Question not found"}
                                </p>

                                <p className="text-gray-600 bg-[#F8FAFD] rounded-lg p-3">
                                    {Array.isArray(answer)
                                        ? answer.join(", ")
                                        : answer || "No answer"}
                                </p>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}