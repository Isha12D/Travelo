import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const data = [
  {
    id: 1,
    content: "Varanasi",
    videoUrl:
      "https://videos.pexels.com/video-files/4685716/4685716-sd_640_360_30fps.mp4",
    imageUrl:
      "https://images.pexels.com/photos/17869859/pexels-photo-17869859/free-photo-of-ganges-coast-in-varanasi-city.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 2,
    content: "Jaipur",
    videoUrl:
      "https://videos.pexels.com/video-files/5243307/5243307-sd_640_360_25fps.mp4",
    imageUrl:
      "https://images.ctfassets.net/bth3mlrehms2/15FkRQjgtqJC4L40yhFg6W/4dff837ed92569427b2607e9b5a51826/iStock-639075168.jpg?w=3865&h=2576&fl=progressive&q=50&fm=jpg",
  },
  {
    id: 3,
    content: "Srinagar",
    videoUrl:
      "https://videos.pexels.com/video-files/20530145/20530145-sd_540_960_30fps.mp4",
    imageUrl:
      "https://images.pexels.com/photos/8629979/pexels-photo-8629979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 4,
    content: "Srinagar",
    videoUrl:
      "https://videos.pexels.com/video-files/20530145/20530145-sd_540_960_30fps.mp4",
    imageUrl:
      "https://images.pexels.com/photos/8629979/pexels-photo-8629979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 5,
    content: "Srinagar",
    videoUrl:
      "https://videos.pexels.com/video-files/20530145/20530145-sd_540_960_30fps.mp4",
    imageUrl:
      "https://images.pexels.com/photos/8629979/pexels-photo-8629979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 6,
    content: "Srinagar",
    videoUrl:
      "https://videos.pexels.com/video-files/20530145/20530145-sd_540_960_30fps.mp4",
    imageUrl:
      "https://images.pexels.com/photos/8629979/pexels-photo-8629979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const ITEMS_PER_PAGE = 3;

export const Package = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [playingVideos, setPlayingVideos] = useState({});
  const [modalCity, setModalCity] = useState(null);
  const [days, setDays] = useState(1);

  const navigate = useNavigate();

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const openModal = (city) => {
    setModalCity(city);
    setDays(1);
  };

  const closeModal = () => setModalCity(null);

  const handleNavigate = () => {
    navigate(`/travelbot/${modalCity}?days=${days}`);
  };

  return (
    <div className="container mx-auto text-center pt-4 pb-8 bg-blue-400 min-h-screen">
      <h1 className="text-white font-bold text-5xl font-mono py-2">Packages</h1>

      {/* Grid + arrows wrapper */}
      <div className="relative mt-2 p-8">

        {/* Left arrow */}
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-800 p-3 rounded-full shadow hover:bg-gray-200 z-10"
          >
            ◀
          </button>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500 cursor-pointer relative"
              onClick={() => openModal(item.content)}
            >
              <div
                className="flex-grow flex items-center justify-center relative w-full h-96 overflow-hidden"
                onMouseEnter={() =>
                  setPlayingVideos((prev) => ({ ...prev, [item.id]: true }))
                }
                onMouseLeave={() =>
                  setPlayingVideos((prev) => ({ ...prev, [item.id]: false }))
                }
              >
                {playingVideos[item.id] ? (
                  <video
                    width="100%"
                    height="100%"
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  >
                    <source src={item.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.content}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold mt-4">{item.content}</h2>
                <p className="text-gray-700 mt-2">Details about {item.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        {currentPage * ITEMS_PER_PAGE < data.length && (
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev * ITEMS_PER_PAGE < data.length ? prev + 1 : prev
              )
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-800 p-3 rounded-full shadow hover:bg-gray-200 z-10"
          >
            ▶
          </button>
        )}
      </div>

      {/* Modal */}
      {modalCity && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl p-8 w-80 space-y-4 shadow-2xl">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <FaCalendarAlt className="text-blue-600" /> {modalCity} Trip
            </h2>
            <p className="text-gray-600 text-center">Select number of days:</p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setDays(Math.max(1, days - 1))}
                className="text-red-500 text-2xl"
              >
                <FaMinusCircle />
              </button>
              <span className="text-xl font-bold">
                {days} {days === 1 ? "day" : "days"}
              </span>
              <button
                onClick={() => setDays(days + 1)}
                className="text-green-500 text-2xl"
              >
                <FaPlusCircle />
              </button>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleNavigate}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Start Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
