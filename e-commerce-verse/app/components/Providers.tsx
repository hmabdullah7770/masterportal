import React from "react";
import { ImageKitProvider, IKImage } from "imagekitio-next";
import {SessionProvider} from "next-auth/react";

const urlEndpoint = process.env.IMAGE_KIT_URL;
const publicKey = process.env.IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    console.log(error);
    throw new Error(`Authentication request failed: ${error}`);
  }
};

export default function Providers({ children}:{children: React.ReactNode}) {
  return (
    <div className="App">
      <SessionProvider>
      <ImageKitProvider urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
      {children}
      </ImageKitProvider>
      </SessionProvider>
    </div>
  );
}