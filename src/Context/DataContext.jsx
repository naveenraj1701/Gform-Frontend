import React, { createContext, useEffect, useState } from "react";

export const Datacon = createContext();

export default function DataContext({ children }) {
    const [question, setQuestion] = useState(() => {
        const savedQuestions = localStorage.getItem("questions")

        return savedQuestions ? JSON.parse(savedQuestions) : [
        {
            name: "Add a Question",
            type: "checkbox",
            options: ["checkbox", "radio", "text", "image"],
            answers: ["Option 1"],
            required: false
        }
    ]
    });


    const [register, setRegister] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        cpassword: ""
    })
    

    const [login, setLogin] = useState({
        email: "",
        password: ""
    })

    useEffect(() => {
        localStorage.setItem("questions", JSON.stringify(question))
    }, [question])

    console.log(question);
    



    return (
        <Datacon.Provider value={{ question, setQuestion, login, setLogin, register, setRegister }}>
            {children}
        </Datacon.Provider>
    );
}