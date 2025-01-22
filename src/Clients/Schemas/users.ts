export interface User {
  _id: string,
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
  following: string[],
  followers: string[],
  savedConcerts: string[],
}