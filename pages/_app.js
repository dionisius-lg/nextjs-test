import { SWRConfig } from "swr";
import NextNProgress from "nextjs-progressbar";
import fetchJson from "lib/fetchJson";
import { GlobalProvider } from "contexts/Global";

import "react-datepicker/dist/react-datepicker.css";
import "public/vendor/fontawesome-free/css/all.min.css";
import "public/assets/css/globals.css";
import "public/assets/css/styles.css";

function MyApp({ Component, pageProps }) {
    return (
        <GlobalProvider>
            {/* <NextNProgress
                color="#29D"
                startPosition={0.3}
                stopDelayMs={200}
                height={3}
                showOnShallow={true}
            /> */}
            <SWRConfig
                value={{
                    fetcher: fetchJson,
                    onError: (err) => {
                        console.error(err);
                    },
                }}
            >
                <Component {...pageProps} />
            </SWRConfig>
        </GlobalProvider>
    );
}

export default MyApp;
