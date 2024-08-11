import { useSelector } from "react-redux"

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification) {
    return null
  }

  const { message, action } = notification

  const pohja = {
    background: "lightgray",
    padding: "10px",
    border: "solid 3px",
    fontSize: "24px",
    borderRadius: "5px",
  }

  const tyylit = {
    onnistunut: { color: "green", borderColor: "green" },

    virhe: { color: "red", borderColor: "red" },
  }

  return <div style={{ ...pohja, ...tyylit[action] }}>{message}</div>
}
export default Notification
