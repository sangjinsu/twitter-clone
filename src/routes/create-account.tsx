import styled from "styled-components";
import React, {useState} from "react";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0;
`

const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  font-size: 16px;

  &[type="submit"] {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
`

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
`

const Title = styled.h1`
  font-size: 42px;
`

const Error = styled.span`
  font-weight: bold;
  color: red;
`

export default function CreateAccount() {
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

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {

        } catch (e) {

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Wrapper>
            <Title>Log into X</Title>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange}
                       name="name" value={name}
                       placeholder="Name"
                       type='text'
                       required/>
                <Input onChange={onChange}
                       name="email"
                       value={email}
                       placeholder="Email"
                       type="email"
                       required/>
                <Input onChange={onChange}
                       name="passowrd"
                       value={password}
                       placeholder="Password"
                       type="password"
                       required/>
                <Input type="submit"
                       value={isLoading ? "Loading..." : "Create Account"}/>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
        </Wrapper>
    )
}