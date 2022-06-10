import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:anht13122001@gmail.com">
        <Button>Contact: anht13122001@gmail.com</Button>
        <br/>
        <Button>Contact: nguyenduccongvt@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;
