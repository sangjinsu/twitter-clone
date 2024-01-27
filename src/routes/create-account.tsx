import React, {useState} from "react";
import {auth} from "../firebase";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import {FirebaseError} from "firebase/app";
import {Input, Switcher, Title, Wrapper, Error, Form} from "../components/auth-components";
import GithubButton from "../components/GithubButton";

export default function CreateAccount() {

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {name, value}} = e
        switch (name) {
            case 'name':
                setName(value)
                break
            case 'email':
                setEmail(value)
                break
            case 'password':
                setPassword(value)
                break
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError("")
        if (isLoading || name === '' || email === '' || password === '') return

        try {
            setIsLoading(true)
            const credentials = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(
                credentials.user,
                {
                    displayName: name
                }
            )

            navigate("/")
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Wrapper>
            <Title>Join X</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    onChange={onChange}
                    name="name"
                    value={name}
                    placeholder="Name"
                    type="text"
                    required
                />
                <Input
                    onChange={onChange}
                    name="email"
                    value={email}
                    placeholder="Email"
                    type="email"
                    required
                />
                <Input
                    onChange={onChange}
                    value={password}
                    name="password"
                    placeholder="Password"
                    type="password"
                    required
                />
                <Input type="submit"
                       value={isLoading ? "Loading..." : "Create Account"}/>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Aleady hava an account? <Link to="/login">Log in &rarr;</Link>
            </Switcher>
            <GithubButton/>
        </Wrapper>
    )
}