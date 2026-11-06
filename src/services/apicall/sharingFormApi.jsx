const url = process.env.REACT_APP_URL

export const getSharingForm = async (formId) => {

    const response = await fetch(`${url}/get-public-form/${formId}`, {
        method: "GET"
    })
    return response.json()
}