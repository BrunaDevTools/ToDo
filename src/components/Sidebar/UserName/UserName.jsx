import styles from "./UserName.module.css";

export default function UserName({ name, avatar }) {
  return (
    <div className={styles.usernameContainer}>
      <img className={styles.avatar} src={avatar} alt={`${name}'s avatar`} />
      <p className={styles.username}>{name}</p>
    </div>
  );
}
