import {auth, db, storage} from "../firebase";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {collection, doc, getDocs, limit, onSnapshot, orderBy, query, updateDoc, where} from "firebase/firestore";
import {updateProfile} from "firebase/auth";
import {ITweet} from "../components/timeline";
import Tweet from "../components/tweet";


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
    border: 3px solid white;
    border-radius: 20px;
    margin: 20px 0;
    width: 100%;
    max-width: 860px;
`

const AvatarUpload = styled.label`
    cursor: pointer;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 3px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #333;

    svg {
        width: 100px;
        fill: white;
    }
`

const AvatarInput = styled.input`
    display: none;
`

const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

const Name = styled.span`
    color: white;
    font-size: 20px;
    font-weight: 600;
`

const NameInput = styled.input`
    color: white;
    font-size: 20px;
    font-weight: 600;
    border: 0;
    background-color: transparent;
    text-align: center;
    width: 100%;
    max-width: 200px;
    cursor: pointer;
`

const Tweets = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 860px;
`

export default function Profile() {

    const user = auth.currentUser
    const [avatar, setAvatar] = useState(user?.photoURL ?? "")
    const [tweets, setTweets] = useState<ITweet[]>([])
    const [displayName, setDisplayName] = useState(user?.displayName ?? "")
    const [changeDisplayName, setChangeDisplayName] = useState(false)

    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return
        const files = e.target.files
        if (files && files.length === 1) {
            const file = files?.[0]
            const locationRef = ref(storage, `avatars/${user?.uid}`)
            const result = await uploadBytes(locationRef, file)
            const url = await getDownloadURL(result.ref)
            await updateProfile(user, {photoURL: url})
            setAvatar(url)
        }
    }

    const onDisplayNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return
        const {target: {value}} = e
        setDisplayName(value)
    }

    const onDisplayNameEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!user) return
        if (e.key === "Enter") {
            await updateProfile(user, {displayName})
            setChangeDisplayName(false)

            // update tweets where userId === user.uid

            const tweetsQuery = query(
                collection(db, "tweets"),
                where("userId", "==", user?.uid),
            )

            const snapshot = await getDocs(tweetsQuery)
            for (const doc of snapshot.docs) {
                await updateDoc(doc.ref, {username: displayName})
            }
        }
    }

    const fetchTweets = async () => {
        const tweetsQuery = query(
            collection(db, "tweets"),
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            limit(20)
        )
        // const snapshot = await getDocs(tweetsQuery)
        // const tweets: ITweet[] = snapshot.docs.map(doc => {
        //     return {
        //         ...doc.data(),
        //         id: doc.id
        //     } as ITweet
        // })

        onSnapshot(tweetsQuery, (snapshot) => {
            const tweets = snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                } as ITweet;
            });
            setTweets(tweets);
        })

        setTweets(tweets)
    }


    const onChangeDisplayName = () => {
        setChangeDisplayName(true)
    }

    useEffect(() => {
        fetchTweets()
    }, []);

    return <Wrapper>
        <AvatarUpload htmlFor="avatar">
            {
                avatar ?
                    <AvatarImage src={avatar} alt="avatar"/>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fill-rule="evenodd"
                              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                              clip-rule="evenodd"/>
                    </svg>
            }
        </AvatarUpload>
        <AvatarInput onChange={onAvatarChange} id='avatar' type="file" accept="image/*"/>

        {
            changeDisplayName ?
                <NameInput
                    value={displayName}
                    onChange={onDisplayNameChange}
                    onKeyDown={onDisplayNameEnter}
                    onBlur={() => setChangeDisplayName(false)}
                    autoFocus
                />
                :
                <Name onClick={onChangeDisplayName}>{displayName}</Name>
        }

        <Tweets>
            {
                tweets.map(tweet => {
                    return (
                        <Tweet
                            key={tweet.id}
                            id={tweet.id}
                            userId={tweet.userId}
                            photo={tweet.photo}
                            tweet={tweet.tweet}
                            username={tweet.username}
                            createdAt={tweet.createdAt}
                        />
                    )
                })
            }
        </Tweets>
    </Wrapper>
}