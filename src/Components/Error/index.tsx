export default function ErrorCard({error}: {error: Error}) {

  if (error.message.includes("401")) {
    return (
        <div>
          <h1>Unauthorized</h1>
          <h2>Please login and try again.</h2>
          <button></button>
        </div>
    )
  }
  return <div>
    An error occurred.
  </div>
}