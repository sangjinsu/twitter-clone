import styled from "styled-components";
import {useState} from "react";
import {auth, db, storage} from "../firebase";
import {addDoc, collection, updateDoc } from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes } from "firebase/storage";


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
        border-color: #1da1f2;
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

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isLoading || tweet === "" || tweet.length > 180) {
            return
        }

        const user = auth.currentUser

        try {
            setLoading(true)
            const doc = await addDoc(collection(db, "tweets"), {
                tweet,
                createdAt: Date.now(),
                username: user?.displayName || "Anonymous",
                userId: user?.uid,
            })
            setTweet("")

            if (file) {
                const locationRef = ref(storage, `tweets/${user?.uid}-${user?.displayName}/${doc.id}`)
                const result = await uploadBytes(locationRef, file)
                const downloadURL = await getDownloadURL(result.ref);

                await updateDoc(doc, {
                    photo: downloadURL
                })

                setFile(null)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }


    }

    return <Form onSubmit={onSubmit}>
        <TextArea rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happening?"/>
        <AttachFileButton htmlFor="file">{file ? "Photo added ✅" : "Add Photo"}</AttachFileButton>
        <AttachFileInput onChange={onFileChange} type='file' id='file' accept='image/*'/>
        <SubmitButton type='submit' value={isLoading ? "Posting..." : "Post Tweet"}/>
    </Form>
}