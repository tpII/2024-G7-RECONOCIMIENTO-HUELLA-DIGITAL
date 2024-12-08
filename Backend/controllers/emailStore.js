// emailStore.js
let emailStore = {
  webpush: [],
  email: [],
};

export const getEmailStore = () => emailStore;

export const updateEmailStore = (type, emails) => {
  if (type === "webpush" || type === "email") {
    emailStore[type] = emails;
  }
};
