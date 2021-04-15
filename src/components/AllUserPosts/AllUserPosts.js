import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import firebase from "firebase";

const AllUserPosts = ({ user }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readPostMode, setReadPostMode]= useState(null)

  useEffect(() => {
    let tempAllPosts = [];
    firebase
      .firestore()
      .collection("Posts")
      .where("user", "==", user.id)
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

  const deletePost = (postId) => {
    firebase
      .firestore()
      .collection("Posts")
      .doc(postId)
      .delete()
      .then(() => alert("Post deleted successfully"))
      .catch((err) => {
        console.log(err);
        alert("Something went wrong!");
      });
  };

  return (
    <div>
      <div className="my-4 display-4 text-center">All posts</div>
      {isLoading ? (
        <div className="mt-5 text-center lead">Loading...</div>
      ) : (
        <div>
          {allPosts.length ? (
            <div style={{ width: "100%", overflowX: "scroll" }}>
              <table class="table" style={{ width: "1400px" }}>
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Title</th>
                    <th scope="col">Content</th>
                    <th scope="col">Date</th>
                    <th scope="col">Likes</th>
                    <th scope="col">Dislikes</th>
                    <th scope="col">Comments</th>
                    <th scope="col">Read</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {allPosts.map((post, idx) => (
                    <tr>
                      <th scope="row">{idx + 1}</th>
                      <td>{post.title}</td>
                      <td>
                        {post.content.length > 50
                          ? `${post.content.slice(0, 40)}...`
                          : post.content}
                      </td>
                      <td>{post.createdAt.toDate().toDateString()}</td>
                      <td>{post.likes.length}</td>
                      <td>{post.dislikes.length}</td>
                      <td>{post.comments.length}</td>
                      <td>
                        <span className="btn btn-sm btn-warning "  data-toggle="modal" data-target="#staticBackdrop" onClick={()=> setReadPostMode({...post})}>Read</span>
                      </td>
                      <td>
                        <span
                          className="btn btn-sm btn-danger "
                          onClick={()=>deletePost(post.id)}
                        >
                          Delete
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-danger mt-3">
              <i>No post found! Please add a post.</i>
            </div>
          )}
        </div>
      )}

      {readPostMode &&
      <div class="modal" tabindex="-1" id="staticBackdrop">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{readPostMode.title}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" onClick={()=> setReadPostMode(null)} >&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {readPostMode.content}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"  onClick={()=> setReadPostMode(null)}>Close</button>
          </div>
        </div>
      </div>
    </div>}
    </div>
  );
};

const mapStatetoProps = (state) => ({
  user: state.user.currentUser,
});

export default connect(mapStatetoProps)(AllUserPosts);
