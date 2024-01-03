import React, { useContext, useState } from "react";
import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Posts, Update } from "../../components";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

export const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isPending, data } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => {
        return res.data;
      }),
  });
  const { isPending: isLoading, data: relationShipData } = useQuery({
    queryKey: ["relationship"],
    queryFn: () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationship"]);
    },
  });
  const handleFollow = () => {
    mutation.mutate(relationShipData.includes(currentUser.userId));
  };

  return (
    <div className='profile'>
      {isPending ? (
        "Loading..."
      ) : (
        <>
          {" "}
          <div className='images'>
            <img src={"/upload/" + data.coverPic} alt='' className='cover' />
            <img
              src={"/upload/" + data.profilePic}
              alt=''
              className='profilePic'
            />
          </div>
          <div className='profileContainer'>
            <div className='uInfo'>
              <div className='left'>
                <a href='http://facebook.com'>
                  <FacebookTwoToneIcon fontSize='large' />
                </a>
                <a href='http://facebook.com'>
                  <InstagramIcon fontSize='large' />
                </a>
                <a href='http://facebook.com'>
                  <TwitterIcon fontSize='large' />
                </a>
                <a href='http://facebook.com'>
                  <LinkedInIcon fontSize='large' />
                </a>
                <a href='http://facebook.com'>
                  <PinterestIcon fontSize='large' />
                </a>
              </div>
              <div className='center'>
                <span>{data.name}</span>
                <div className='info'>
                  <div className='item'>
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className='item'>
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {isLoading ? (
                  "loading..."
                ) : userId === currentUser.userId ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationShipData.includes(currentUser.userId)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className='right'>
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>

            <Posts userId={userId} />
          </div>{" "}
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};
