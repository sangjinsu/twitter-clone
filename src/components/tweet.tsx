import {ITweet} from "./timeline";
import styled from "styled-components";
import {auth, db, storage} from "../firebase";
import {deleteDoc, doc, updateDoc} from "firebase/firestore";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import ReactModal, {Props} from "react-modal";
import {useState} from "react";

const Wrapper = styled.div`
    background-color: black;
    border: 3px solid white;
    padding: 20px;
    border-radius: 20px;
    display: flex;
    gap: 20px;
    margin: 20px 0;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`

const UserName = styled.span`
    color: white;
    font-size: 20px;
    font-weight: 600;
`

const Photo = styled.img`
    width: 100%;
    border-radius: 20px;
`

const Payload = styled.p`
    color: white;
    font-size: 20px;
    font-weight: 400;
    word-wrap: break-word;
`

const DeleteButton = styled.button`
    background-color: tomato;
    color: white;
    border: 0;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 50px;
    width: fit-content;
    align-self: flex-end;
    cursor: pointer;
`

const EditButton = styled.button`
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

const customModalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
        backgroundColor: 'black',
        border: '3px solid white',
        borderRadius: '20px',
        padding: '20px',
        color: 'white',
        width: '500px',
        height: '500px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    }
}

const ModalTextArea = styled.textarea`
    resize: none;
    border: 3px solid black;
    font-size: 20px;
    padding: 20px;
    border-radius: 20px;
    background-color: #333;
    color: white;
`

const ModalInput = styled.input`
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

const ModalSubmitButton = styled.button`
    background-color: #1da1f2;
    color: white;
    border: 0;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 50px;
    width: fit-content;
    align-self: flex-end;
`

const ModalCloseButton = styled.button`
    background-color: tomato;
    color: white;
    border: 0;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 50px;
    width: fit-content;
    align-self: flex-end;
    cursor: pointer;
`

const ModalForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`


export default function Tweet({username, tweet, photo, userId, id}: ITweet) {
    const user = auth.currentUser
    const [isOpen, setIsOpen] = useState(false)
    const onDelete = async () => {

        const ok = confirm("Are you want to delete this tweet?")
        if (!ok) {
            return
        }

        if (!ok || user?.uid !== userId) {
            return
        }

        try {
            await deleteDoc(doc(db, "tweets", id))
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`)
                await deleteObject(photoRef)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const onEdit = async () => {
        const ok = confirm("Are you want to edit this tweet?")
        if (!ok) {
            return
        }

        if (!ok || user?.uid !== userId) {
            return
        }

        setIsOpen(true)
    }


    const EditPopUp = (data: {beforeTweet: string}) => {
        // Edit tweet and photo when close
        const [tweet, setTweet] = useState(data.beforeTweet)
        const [file, setFile] = useState<File | null>(null)

        const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const {target: {value}} = event
            setTweet(value)
        }

        const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const {target: {files}} = event
            if (files && files.length > 1) {
                alert("Please upload only one file")
                return
            }

            if (files && !files[0].type.includes("image")) {
                alert("Please upload an image file")
                return
            }

            if (files && files[0].size > 1024 ** 3) {
                alert("Please upload a smaller image file")
                return
            }

            if (files) {
                const theFile = files[0]
                setFile(theFile)
            }
        }

        const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            if (tweet === "" || tweet.length > 180) {
                return
            }

            const user = auth.currentUser

            try {
                const docRef = doc(db, "tweets", id)
                await updateDoc(docRef, {
                    tweet,
                })
                setTweet("")

                if (file) {
                    const locationRef = ref(storage, `tweets/${user?.uid}/${docRef.id}`)
                    const result = await uploadBytes(locationRef, file)
                    const downloadURL = await getDownloadURL(result.ref);

                    await updateDoc(docRef, {
                        photo: downloadURL
                    })

                    setFile(null)
                }
                setIsOpen(false)
            } catch (error) {
                console.error(error)
            }
        }

        const onClose = () => {
            setIsOpen(false)
        }

        return (
            <ReactModal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                style={customModalStyles}
            >
                <ModalForm onSubmit={onSubmit}>
                    <ModalTextArea
                        onChange={onChange}
                        value={tweet}
                        placeholder="What's on your mind?"
                        maxLength={180}
                    />
                    <ModalInput
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                    />
                    <ModalSubmitButton type="submit">Edit</ModalSubmitButton>
                </ModalForm>
                <ModalCloseButton onClick={onClose}>Close</ModalCloseButton>
            </ReactModal>
        )
    }


    return (
        <Wrapper>
            <Column>
                <UserName>{username}</UserName>
                <Payload>{tweet}</Payload>
                {user?.uid === userId ?
                    <EditButton onClick={onEdit}>Edit</EditButton> : null
                }
                {user?.uid === userId ?
                    <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null
                }
            </Column>
            {photo ? (
                <Column>
                    <Photo src={photo}/>
                </Column>
            ) : null}
            <EditPopUp beforeTweet={tweet}/>
        </Wrapper>

    )
}