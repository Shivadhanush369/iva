import styles from "./Notification.module.css";

const Notification = ({ cdata }) => {
  return (
    <div className={styles.notification_wrapper}>
      <div className={styles.title}>
        <span className={styles.notificationtitle}>
          Notification | 
          <span className={styles.notificationrecent}> Recent</span>
        </span>
      </div>
      {cdata.map((data, index) => (
        <div key={index} className={styles.notification}>
          <img src="./notification.png" alt="notification" />
          <div className={styles.noticontent}>
           <p> <b>{data.username}</b> Received 
            <span style={{ color: 'red' }}> {data.high} high</span>, 
            <span style={{ color: '#DAA520' }}> {data.medium} medium</span>, 
            <span style={{ color: 'green' }}> {data.low} low </span> 
            alerts on {data.url}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
