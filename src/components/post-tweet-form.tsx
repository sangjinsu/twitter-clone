import styled from "styled-components";
import {useState} from "react";


const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const TextArea = styled.textarea`
    resize: none;
    border: 3px solid black;
    font-size: 20px;
    padding: 20px;
    border-radius: 20px;
    background-color: #333;
    color: white;
    &::placeholder {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: #888;
    }
    &:focus {
        outline: none;
        border-color:  #1da1f2;
    }
`

const AttachFileButton = styled.label`
    cursor: pointer;
    background-color: #1da1f2;
    color: white;
    border: 0;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    svg {
        width: 20px;
        fill: white;
        margin-right: 10px;
    }
`

const AttachFileInput = styled.input`
    display: none;
`

const SubmitButton = styled.input`
    background-color: #1da1f2;
    color: white;
    border: 0;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 50px;
    width: fit-content;
    align-self: flex-end;
    cursor: pointer;
`

export default function PostTweetForm() {

    const [isLoading, setLoading] = useState(false)
    const [tweet, setTweet] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {target: {value}} = event
        setTweet(value)
    }

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {files}} = event
        if (files && files.length === 1) {
            const theFile = files[0]
            setFile(theFile)
        }
    }

    const onSubmit = async (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault()
        setLoading(true)
    }

    return <Form>
        <TextArea onChange={onChange} value={tweet} placeholder="What is happening?"/>
        <AttachFileButton htmlFor="file">{file ? "Photo added ✅" : "Add Photo"}</AttachFileButton>
        <AttachFileInput onChange={onFileChange} type='file' id='file' accept='image/*'/>
        <SubmitButton onSubmit={onSubmit} type='submit' value={isLoading ? "Posting..." : "Post Tweet"}/>
    </Form>
}