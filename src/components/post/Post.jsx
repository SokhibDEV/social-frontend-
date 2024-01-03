import "./post.scss";
import React, { useContext, useState } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import { Comments } from "../comments";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

export const Post = ({ post }) => {
  const [commetOpen, setCommetOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery({
    queryKey: ["likes", post.postId],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.postId).then((res) => {
        return res.data;
      }),
  });

  const { data : comData } = useQuery({
    queryKey: ["comment", post.postId],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + post.postId).then((res) => {
        return (res.data)
      }),
  });

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.postId);
      return makeRequest.post("/likes", { postId: post.postId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["likes"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleLike = () => {
    mutation.mutate(data?.includes(currentUser.userId));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.postId);
  };

  return (
    <div className='post'>
      <div className='container'>
        <div className='user'>
          <div className='userInfo'>
            <img src={"/upload/" +post.profilePic} alt='' />
            <div className='details'>
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className='name'> {post.name} </span>
              </Link>
             
              <span className='date'>{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={()=> setMenuOpen(!menuOpen)} />
          {(menuOpen && post.userId === currentUser.userId) && <button onClick={handleDelete}>delete</button>}
        </div>
        <div className='content'>
          <p>{post.desc}</p>
          <img src={"./upload/" + post.img} alt='' />
        </div>
        <div className='info'>
          <div className='item'>
            {error ? (
              "Something went wrong"
            ) : isPending ? (
              "Loading..."
            ) : data?.includes(currentUser.userId) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className='item' onClick={() => setCommetOpen(!commetOpen)}>
            <TextsmsOutlinedIcon />
           {comData?.length} Comments
          </div>
          <div className='item'>
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commetOpen && <Comments postId={post.postId} />}
      </div>
    </div>
  );
};
