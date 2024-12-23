// import React, { useState } from "react";

// const DynamicInputField = () => {
//   const [prompt, setPrompt] = useState("");
//   const [files, setFiles] = useState([]);
//   const [link, setLink] = useState("");

//   const handleFileUpload = (e) => {
//     setFiles([...files, ...e.target.files]);
//   };

//   const handleGenerateScript = async () => {
//     const formData = new FormData();
//     formData.append("prompt", prompt);
//     files.forEach((file, index) => {
//       formData.append(`file-${index}`, file);
//     });
//     formData.append("link", link);

//     const response = await fetch("http://localhost:8000/api/generate-script/", {
//       method: "POST",
//       body: formData,
//     });
//     console.log(response);

//     const data = await response.json();
//     console.log(data);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
//       <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-lg">
//         <h1 className="text-2xl font-bold mb-4">
//           AI-Powered Video Script Generator
//         </h1>
//         <textarea
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="How can I help you today?"
//           className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4"
//         ></textarea>
//         <input
//           type="file"
//           multiple
//           onChange={handleFileUpload}
//           className="block w-full p-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg mb-4"
//         />
//         <input
//           type="url"
//           value={link}
//           onChange={(e) => setLink(e.target.value)}
//           placeholder="Enter a link..."
//           className="block w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4"
//         />
//         <button
//           onClick={handleGenerateScript}
//           className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold"
//         >
//           Generate Script
//         </button>
//       </div>
//       <footer className="mt-6 text-sm text-gray-500">Powered by AI</footer>
//     </div>
//   );
// };

import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import { AiOutlineUser, AiOutlineRobot } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";

const ChatGPTUI = () => {
  const [messages, setMessages] = useState([
    { sender: "AI", text: "Hi, how can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() && !image) return;

    // Add the user's message
    const newMessages = [
      ...messages,
      { sender: "You", text: inputValue, image },
    ];
    setMessages(newMessages);
    setInputValue("");
    setImage(null);

    setLoading(true); // Set loading to true to prevent new requests

    try {
      // Simulate or replace this with handleGenerateScript
      const formData = new FormData();
      formData.append("prompt", inputValue);
      if (image) formData.append("image", image);

      const response = await fetch(
        "http://localhost:8000/api/generate-script/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      const data = await response.json();
      console.log(data);

      // Add AI's response
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: data.generated_script || "Here is the response!",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false); // Reset loading after request completes
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div className="flex w-full h-full flex-col items-center justify-center">
      <div
        // style={{
        //   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        // }}
        className="bg-white p-6 rounded-lg  md:w-[60%] w-full h-[634px] flex flex-col"
      >
        {/* Heading */}
        <div className="flex flex-col space-y-1.5 pb-6">
          <h2 className="font-semibold text-lg tracking-tight">ChatGPT</h2>
          <p className="text-sm text-[#6b7280] leading-3">
            Powered by OpenAI and React
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 my-4 text-gray-600 text-sm ${
                message.sender === "You" ? "justify-end" : ""
              }`}
            >
              {message.sender === "AI" && (
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                  <div className="rounded-full bg-gray-100 border p-1">
                    <AiOutlineRobot size={20} />
                  </div>
                </span>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === "You"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {/* Render message.text with line breaks */}
                {message.text.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
              {message.sender === "You" && (
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                  <div className="rounded-full bg-gray-100 border p-1">
                    <AiOutlineUser size={20} />
                  </div>
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Input Box */}
        <form
          className="flex items-center space-x-2"
          onSubmit={handleSendMessage}
        >
          <label
            htmlFor="imageUpload"
            className="cursor-pointer rounded-md bg-gray-100 p-2 hover:bg-gray-200"
          >
            <BiImageAdd size={20} />
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
            placeholder="Type your message"
            value={inputValue}
            disabled={loading}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
            type="submit"
            disabled={loading}
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatGPTUI;
