import styled from "styled-components";
import firebase from "firebase/compat";
import GithubAuthProvider = firebase.auth.GithubAuthProvider;
import {auth} from "../firebase";
import {signInWithPopup} from "firebase/auth";
import {useNavigate} from "react-router-dom";


const Button = styled.span`
    background-color: white;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    margin-top: 50px;
`;

const Logo = styled.img`
    height: 25px;
    margin-right: 15px;
`;


export default function GithubButton() {
    const navigate = useNavigate();
    const onClick = async () => {
        const provider = new GithubAuthProvider();

        try {
            await signInWithPopup(auth, provider)
            navigate("/")
        } catch (error) {
            console.error(error)
        }

    }


    return <Button onClick={onClick}>
        <Logo src="/github-mark.svg"/>
        Continue with Github
    </Button>
}