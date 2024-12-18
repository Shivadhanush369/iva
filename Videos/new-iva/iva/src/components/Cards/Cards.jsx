import styles from './cards.module.css';

const Cards = (props) => {
  return (
    <div className={styles.card}>
     <div className={styles.icon}>
      {props.icon}
     </div>
      <div className={styles.card_content}>
        <h3>{props.title}</h3>
        <p>{props.value}</p>
      </div>
    </div>
  )
}

export default Cards
