import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import axios from "axios";
import './css/custom.css';
import './css/bootstrap.min.css';
import './font-awesome-4.7.0/css/font-awesome.min.css';

const verifyMessage = async ({ message, address, signature, setError, setSuccessMsg }) => {
  const ethers = require("ethers");
  try {
    const signerAddr = await ethers.utils.verifyMessage(message, signature);
    if (signerAddr !== address) {
      setError("Invalid signature");
      setError();
    } else {
      setError();
      setSuccessMsg("Signature is valid!");
    }
  } catch (err) {
    console.log(err);
    setError("An error occurred during signature verification");
    setError();
  }
};

export default function VerifyMessage() {
  const [error, setError] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const location = useLocation();
  const { filePath, signer, signerAddress } = location.state;

  useEffect(() => {
    const messageTextArea = document.getElementById("message");
    const signatureTextArea = document.getElementById("signature");
    const addressInput = document.getElementById("address");

    if (messageTextArea && signatureTextArea && addressInput) {
      messageTextArea.value = filePath;
      signatureTextArea.value = signer;
      addressInput.value = signerAddress;
    }
  }, [filePath, signer, signerAddress]);

  const handleVerification = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    setSuccessMsg();
    await verifyMessage({
      setError,
      setSuccessMsg,
      message: data.get("message"),
      address: data.get("address"),
      signature: data.get("signature"),
    });
  };


  return (

  <div className="componentV">
    
    <div className="auth-form-containerV">
    <form className="register-form" onSubmit={handleVerification}>
        <h2>Verify Signature</h2>
           <div className="inputboxV">
            <label htmlFor="message" className="label">TitleDeed</label>
                <textarea
                  required
                  type="text"
                  readOnly
                  name="message"
                  className="textarea1"
                  placeholder="Message"
                  id="message"
                />
            </div>
            <div className="inputboxV">
            <label htmlFor="signature" className="label">Signature</label>
              <textarea
                required
                type="text"
                readOnly
                name="signature"
                className="textarea2"
                placeholder="Signature"
                id="signature"
              />
            </div>
            <div className="inputboxV">
            <label htmlFor="address" className="label">Signer Address</label>
              <textarea
                required
                type="text"
                readOnly
                name="address"
                className="textarea3"
                placeholder="Signer address"
                id="address"
              />
            </div>
         
        
       <div className="inputboxV">
          <button
            type="submit"
            className="btnV"
          >
            Verify signature
          </button>
   
        
      </div>
      <div className="messagesV">
      <ErrorMessage message={error} />
      <SuccessMessage message={successMsg} />
   </div>
    <Link to="/user" className="link-btn2">
          Back to your Page?
      </Link>
    </form>
    </div>
    </div>
  );
}
