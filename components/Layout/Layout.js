import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.wrap}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
