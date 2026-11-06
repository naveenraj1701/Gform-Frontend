const url = process.env.REACT_APP_URL

export const submitFormResponse = async (formId, answers) => {
    const body = {
    formId: formId,
    answers: answers
}

    const response = await fetch(`${url}/submit-form-response`, {
        
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)


    })
    return response.json()
}

export const getFormResponses = async (formId) => {
    const response = await fetch(`${url}/get-form-responses/${formId}`, {
        method: "GET",
        credentials: "include"
    })

    return response.json()
}

