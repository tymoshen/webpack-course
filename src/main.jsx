import Post from "Modules/Post";
import "Styles/styles.css";
import "Styles/less.less";
import "Styles/scss.scss";
import React from "react";
import { render } from "react-dom";
//import json from "@assets/data.json";
import WebpackLogo from "Images/webpack-logo.svg";
import $ from "jquery";
import "./babel.js";

const post = new Post("Webpack Post Title", WebpackLogo);

// console.log("Post to string: ", post.toString());

// console.log("JSON: ", json);

$("pre")
    .addClass("code")
    .html(post.toString());

const App = () => (
    <div className="container">
        <h1>Webpack Course</h1>
        <hr />
        <div className="logo"></div>
        <hr />
        <pre />
        <div className="box">
            <h2>less example</h2>
        </div>
        <div className="card">
            <h3>scss example</h3>
        </div>
    </div>
);

render(<App />, document.getElementById("app"));
