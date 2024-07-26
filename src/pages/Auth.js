import React, { useState } from 'react';
import "./Auth.css"
import { toast } from 'react-toastify';
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
const initialState = {
    firstName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

function Auth() {
    const [state, setState] = useState(initialState);
    const [signUp, setSignUp] = useState(false);
    const [, setCookie] = useCookies(['JwtToken']);
    const navigate = useNavigate();
    const { email, password, username, confirmPassword, firstName, } = state;


    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (signUp) {
            if (password !== confirmPassword) {
                toast.error("Passwords do not match!");
                return
            } else if (username.length < 3 || username.length > 20) {
                return toast.info("username need min 6 letter max 20!")
            } else if (firstName.length < 3 || firstName.length > 20) {
                return toast.info("username need min 6 letter max 20!")
            }
            try {

                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
                    firstName,
                    username,
                    email,
                    password,
                })
                setSignUp(false)

                toast.success("Successfully registered!");
            } catch (error) {
                if (error.response.data.message) {
                    toast.error(error.response.data.message);
                }

                console.log(error);
            }


        } else {
            try {
                const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
                    username,
                    password,
                });
               
                window.localStorage.setItem("userID", result.data.User._id)
                window.localStorage.setItem("useremail", result.data.User.email)
                window.localStorage.setItem("username", result.data.User.username)
                setCookie("jwtToken", result.data.token);
                toast.success("Successfully signed in!");
                navigate("/")
            } catch (error) { 
                if (error.response.data.message) {
                    toast.error(error.response.data.message);
                }
                console.error(error);
            }
        }
    };

    return (
        <div className='container-fluid'>
            <div className='container'>
                <div className='pt-5 mb-4 text-center fs-18 fw-6'>
                    {!signUp ? "Sign-in" : "Sign-Up"}
                </div>
                <div className='register-form m-auto'>
                    <form className='m-auto' onSubmit={handleSubmit}>
                        {signUp && (
                            <div className='name-section row'>
                                <div className='py-3 col-sm-6'>
                                    <input
                                        type='text'
                                        className='form-control input-text-box'
                                        name='firstName'
                                        value={firstName}
                                        placeholder='First Name'
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='py-3 col-sm-6'>
                                    <input
                                        type='email'
                                        className='form-control input-text-box'
                                        name='email'
                                        value={email}
                                        placeholder='Email'
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <div className='common-area w-100'>
                            <div className='py-3 col-12'>
                                <input
                                    type='text'
                                    className='form-control input-text-box'
                                    name='username'
                                    value={username}
                                    placeholder='User Name'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='py-3 col-12'>
                                <input
                                    type='password'
                                    className='form-control input-text-box'
                                    name='password'
                                    value={password}
                                    placeholder='Password'
                                    onChange={handleChange}
                                />
                            </div>


                            {signUp && (
                                <div className='py-3 col-12'>
                                    <input
                                        type='password'
                                        className='form-control input-text-box'
                                        name='confirmPassword'
                                        value={confirmPassword}
                                        placeholder='Confirm Password'
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                            <div className='text-center col-12 py-3'>
                                <button type='submit' className={`btn ${!signUp ? "btn-sign-in" : "btn-sign-up"}`}>
                                    {!signUp ? "Sign-in" : "Sign-Up"}
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className='additional-info text-center py-3'>
                        <p>
                            {!signUp ? (
                                <>
                                    Don't have an account?&nbsp;&nbsp;
                                    <span onClick={() => setSignUp(true)}>Sign Up</span>
                                </>
                            ) : (
                                <>
                                    Already have an account?&nbsp;&nbsp;
                                    <span onClick={() => setSignUp(false)}>Sign In</span>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
