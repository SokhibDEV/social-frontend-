import { useContext, useState } from "react";
import "./update.scss";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

export const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [texts, setTexts] = useState({
    userId: user.userId,
    username: user.username,
    email: user.email,
    name: user.name,
    city: user.city,
    website: user.website,
  });
  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => {
      return makeRequest.put("/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;
    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;
    try {
      await updateUser({
        ...texts,
        coverPic: coverUrl,
        profilePic: profileUrl,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  };
  return (
    <div className='update'>
     <h3>Update</h3>
      <form>
        <input
          type='text'
          name='name'
          placeholder='Name...'
          onChange={handleChange}
        />
        <input
          type='text'
          name='city'
          placeholder='City...'
          onChange={handleChange}
        />
        <input
          type='text'
          name='website'
          placeholder='Website'
          onChange={handleChange}
        />
        <label for="cover">Select a CoverPicture:</label>
         <input type='file'  id="cover" onChange={(e) => setCover(e.target.files[0])} />
        <label for="profile">Select a ProfilePicture:</label>
        <input type='file'  id="profile" onChange={(e) => setProfile(e.target.files[0])} />
        <button onClick={handleClick}>Update</button>
      </form>
      <button onClick={() => setOpenUpdate(false)}>X</button>
    </div>
  );
};
