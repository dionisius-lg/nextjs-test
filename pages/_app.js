import { SWRConfig } from "swr";
import NextNProgress from "nextjs-progressbar";
import fetchJson from "lib/fetchJson";
import { GeneralProvider } from "contexts/General";

import "react-datepicker/dist/react-datepicker.css";
import "public/vendor/fontawesome-free/css/all.min.css";
import "public/assets/css/globals.css";
import "public/assets/css/styles.css";

function MyApp({ Component, pageProps }) {
    return (
        <GeneralProvider>
            <NextNProgress
                color="#29D"
                startPosition={0.3}
                stopDelayMs={200}
                height={3}
                showOnShallow={true}
            />
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
        </GeneralProvider>
    );
}

export default MyApp;
