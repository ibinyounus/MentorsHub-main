export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAdminLoggedIn = () => {
  return !!getToken();
};
