import config from "../config";

const chatMessage = async (data) => {
  console.log('data', data)
  const objData = {
    "user_input": data
  };
  try {
    const response = await fetch(
      `${config.api.apiDomain}${config.api.apiPort}/chatbot-open`,
      {
        method: "POST",
        body: JSON.stringify(objData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    return new Promise.reject({
      error,
    });
  }
};

export default {
    chatMessage,
};

































































































































































































































































