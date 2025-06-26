import { useAppContext } from "context/AppContext";
import { forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";

const Logout = forwardRef((props, ref) => {
    const navigate = useNavigate();
    const { dispatch } = useAppContext();
    useImperativeHandle(ref, () => ({
        async logoutUser() {
            try {
                const logoutApi = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/signout`, {
                    method: 'POST'
                })
                const response = await logoutApi.text()
                console.log("Result: ", response)
                // Dispatch the 'LOGOUT' action to reset the state
                dispatch({ type: 'LOGOUT' });
                return null;
            } catch (error) {
                console.error(error);
            }
        },


    }))
    return null;
})

export default Logout;