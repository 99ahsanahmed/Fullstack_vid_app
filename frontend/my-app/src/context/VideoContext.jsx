import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const VideoContext = createContext();

export const useVideo = () => {
  return useContext(VideoContext);
};

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch all videos when the provider mounts
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const {data} = await axios.get(
          "http://localhost:8000/api/v1/videos/getAllVideos"
        );
        setVideos(data.data.videos);
        setTotal(data.data.total);
        console.log(data.data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);
  return (
    <VideoContext.Provider value={{ videos, loading, total }}>
      {children}
    </VideoContext.Provider>
  );
};
