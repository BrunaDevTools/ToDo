import "./../styles/UserName.css";

export default function UserName({ name, avatar }) {
  return (
    <div className="username-container">
      <img className="avatar" src={avatar} alt={`${name}'s avatar`} />
      <p className="username">{name}</p>
    </div>
  );
}
