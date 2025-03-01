export interface User {
  _id: string,
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
  following: string[] | any[],
  followers: string[] | any[],
  savedConcerts: string[] | any[],
  profilePicture?: string,
  bio?: string,
  createdAt: string,
}