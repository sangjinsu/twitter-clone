import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FirebaseError} from "firebase/app";
import {auth} from "../firebase";
import {signInWithEmailAndPassword} from "firebase/auth";
import {Input, Switcher, Title, Wrapper, Error, Form} from "../components/auth-components";
import GithubButton from "../components/GithubButton";


export default function Login() {

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {name, value}} = e
        switch (name) {
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
        if (isLoading || email === '' || password === '') return

        try {
            setIsLoading(true)
            await signInWithEmailAndPassword(auth, email, password)
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
            <Title>Login to X</Title>
            <Form onSubmit={onSubmit}>
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
                       value={isLoading ? "Loading..." : "Log in"}/>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Don't hava an account? <Link to="/create-account">Create one &rarr;</Link>
            </Switcher>
            <GithubButton/>
        </Wrapper>
    )
}