import footer from "../../../assets/footer/footer.png";
import miml from "../../../assets/icons/MIML.png";
import styles from "./Footer.module.css";
                                                                                                                       

const Footer =()=>{
    return(
        <div className={styles.footer}>
            {/* <h2>This is Footer</h2> */}
            
                <img className={styles.footerImage}
                    loading="lazy"
                    alt="Footer"
                    src={footer}
                />
        </div>
    )
}
export default Footer;