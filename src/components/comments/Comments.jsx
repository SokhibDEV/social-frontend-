import React, { useContext, useState } from "react";
import "./commits.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

export const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { isPending, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => {
        return (res.data)
      }),
  });


   
  const queryClient = useQueryClient();
  const mutation = useMutation({
    
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div  className='comments'>
      <div  className='write'>
        <img src={ '/upload/'+  currentUser.profilePic} alt='' />
        <input  
          type='text'
          value={desc}
          placeholder='write a comment'
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isPending
        ? "Loading..."
        : data?.map((comment, index) => (
            <div key={index}   className='comment'>
              <img src={"/upload/" + comment.profilePic} alt='' />
              <div className='info'>
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className='date'>
              {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};
