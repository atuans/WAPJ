import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from '@material-ui/icons/LinkedIn';


const About = () => {

  const Github =() =>{
    window.location = 'https://github.com/atuans';
  }

  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/ititiu19233-iu/image/upload/v1654869613/Team/IMG_6587_c7hmug.jpg"
              alt="Founder"
            />
            <Typography>Nguyen Hoang Anh Tuan</Typography>
            <Typography>Nguyen Duc Cong</Typography>
            <Typography>Vu Hoang Nam</Typography>
            <Button onClick= { Github} color="primary">
              Github Link
            </Button>
            <span>
              Web- application final project 
              Using MERN stack 
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Social Media</Typography>
            <a href="https://www.youtube.com" target="blank">
              <YouTubeIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://instagram.com" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
            <a href='https://www.linkedin.com/in/anh-tuan-1408b01a7/' target='blank'>
              <LinkedInIcon className=""/>

            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
