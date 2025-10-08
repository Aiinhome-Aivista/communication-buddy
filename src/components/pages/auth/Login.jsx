import React, { useRef, useState } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import { useNavigate } from "react-router";
import bg from '../../../assets/image/background-image.png'
import vector from '../../../assets/logo/login-vector.svg'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
function Login() {
    /*   const(new Date().getFullYear()) */
    const { login } = useAuth();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = React.useState({
        email: "",
        password: "",
    });
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleOnLogin = async () => {
        // Check if email and password are provided
        if (!userInfo.email || !userInfo.password) {
            return;
        }

        try {
            setLoading(true);
            const result = await login(userInfo);

            if (result?.success) {
                setLoading(false);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1200);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className='w-screen h-screen p-5 flex flex-col items-center justify-between'
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}>
            <p className='w-[100%] flex text-lg'>Ai<span className='text-[#DFB916]'>in</span>home<span className='px-1'>|</span><span className='font-bold'>CB</span></p>
            <div className='bg-[#FAFAFAB2] px-5 py-10 rounded-4xl border-8 border-[#7E848945] shadow-xl shadow-[#00000040] backdrop-blur-lg w-1/2 h-4/6 flex items-center justify-between divide-x-1 divide-[#7E848945]'>
                <div className='w-full h-full flex flex-col'>
                    <div className='flex flex-col w-full h-2/7 pl-6 pt-6'>
                        <p className='w-[100%] flex text-xl text-[#2C2E42]'>Ai<span className='text-[#DFB916]'>in</span>home<span className='px-1'>|</span><span className='font-bold'>CB</span></p>
                        <p className='text-xs text-[#2C2E42]'>Communication-Buddy V5</p>
                    </div>
                    <div className='w-full h-5/7 px-10 pt-5 flex items-center justify-center'>
                        <img src={vector} alt="Login vector" />
                    </div>
                </div>
                <div className='w-full h-full flex flex-col items-center justify-between pl-14 pr-5 py-16'>
                    <p className='w-full text-center text-3xl font-bold'>Welcome</p>
                    <div className='input-fields flex flex-col gap-2 w-full'>
                        <div className="input-wrapper w-full py-2 px-2 border-1 border-[#BCC7D2] rounded-lg flex items-betweeen gap-3">
                            <PersonRoundedIcon sx={{ color: '#BCC7D2' }} />
                            <input className='w-[90%] focus:outline-none'
                                type="email"
                                id="username"
                                name="email"
                                value={userInfo.email}
                                onChange={(e) => handleOnChange(e)}
                                placeholder='Email'
                                style={{ color: '#6c757d' }} />
                        </div>
                        <div className="input-wrapper w-full py-2 px-2 border-1 border-[#BCC7D2] rounded-lg flex items-betweeen gap-3">
                            <PasswordRoundedIcon sx={{ color: '#BCC7D2' }} />
                            <input className='w-[80%] focus:outline-none'
                                type="password"
                                id="password"
                                name="password"
                                value={userInfo.password}
                                onChange={(e) => handleOnChange(e)}
                                placeholder='Password'
                                style={{ color: '#6c757d' }} />
                            <VisibilityRoundedIcon sx={{ color: '#BCC7D2' }} />
                        </div>
                    </div>
                    <button className='w-full text-[#7E8489] bg-[#182938] rounded-lg border-1 border-[#182938] py-2 cursor-pointer disabled:opacity-90 disabled:cursor-not-allowed'
                        onClick={() => handleOnLogin()}
                        type="button"
                        id="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </div>
            <p className='text-[#2C2E42] text-sm py-1'>@2020 Aiinhome Technologies Pvt. Ltd. All rights reserved</p>
        </div>
    )
}

export default Login