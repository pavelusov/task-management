'use client';
import type { ReactNode } from "react";
import { useEffect } from "react";
import { StoreProvider } from "./StoreProvider";
import { SessionProvider } from 'next-auth/react';

import "./styles/globals.css";
import { dbService } from "@/service/db-service";
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from "@mui/material";
import { Nav } from "@/app/components/Nav";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  useEffect(() => {
    dbService.init();
  }, []);

  return (
    <SessionProvider>
      <StoreProvider>
        <html lang="en">
          <body>
            <CssBaseline />
            <Container maxWidth="lg">
              <Nav />
              {children}
            </Container>
          </body>
        </html>
      </StoreProvider>
    </SessionProvider>
  );
}
