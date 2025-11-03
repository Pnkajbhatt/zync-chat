import React from "react";

export default function ChatLayout({ children }) {
  return (
    <div className="chat-layout">
      <header>
        <h2>Chat</h2>
      </header>
      <main>{children || <p>Chat content goes here.</p>}</main>
    </div>
  );
}
