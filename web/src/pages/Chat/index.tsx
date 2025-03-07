import { Grid } from '@mui/material';
import ContactsPanel from './components/ContactsPanel';
import ChatArea from './components/ChatArea';
import styles from './ChatPage.module.css';

const ChatPage = () => {
  return (
    <Grid container className={styles.chatPageContainer}>
      {/* 中间联系人列表(占30%) */}
      <Grid item xs={3} className={styles.contactsPanel}>
        <ContactsPanel />
      </Grid>
      {/* 右侧消息区域(占70%) */}
      <Grid item xs={9} className={styles.chatArea}>
        <ChatArea />
      </Grid>
    </Grid>
  );
};

export default ChatPage;