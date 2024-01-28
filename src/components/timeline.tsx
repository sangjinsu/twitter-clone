import styled from "styled-components";
import {useEffect, useState} from "react";
import {collection, getDocs, limit, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "../firebase";
import Tweet from "./tweet";
import firebase from "firebase/compat";
import Unsubscribe = firebase.Unsubscribe;


export interface ITweet {
    id: string
    photo: string
    tweet: string
    username: string
    createdAt: number
    userId: string
}

const Wrapper = styled.div`
    height: 100vh;
`

export default function Timeline() {

    const [tweets, setTweets] = useState<ITweet[]>([])


    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null
        const fetchTweets = async () => {
            const tweetsQuery =
                query(
                    collection(db, "tweets"),
                    orderBy("createdAt", "desc"),
                    limit(20)
                )
            // const snapshot = await getDocs(tweetsQuery)
            // const tweets = snapshot.docs.map(doc => {
            //     return {
            //         ...doc.data(),
            //         id: doc.id
            //     } as ITweet
            // })

            unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
                const tweets = snapshot.docs.map(doc => {
                    return {
                        ...doc.data(),
                        id: doc.id
                    } as ITweet;
                });
                setTweets(tweets);
            })
        }
        fetchTweets()
        return () => {
            unsubscribe && unsubscribe()
        }
    }, [])


    return <Wrapper>
        {
            tweets.map(tweet => {
                return (
                    <Tweet
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
    </Wrapper>
}