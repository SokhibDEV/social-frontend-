import React, { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
export const Stories = () => {

    const {currentUser} = useContext(AuthContext)
  const stories = [
    {
      id: 1,
      name: "John Doe",
      img: "https://picsum.photos/id/237/400/400",
    },
    {
      id: 2,
      name: "Piter Pen",
      img: "https://picsum.photos/id/238/400/400",
    },
    {
      id: 3,
      name: "John Doe",
      img: "https://picsum.photos/id/255/400/400",
    },
    
  ];

  return (
    <div className='stories'>
        <div className='story'>
          <img src={'/upload/'+ currentUser.profilePic} alt='' />
          <span> {currentUser.name} </span>
          <button>+</button>
        </div>
      {stories.map((story) => (
        <div className='story' key={story.id}>
          <img src={story.img} alt='an img' />
          <span> {story.name} </span>
        </div>
      ))}
    </div>
  );
};
