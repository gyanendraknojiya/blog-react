import React, { useState } from "react";

import firebase from "firebase";
import { connect } from "react-redux";
import AddPost from "../AddPost/AddPost";
import AllUserPosts from "../AllUserPosts/AllUserPosts";
import { Link } from "react-router-dom";

const Dashboard = ({ user }) => {
  const [viewMode, setViewMode] = useState("addPost");
  return (
    <div>
      <div className="bg-primary text-white p-2 py-3">
          <Link to="./" className="mr-4 ml-2" ><span className="text-light" ><b>Home</b></span></Link>
        <>Hello {user.fName}</>
        <span
          className="btn btn-danger btn-sm float-right mx-3"
          onClick={() => firebase.auth().signOut()}
        >
          Log out
        </span>
      </div>

      <div className="row mx-0" style={{ height: "93vh" }}>
        <div className="col-1 bg-dark text-center" style={{ height: "100%" }}>
          <div
            className={`rounded cp p-2 my-4 ${
              viewMode === "addPost" ? "bg-info text-white shadow" : "bg-light"
            } `}
            onClick={() => setViewMode("addPost")}
          >
            <small>Add Post</small>
          </div>
          <div
            className={`rounded cp p-2 my-4 ${
              viewMode === "allPosts" ? "bg-info text-white shadow" : "bg-light"
            } `}
            onClick={() => setViewMode("allPosts")}
          >
            <small>All Posts</small>
          </div>
        </div>
        <div className="col-11">
          {viewMode === "addPost" && <AddPost/>}
          {viewMode === "allPosts" && <AllUserPosts />}
        </div>
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  user: state.user.currentUser,
});

export default connect(mapStatetoProps)(Dashboard);
