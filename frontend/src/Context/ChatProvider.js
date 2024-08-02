import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const[chats,setChats] = useState([]);
    const[notification,setNotification] = useState([]);
    const navigate =  useNavigate();
    // const temp = "abc";
    useEffect( () => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if(!userInfo){
            navigate("/");
        }
    },[navigate]);   
    return (
        <ChatContext.Provider value={{ user, setUser ,selectedChat,setSelectedChat,chats,setChats,notification,setNotification }}>
            {children}
        </ChatContext.Provider>
    )

};

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;