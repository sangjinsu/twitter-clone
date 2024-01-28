import {ITweet} from "./timeline";
import styled from "styled-components";
import {auth, db, storage} from "../firebase";
import {deleteDoc, doc} from "firebase/firestore";
import {deleteObject, ref} from "firebase/storage";

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


export default function Tweet({username, tweet, photo, userId, id}: ITweet) {
    const user = auth.currentUser
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
    return (
        <Wrapper>
            <Column>
                <UserName>{username}</UserName>
                <Payload>{tweet}</Payload>
                {user?.uid === userId ?
                    <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null
                }
            </Column>
            {photo ? (
                <Column>
                    <Photo src={photo}/>
                </Column>
            ) : null}
        </Wrapper>

    )
}