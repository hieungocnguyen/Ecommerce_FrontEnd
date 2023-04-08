import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "../utils/Store";
import Loading from "../components/Loading";

function MyApp({ Component, pageProps }) {
   return (
      <ThemeProvider enableSystem={false} attribute="class">
         <StoreProvider>
            <Loading />
            <Component {...pageProps} />
         </StoreProvider>
      </ThemeProvider>
   );
}

export default MyApp;
