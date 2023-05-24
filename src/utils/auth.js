
const TokenKey = 'token'
// const ExpiryTimeKey= 'tokenExpiryTime'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

// export function getTokenExpiryTime() {
//   return localStorage.getItem(ExpiryTimeKey)
// }
//
// export function setTokenExpiryTime(tokenExpiryTime) {
//   return localStorage.setItem(ExpiryTimeKey, tokenExpiryTime)
// }
//
// export function removeTokenExpiryTime() {
//   return localStorage.removeItem(ExpiryTimeKey)
// }
//
// export function isAuthenticated() {
//   return (
//     new Date(Date.now()) < new Date(localStorage.getItem('tokenExpiryTime'))
//   );
// }
