export const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

export const checkLogInAndAppendAuthHeaders = (headers) => {
  if (isUserLoggedIn()) {
    return appendAuthenticationHeaders(headers);
  }
  return headers;
};

export const appendAuthenticationHeaders = (headers) => {
  let authenticationToken = localStorage.getItem("authenticationToken");
  return {
    ...headers,
    "X-CSRFToken": getCookie("csrftoken"),
    Authorization: `Token ${authenticationToken}`,
  };
};

export const setItemsInLocalStorage = (items) => {
  for (const [key, value] of Object.entries(items)) {
    localStorage.setItem(key, value);
  }
};

export const logOutUser = () => {
  localStorage.removeItem("authenticationToken");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("username");
};

export const isUserLoggedIn = () => {
  // this method checks if the authenticationToken is present in localStorage and is not expired
  let authenticationToken = localStorage.getItem("authenticationToken");
  let tokenExpiry = localStorage.getItem("tokenExpiry");
  return (
    !!authenticationToken && !!tokenExpiry && new Date() < new Date(tokenExpiry)
  );
};

export const getUsername = () => {
  return localStorage.getItem("username");
};
