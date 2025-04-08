import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
// import { resetCart } from "../../slices/cartSlice"
// import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"
import { setUser } from "../../slices/profileSlice"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  GOOGLE_LOGIN_API,
  GOOGLE_SIGNUP_API
  
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => { 
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)

      }

      toast.success("OTP Sent Successfully")
      navigate("/verifyemail")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error(error.response.data.message)
      
     
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error(error.response.data.message)
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
        
      dispatch(setUser({ ...response.data.user, image: userImage }));

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Conditional navigation based on accountType
      if (response.data.user.accountType === "User") {
        navigate("/UserDas");
      } else if (response.data.user.accountType === "Developer") {
        navigate("/developerdas");
        
      }
      else if (response.data.user.accountType === "Admin") {
        navigate("/Admindas");
        
      }
       else {
        // Default fallback (optional)
        navigate("/");
      }

    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error(error?.response?.data?.message || "Login failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}


export const googleLogin = (credential, navigate) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Logging in...");

    try {
      const res = await apiConnector("POST", GOOGLE_LOGIN_API, { credential });

      if (!res.data.success) {
        throw new Error(res.data.message || "Google login failed");
        
      }
      

      const { token, user } = res.data;

      const userImage = user?.image
        ? user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`;

      dispatch(setToken(token));
      dispatch(setUser({ ...user, image: userImage }));

      // localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Google Login Successful");
      if (res.data.user.accountType === "User") {
        navigate("/UserDas");
      } else if (res.data.user.accountType === "Developer") {
        navigate("/developerdas");
        
      }
      else if (res.data.user.accountType === "Admin") {
        navigate("/Admindas");
        
      }
       else {
        // Default fallback (optional)
        navigate("/");
      }

    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response.data.message)
      
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

export const googleSignup = (credential, accountType, navigate) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Signing up...");

    try {
      const res = await apiConnector("POST", GOOGLE_SIGNUP_API, {
        credential,
        accountType,
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Google signup failed");
      }

      const { token, user } = res.data;

      const userImage = user?.image
        ? user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`;

      dispatch(setToken(token));
      dispatch(setUser({ ...user, image: userImage }));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Signup Successful");
      if (res.data.user.accountType === "User") {
        navigate("/UserDas");
      } else if (res.data.user.accountType === "Developer") {
        navigate("/developerdas");
        
      }
      else if (res.data.user.accountType === "Admin") {
        navigate("/Admindas");
        
      }
       else {
        // Default fallback (optional)
        navigate("/");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error(error?.response?.data?.message || "Google signup failed");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};


export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}



export function getPasswordResetToken(email , setEmailSent) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {email,})

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  }
}

export function resetPassword(password, confirmPassword, token) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});

      console.log("RESET Password RESPONSE ... ", response);


      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }
    dispatch(setLoading(false));
  }
}