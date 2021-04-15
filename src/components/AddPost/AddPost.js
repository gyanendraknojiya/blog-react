import React, { useState } from "react";

import firebase from "firebase";
import {connect} from "react-redux"

const AddPost = ({user }) => {
  const [postData, setPostData] = useState({});

  const handlePostDataChange = (e) => {
    postData[e.target.name] = e.target.value;
    setPostData({...postData});
  };

  const addPost = (e) => {
    e.preventDefault();
    if (!postData.title || !postData.content) {
      alert("Please enter post title and content!");
      return;
    }

    firebase
      .firestore()
      .collection("Posts")
      .add({
        ...postData,
        likes: [],
        dislikes: [],
        comments: [],
        user: user.id,
        createdAt: new Date(),
      })
      .then(() => {
        setPostData({title:"", content:""});
        alert("Post added successfully!");
      })
      .catch((err) => {
        console.log(err);
        alert("Sonething went wrong!");
      });
  };

  return (
    <div>
      <form className="row mx-0" onSubmit={addPost} >
        <div className="col-7 mx-auto mt-5 px-4">
          <div className="text-center display-4 my-4 ">Add a new post</div>

          <div className="form-group mt-3">
            <label>Post title:</label>
            <input
              type="text"
              name="title"
              placeholder="Please enter post title..."
              className="form-control"
              value={postData.title}
              onChange={handlePostDataChange}
            />
          </div>
          <div className="form-group mt-3">
            <label>Post content:</label>
            <textarea
              name="content"
              rows="6"
              placeholder="Please enter post content..."
              className="form-control"
              value={postData.content}
              onChange={handlePostDataChange}
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary px-5 float-right">Add</button>
          </div>
        </div>
      </form>
    </div>
  );
};


const mapStatetoProps = (state) => ({
  user: state.user.currentUser,
});

export default connect(mapStatetoProps)(AddPost);
