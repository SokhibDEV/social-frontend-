import React from "react";
import { Post } from "../post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";


export const Posts = ({userId}) => {

  

  const {  isPending, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: ()=>  
        makeRequest.get('/posts?userId=' + userId).then(
        (res) =>  {return res.data},
      ),
  })

  return (
    <div className='posts'>
       {
        error
        ? "Something went wrong!"
        : isPending
        ? "loading"
        : data.map((post) => <Post post={post} key={post.postId} />)
        }
    </div>
  );
};
