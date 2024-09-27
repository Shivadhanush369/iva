
let chatmessage;
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatbtn = document.querySelector(".chat-input span");
    const chatbox = document.querySelector(".chatbox");
  
    console.log(chatbotToggler, closeBtn, chatInput, sendChatbtn); // Check if elements are selected correctly
  
    let userMessage = null; // Variable to store user's message
    const API_KEY = ""; // Paste API key here
    const inputInitHeight = chatInput.scrollHeight;
  
    const createChatLi = (message, className) => {
      // Create a chat <li> element with passed message and class name
      const chatLi = document.createElement("li");
      chatLi.classList.add("chat", className);
      let chatContent =
        className === "outgoing"
          ? `<p></p>`
          : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
      chatLi.innerHTML = chatContent;
      chatLi.querySelector("p").textContent = message;
      return chatLi; // return chat <li> element
    };
  
    const generateResponse = (incomingChatli) => {
      // Generate a random response from the bot
      const API_URL = "http://127.0.0.1:8000/fetch_records";
      const messageElement = incomingChatli.querySelector("p");
    
      // Ensure userMessage is defined
      const userMessage = chatmessage; // or however you retrieve the user's message
    
      let bodydata = {
        text: userMessage
      };
    
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // Ensure the content is JSON
        },
        body: JSON.stringify(bodydata),  // Stringify the bodydata
      };
    
      // Send POST request to API, get a response and set the response as paragraph text
      fetch(API_URL, requestOptions)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.response && data.response.content) {
            const responseContent = data.response.content.trim();
            const prettyContent = prettifyResponse(responseContent); // Prettify the response
            messageElement.innerHTML = prettyContent;// Display the content in the message element
          } else {
            throw new Error("Invalid response format");
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);  // Log the error for debugging
          messageElement.classList.add("error");
          messageElement.textContent =
            "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    };
    
    
  
    const handleChat = () => {
      userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
      chatmessage = chatInput.value.trim();
      if (!userMessage) return;
  
      // Clear the input textarea and set its height to default
      chatInput.value = "";
      chatInput.style.height = `${inputInitHeight}px`;
  
      // Append the user's message to the chatbox
      const outgoingChatli = createChatLi(userMessage, "outgoing");
      chatbox.appendChild(outgoingChatli);
      chatbox.scrollTo(0, chatbox.scrollHeight);
  
      setTimeout(() => {
        // Display "Typing..." message while waiting for the response
        const incomingChatli = createChatLi("Typing...", "incoming");
        chatbox.appendChild(incomingChatli);
        generateResponse(incomingChatli);
      }, 600);
    };
  
    chatInput.addEventListener("input", () => {
      // Adjust the height of the input textarea based on its content
      chatInput.style.height = `${inputInitHeight}px`;
      chatInput.style.height = `${chatInput.scrollHeight}px`;
    });
  
    chatInput.addEventListener("keydown", (e) => {
      // If Enter key is pressed without the Shift key and the window
      // width is greater than 800px, handle the chat
      if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
      }
    });
  
    sendChatbtn.addEventListener("click", handleChat);
    
    // Adding console.log to check click event on the chatbot toggler
    chatbotToggler.addEventListener("click", () => {
      console.log("Chatbot toggler clicked!"); // Log to check if the button is clicked
      document.body.classList.toggle("show-chatbot");
    });
  
    closeBtn.addEventListener("click", () => {
      document.body.classList.remove("show-chatbot");
    });
  });
  const prettifyResponse = (rawString) => {
    // Replace new lines with HTML breaks
    let formattedString = rawString.replace(/\n/g, '<br/>');
  
    // Convert Markdown-like syntax to HTML
    formattedString = formattedString
      .replace(/(\*\*.*?\*\*)/g, '<br/><strong>$1</strong>') // Add a new line before bold text
      
      .replace(/^(#)(.*)$/gm, '<h6>$2</h6>') // Convert # heading to <h1>
      .replace(/^(##)(.*)$/gm, '<h6>$2</h6>') // Convert ## heading to <h2>
      .replace(/^(###)(.*)$/gm, '<h6>$2</h6>') // Convert ### heading to <h3>
      .replace(/^(####)(.*)$/gm, '<h6>$2</h6>') // Convert #### heading to <h4>
      .replace(/^(#####)(.*)$/gm, '<h6>$2</h6>') // Convert ##### heading to <h5>
      .replace(/^(######)(.*)$/gm, '<h6>$2</h6>') // Convert ###### heading to <h6>
      .replace(/^\d+\.\s(.*)$/gm, '<ol><li>$1</li>') // Convert ordered list numbers to <li>
      .replace(/^\*\s(.*)$/gm, '<ul><li>$1</li>') // Convert * to unordered list
      .replace(/<\/li>\s*<br\/>/g, '</li>') // Remove breaks after <li> tags
      .replace(/<\/li>(?=\s*<\/ol>)/g, '</li>') // Ensure <li> is properly closed
      .replace(/<\/li>(?=\s*<\/ul>)/g, '</li>') // Ensure <li> is properly closed for ul
      .replace(/<\/ul>/g, '</li></ul>') // Ensure <ul> is closed properly
      .replace(/<\/ol>/g, '</li></ol>'); // Ensure <ol> is closed properly
  
    // Handle cases where lists are not closed
    formattedString = formattedString.replace(/<\/ol>(\s*<\/ol>)/g, '</ol>'); // Ensure no double closing tags
  
    return formattedString;
  };
  