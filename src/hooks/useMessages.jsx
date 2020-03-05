// Dependencies
import React, { useState } from 'react';

// Resources
import { Messages } from 'primereact/messages';

const useMessages = () => {
  const [messages, setMessages] = useState(new Messages());

  const showMessages = (severity, summary, detail) => {
    messages.show({ severity, summary, detail });
  };

  const renderMessages = () => <Messages ref={(el) => { setMessages(el); }} />;

  return [showMessages, renderMessages];
};

export default useMessages;
