import {auth} from "../firebase";
import {Navigate} from "react-router-dom";

export default function ProtectedRoute({
                                           children
                                       }: {
    children: React.ReactElement
}) {

    const user = auth.currentUser

    if (user === null) {
        return <Navigate to='/login'/>
    }

    return children
}