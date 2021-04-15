import React, { useState, useEffect } from "react";

import firebase from "firebase";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

const Homepage = ({ user }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readPostMode, setReadPostMode] = useState(null);
  const [comment, setComment] = useState(null);

  useEffect(() => {
    let tempAllPosts = [];
    firebase
      .firestore()
      .collection("Posts")
      .get()
      .then((doc) => {
        if (!doc.empty) {
          doc.docs.map((post) => {
            tempAllPosts.push({ ...post.data(), id: post.id });
          });
        }
        setAllPosts(tempAllPosts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong!");

        setIsLoading(false);
      });
  });

  const handleLikePost = (postId) => {
    firebase
      .firestore()
      .collection("Posts")
      .doc(postId)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(user.id),
      });
  };

  const handleUnlikePost = (postId) => {
    firebase
      .firestore()
      .collection("Posts")
      .doc(postId)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove(user.id),
      });
  };

  const handleDislikePost = (postId) => {
    firebase
      .firestore()
      .collection("Posts")
      .doc(postId)
      .update({
        dislikes: firebase.firestore.FieldValue.arrayUnion(user.id),
      });
  };
  const handleRemoveDislikePost = (postId) => {
    firebase
      .firestore()
      .collection("Posts")
      .doc(postId)
      .update({
        dislikes: firebase.firestore.FieldValue.arrayRemove(user.id),
      });
  };

  const handleAddComment = (postId) => {
    if (!comment) {
      alert("Please enter a comment!");
      return;
    }

    let commentData={
        user: user.id,
        userName: user.fullName,
        body: comment,
        createdAt: new Date(),
      }

    firebase
      .firestore()
      .collection("Posts")
      .doc(postId)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion({...commentData}),
      })
      .then(() => {
          console.log(commentData)
         
        alert("Comment added!");
        setComment("");
      });
  };




  return (
    <div>
      <div className="bg-light shadow  p-3">
        <span>
          <b>My blog</b>
        </span>
        <span className=" float-right mx-3">
          <Link to="./dashboard">
            <b>{firebase.auth().currentUser ? "Dashboard" : "Login"}</b>
          </Link>
        </span>
      </div>
      {readPostMode && (
        <div class="modal" tabindex="-1" id="ReadPost">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{readPostMode.title}</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span
                    aria-hidden="true"
                    onClick={() => setReadPostMode(null)}
                  >
                    &times;
                  </span>
                </button>
              </div>
              <div class="modal-body">
                <div className="text-justify">{readPostMode.content}</div>
                <hr />
                <div>
                  <div className="font-weight-bold">Comments</div>
                  {readPostMode.comments.length ? (
                    readPostMode.comments.map((Comment) => (
                      <div className="p-2 m-2 rounded shadow">
                        <div className="font-weight-bold">{Comment.userName}</div>
                        <div className="text-justify">{Comment.body}</div>
                        <div className="py-4">
                          <span className="float-right">
                            {Comment.createdAt.toDate().toDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center">
                      <i>No comments added!</i>
                    </div>
                  )}
                  {firebase.auth().currentUser && (
                    <div className="rounded p-3 m-2 rounded">
                      <div className="font-weight-bold ">Add a comment...</div>
                      <textarea
                        rows="5"
                        className="form-control"
                        name="body"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                      <div className="my-2">
                        <span
                          className="float-right btn btn-sm btn-primary"
                          onClick={() => handleAddComment(readPostMode.id)}
                        >
                          Add comment
                        </span>{" "}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => setReadPostMode(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className=" container">
        <div className="my-3 text-center display-4 ">All posts</div>
        {isLoading ? (
          <div className="text-center mt-5 lead">Loading...</div>
        ) : (
          <div className="row mx-0">
            {allPosts.length ? (
              allPosts.map((post) => (
                <div className="col-md-3 col-sm-6 col-12 ">
                  <div className="m-3 mx-auto rounded shadow bg-light p-3">
                    <div
                      className="cp"
                      data-toggle="modal"
                      data-target="#ReadPost"
                      onClick={() => setReadPostMode({ ...post })}
                    >
                      <div className="font-weight-bold">{post.title}</div>
                      <div className="text-justify">
                        {post.content.length > 200
                          ? `${post.content.slice(0, 200)}...`
                          : post.content}
                      </div>
                    </div>

                    {firebase.auth().currentUser ? (
                      <div>
                        <div className="text-center">
                          <span className="cp text-success mx-2">
                            {post.likes.length}{" "}
                            {post.likes.includes(user.id) ? (
                              <span onClick={() => handleUnlikePost(post.id)}>
                                Liked
                              </span>
                            ) : (
                              <span onClick={() => handleLikePost(post.id)}>
                                Like
                              </span>
                            )}
                          </span>
                          <span className="cp text-danger mx-2">
                            {post.dislikes.length}{" "}
                            {post.dislikes.includes(user.id) ? (
                              <span
                                onClick={() => handleRemoveDislikePost(post.id)}
                              >
                                Disliked
                              </span>
                            ) : (
                              <span onClick={() => handleDislikePost(post.id)}>
                                Dislike
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-danger mx-2">
                          {post.likes.length} Like
                        </span>
                        <span className=" text-danger mx-2">
                          {post.dislikes.length} Dislike
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className=" col-6 mx-auto text-center text-danger mt-5">
                <i>No post found!</i>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  user: state.user.currentUser,
});

export default connect(mapStatetoProps)(Homepage);
