import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { server } from "../../server";
import axios from "axios";
import { AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../../styles/styles";

const ENDPOINT = process.env.REACT_APP_SOCKET_URL || "http://localhost:4000";

const ShopInbox = () => {
  const { seller } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socketRef = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socketRef.current = socketIO(ENDPOINT);
    socketRef.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (seller?._id) {
      socketRef.current.emit("addUser", seller._id);
    }
  }, [seller]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
          {
            withCredentials: true,
          }
        );
        setConversations(response.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    if (seller?._id) {
      getConversation();
    }
  }, [seller]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentChat) {
      getMessage();
    }
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socketRef.current.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketRef.current.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        imageHandler(reader.result);
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const imageHandler = async (e) => {
    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socketRef.current.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: seller._id,
          conversationId: currentChat._id,
        })
        .then((res) => {
          setMessages([...messages, res.data.message]);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full bg-white m-5 rounded-lg shadow-sm border border-gray-100 flex h-[85vh]">
      {/* Left conversation thread list */}
      <div className="w-[30%] border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Customer Chats</h2>
        {conversations &&
          conversations.map((item, index) => (
            <MessageList
              data={item}
              key={index}
              setCurrentChat={setCurrentChat}
              me={seller?._id}
              currentChat={currentChat}
            />
          ))}
        {(!conversations || conversations.length === 0) && (
          <p className="text-gray-400 text-sm mt-8">No customer messages yet.</p>
        )}
      </div>

      {/* Right chat timeline and input */}
      <div className="w-[70%] flex flex-col justify-between p-4">
        {currentChat ? (
          <>
            <div className="overflow-y-auto max-h-[68vh] p-3 space-y-3">
              {messages &&
                messages.map((item, index) => (
                  <div
                    className={`flex w-full ${
                      item.sender === seller?._id ? "justify-end" : "justify-start"
                    }`}
                    key={index}
                    ref={scrollRef}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-[60%] ${
                        item.sender === seller?._id
                          ? "bg-[#3853db] text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.images && (
                        <img
                          src={item.images.url}
                          alt=""
                          className="w-[200px] h-[200px] object-cover rounded mb-2"
                        />
                      )}
                      {item.text && <p className="text-sm">{item.text}</p>}
                      <p className="text-[10px] text-right mt-1 opacity-70">
                        {format(item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <form
              onSubmit={sendMessageHandler}
              className="p-3 relative w-full flex justify-between items-center border-t"
            >
              <div className="w-[30px]">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image">
                  <TfiGallery className="cursor-pointer" size={20} />
                </label>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  required
                  placeholder="Type your reply to customer..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className={`${styles.input}`}
                />
              </div>
              <div className="w-[30px] p-2">
                <button type="submit">
                  <AiOutlineSend
                    size={20}
                    className="cursor-pointer text-[#3853db]"
                  />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a customer message to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

const MessageList = ({ data, setCurrentChat, me, currentChat }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = data.members.find((b) => b !== me);
    const getUserInfo = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      getUserInfo();
    }
  }, [data, me]);

  return (
    <div
      className={`w-full flex p-3 my-2 items-center cursor-pointer rounded-lg hover:bg-gray-50 ${
        currentChat?._id === data?._id ? "bg-gray-100" : ""
      }`}
      onClick={() => setCurrentChat(data)}
    >
      <div className="relative">
        <img
          src={`${user?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}`}
          alt=""
          className="w-[45px] h-[45px] rounded-full object-cover border"
        />
      </div>
      <div className="pl-3">
        <h1 className="text-[15px] font-semibold text-gray-800">{user?.name || "Customer"}</h1>
        <p className="text-[12px] text-gray-500 truncate max-w-[150px]">
          {data?.lastMessage || "Start a conversation..."}
        </p>
      </div>
    </div>
  );
};

export default ShopInbox;
