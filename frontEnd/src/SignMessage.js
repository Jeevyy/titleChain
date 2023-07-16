import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './App.css';
import ErrorMessage from "./ErrorMessage";

const signMessage = async ({ setError, message }) => {

  try {

    const ethers = require("ethers");
    console.log({ message });
    if (!window.ethereum){
      throw new Error("No crypto wallet found. Please install it.");
    }

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return {
      message,
      signature,
      address,
    };
  } catch (err) {
    setError(err.message);
  }
};

export default function SignMessage() {
  const resultBox = useRef();
  const [signature, setSignature] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const { filePath } = location.state;

  useEffect(() => {
    // Set the message textarea value to the filePath
    const messageTextArea = document.getElementById("messageTextArea");
    if (messageTextArea) {
      messageTextArea.value = filePath;
    }
  }, [filePath]);

  const handleSign = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError('');
    const sig = await signMessage({
      setError,
      message: data.get("message"),
    });
    if (sig) {
      setSignature(sig);
    }
  };

  const navigate = useNavigate();
  const handleSend = async (filePath, signature, address) => {
    try {

      const response = await axios.post("http://localhost:8081/sendSignature", {
        filePath,
        signature,
        address,
      });
      navigate(`/verifier`);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
   <div className="componentV">
    <div className="auth-form-containerV">
    <form className="register-form" onSubmit={handleSign}>
       <h2>Sign TitleDeed</h2>
         <div className="inputboxV">
           <label htmlFor="message" className="label">TitleDeed</label>
             <textarea
                required
                id="messageTextArea"
                type="text"
                readonly
                name="message"
                className="textarea3"
                placeholder="Message"
              />
          </div>
    
       
          {signature ? (
            <>
              <div className="inputboxV">
               <label htmlFor="message" className="label">Signed TitleDeed</label>
                <p>{signature.message}</p>

                <label htmlFor="message" className="label">Signer Address</label>
                <p>{signature.address}</p> 
                <label htmlFor="message" className="label">Signature</label>
                <textarea
                  type="text"
                  readOnly
                  ref={resultBox}
                  className="textarea2"
                  placeholder="Generated signature"
                  value={signature.signature}
                />
              </div>
              <button
                className="btnV"
                onClick={() => handleSend(location.state.filePath, signature.signature, signature.address)}
              >
                Send Signature
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="btnV"
            >
              Sign message
            </button>
          )}
          <ErrorMessage message={error} />
       
      
    </form>
    </div>
    </div>
  );
}
