import React from "react";
import * as Components from "./Components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const SinginSinup = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const Login = async (e)=>{
        
   e.preventDefault();
   if (!email || !password) {
    alert("Please fill in both fields");
    return;
   }


   try {
   
    const response = await fetch("http://localhost:5004/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    const data = await response.json();

    if (response.ok) {
     // Show the toast
     toast.success("Login successful", {
        duration: 1000, // Display toast for 3 seconds
    });

    // Delay navigation until the toast disappears
    setTimeout(() => {
        // Handle successful login
        const token = data.token;
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("username", data.username);
        console.log("Login successful:", data);

        navigate("/overview");
    }, 3000);
       
    } else {
        // Handle API error
        toast.error("Login failed. Please check the credential")
        console.error("Login failed:", data);
       
    }
  
} catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred. Please try again.");
}
};

    
    

    const [signIn, toggle] = React.useState(true);

    return(
        <div>
            <Components.H1>Welcome To Iva</Components.H1>

        <Components.Container>
            <Components.SignUpContainer signinIn={signIn}>
                <Components.Form>
                    <Components.Title>Create Account</Components.Title>
                    <Components.Input type='text' placeholder='Name'  />
                    <Components.Input type='email' placeholder='Email' />
                    <Components.Input type='password' placeholder='Password' />
                    <Components.Button >Sign Up</Components.Button>
                </Components.Form>
            </Components.SignUpContainer>

            <Components.SignInContainer signinIn={signIn}>
                 <Components.Form>
                     <Components.Title>Sign in</Components.Title>
                     <Components.Input type='email' placeholder='Email'onChange={(e)=>setEmail(e.target.value)} />
                     <Components.Input type='password' placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
                     <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                     <Components.Button onClick={(e)=>Login(e)}>Sigin In</Components.Button>
                 </Components.Form>
            </Components.SignInContainer>

            <Components.OverlayContainer signinIn={signIn}>
                <Components.Overlay signinIn={signIn}>

                <Components.LeftOverlayPanel signinIn={signIn}>
                    <Components.Title>Welcome Back!</Components.Title>
                    <Components.Paragraph>
                        To keep connected with us please login with your personal info
                    </Components.Paragraph>
                    <Components.GhostButton onClick={() => toggle(true)}>
                        Sign In
                    </Components.GhostButton>
                    </Components.LeftOverlayPanel>

                    <Components.RightOverlayPanel signinIn={signIn}>
                      <Components.Title>Hello, Friend!</Components.Title>
                      <Components.Paragraph>
                          Enter Your personal details and start journey with us
                      </Components.Paragraph>
                          <Components.GhostButton onClick={() => toggle(false)}>
                              Sigin Up
                          </Components.GhostButton> 
                    </Components.RightOverlayPanel>

                </Components.Overlay>
            </Components.OverlayContainer>

        </Components.Container>
        </div>
    )
}

export default SinginSinup
