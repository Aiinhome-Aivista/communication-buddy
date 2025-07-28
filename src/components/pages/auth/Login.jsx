import React from "react";
import { staticImages, staticIcons } from "../../../utils/Constant";
import { useAuth } from "../../../provider/AuthProvider";
import { useNavigate } from "react-router";

export default function Login() {
  const { login } = useAuth();
  
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = React.useState({
    email: "",
    password: "",
  });


  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnLogin = async () => {
    // check if email and password are not empty
    if (!userInfo.email || !userInfo.password) {
      return;
    }
    // call login function from AuthProvider
    const result = await login(userInfo);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div
        className="relative flex justify-center items-start h-[100vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${staticImages.loginBackground}),linear-gradient(117.21deg, #141414 80.75%, #484848 149.51%)`,
        }}
      >
        <div className="relative flex flex-col items-center text-white h-full w-full max-w-md bg-transparent pt-24 px-6">
          <div className="w-full flex flex-col items-center justify-start gap-4">
            {/* login & welcome */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-gray-200  rounded-full overflow-hidden w-16 h-16 outline outline-offset-2 outline-purple-600">
                <img
                  src={staticImages.femaleAvater}
                  alt="logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-center text-2xl font-semibold">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Eva
                </span>{" "}
                Assistant
              </h3>
            </div>

            {/* Subtitle  */}
            <p className="text-center text-lg font-light">
              Login to your account
            </p>

            {/* <!-- Form --> */}
            <div className="w-full">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="username"
                  name="email"
                  value={userInfo.email}
                  placeholder=" enter your email"
                  className="w-full bg-[#131313] text-white border border-[#424b57] px-4 py-2 rounded focus:outline-none focus:border-[#8b04f5]"
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userInfo.password}
                  placeholder="Enter password"
                  className="w-full bg-[#131313] text-white border border-[#424b57] px-4 py-2 rounded focus:outline-none focus:border-[#8b04f5]"
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
              <button
                onClick={() => handleOnLogin()}
                type="button"
                className="w-full flex justify-center items-center gap-2 bg-[#8b04f5] text-white py-2 rounded font-medium hover:bg-[#7a03d8] transition"
                id="login-button"
              >
                Login
                <img src={staticIcons.loginArrow} alt="" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
