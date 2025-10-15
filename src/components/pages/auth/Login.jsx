import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import { useNavigate } from "react-router";
import bg from "../../../assets/image/background-image.png";
import vector from "../../../assets/logo/login-vector.svg";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PasswordRoundedIcon from "@mui/icons-material/PasswordRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import "../../style/login.css";
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import Toaster from "../../modal/Toaster";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = React.useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [loginResponse, setLoginResponse] = useState(null);

  useEffect(() => {
    if (loginResponse) {
      console.log("loginResponse:", loginResponse);
      setShowInfoModal(true);
      const closeTimer = setTimeout(() => {
        setShowInfoModal(false);
      }, 3000); // 0.8s appear + 2.2s stay
      // If not successful, just return the cleanup for the close timer
      return () => clearTimeout(closeTimer);
    }
  }, [loginResponse, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnLogin = async () => {
    if (!userInfo.email || !userInfo.password) {
      return;
    }
    try {
      setLoading(true);
      const result = await login(userInfo);
      setLoginResponse(result); // This will trigger the useEffect
      setLoading(false);
    } catch (err) {
      //console.error(err);
      setLoading(false);
    }
  };

  return (
    <div
      className="w-screen h-screen p-3 md:p-5 flex flex-col items-center justify-between"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {loginResponse && (
        <Toaster
          show={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          message={loginResponse.success ? `Welcome back, ${loginResponse.userName}!` : loginResponse.message}
          success={loginResponse.success} />
      )}
      <p
        className="w-full flex text-base md:text-lg cursor-pointer">
        A<span className="text-[#DFB916]">ii</span>nhome
        <span className="px-1">|</span>
        <span className="font-bold">CB</span>
      </p>

      {/* Main Login Box */}
      <div
        className="
          bg-[#FAFAFAB2] 
          px-4 md:px-5 
          py-8 md:py-10 
          rounded-3xl md:rounded-4xl 
          border-4 md:border-8 
          border-[#7E848945] 
          shadow-xl shadow-[#00000040] 
          backdrop-blur-lg 
          w-full sm:w-4/5 md:w-3/4 lg:w-1/2 
          flex flex-col md:flex-row 
          items-center justify-between 
          divide-y md:divide-y-0 md:divide-x divide-[#7E848945]
        "
      >
        {/* Left Side */}
        <div className="w-full md:w-1/2 h-full flex flex-col mb-6 md:mb-0">
          <div className="flex flex-col w-full h-auto pl-4 md:pl-6 pt-4 md:pt-6">
            <p className="w-full flex text-lg md:text-xl text-[#2C2E42]">
              A<span className="text-[#DFB916]">ii</span>nhome
              <span className="px-1">|</span>
              <span className="font-bold">CB</span>
            </p>
            <p className="text-xs text-[#2C2E42]">Communication Buddy V2.5</p>
          </div>
          <div className="w-full flex items-center justify-center px-6 pt-5">
            <img
              src={vector}
              alt="Login vector"
              className="w-1/2 sm:w-2/3 md:w-4/5 h-auto"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-between pl-0 md:pl-10 pr-0 md:pr-5 py-8 md:py-16">
          <p className="w-full text-[#2C2E42] text-center text-2xl md:text-3xl font-bold">
            Welcome
          </p>

          {/* Inputs */}
          <div className="input-fields flex flex-col gap-3 w-full mt-4">
            <div
              className={`input-wrapper group w-full py-2 px-3 border rounded-lg flex items-center gap-3 transition-all duration-200 hover:border-[#3D5B81] ${userInfo.email
                ? "border-[#3D5B81]"
                : "border-[#BCC7D2]"
                }`}
            >
              <PersonRoundedIcon
                className="text-[#BCC7D2] group-hover:text-[#3D5B81]"
                sx={{ color: userInfo.email ? "#3D5B81" : "" }}
              />
              <input
                className="input-field w-full focus:outline-none bg-transparent text-sm md:text-base"
                type="email"
                id="username"
                name="email"
                value={userInfo.email}
                onChange={(e) => handleOnChange(e)}
                placeholder="Email"
              />
            </div>

            <div
              className={`input-wrapper group w-full py-2 px-3 border rounded-lg flex items-center gap-3 transition-all duration-200 hover:border-[#3D5B81] ${userInfo.password
                ? "border-[#3D5B81]"
                : "border-[#BCC7D2]"
                }`}
            >
              <PasswordRoundedIcon
                className="text-[#BCC7D2] group-hover:text-[#3D5B81]"
                sx={{ color: userInfo.password ? "#3D5B81" : "" }}
              />
              <input
                className="input-field w-full focus:outline-none bg-transparent text-sm md:text-base hide-password-icon"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={userInfo.password}
                onChange={(e) => handleOnChange(e)}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <VisibilityOffRoundedIcon
                    className="text-[#BCC7D2] group-hover:text-[#3D5B81]"
                    sx={{ color: userInfo.password ? "#3D5B81" : "" }}
                  />
                ) : (
                  <VisibilityRoundedIcon
                    className="text-[#BCC7D2] group-hover:text-[#3D5B81]"
                    sx={{ color: userInfo.password ? "#3D5B81" : "" }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            className="
              w-full 
              text-[#D9D9D9] 
              bg-[#182938] 
              rounded-lg 
              border border-[#182938] 
              py-2 mt-5 
              cursor-pointer 
              text-sm md:text-base
              disabled:bg-[#182938C2] disabled:text-[#D9D9D9] disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:text-[#D9D9D9] hover:bg-[#182938] hover:border-[#182938]"
            onClick={() => handleOnLogin()}
            type="button"
            id="login-button"
            disabled={loading || !userInfo.email || !userInfo.password}
          >
            {loading ? (
              <>
                Logging in...
                <AutorenewRoundedIcon className="animate-spin text-[#D9D9D9]" />
              </>
            ) : "Login"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[#2C2E42] text-xs md:text-sm py-2 text-center">
        @2020 Aiinhome Technologies Pvt. Ltd. All rights reserved
      </p>
    </div>
  );
}

export default Login;
