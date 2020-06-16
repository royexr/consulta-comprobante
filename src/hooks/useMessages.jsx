// Dependencies
import React, { useRef } from 'react';

// Resources
import { Messages } from 'primereact/messages';

const useMessages = () => {
  const messages = useRef(null);

  const showMessages = (severity, summary, detail) => {
    messages.current.show({
      detail,
      severity,
      life: severity === 'error' ? 5000 : 3000,
      summary,
    });
  };

  const renderMessages = () => <Messages ref={messages} />;

  return [showMessages, renderMessages];
};

export default useMessages;
