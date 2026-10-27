const url = process.env.REACT_APP_URL

export const sendOtp = async (data) => {
    const response = await fetch(`${url}/send-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

export const verifyOtp = async (data) => {
    const response = await fetch(`${url}/verify-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    return response.json()
}