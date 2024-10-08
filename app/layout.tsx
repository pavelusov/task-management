'use client';
import type { ReactNode } from "react";
import { useEffect } from "react";
import { StoreProvider } from "./StoreProvider";
import { SessionProvider } from 'next-auth/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
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
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <body>
                <CssBaseline />
                <Container maxWidth="lg">
                  <Nav />
                  {children}
                </Container>
              </body>
            </LocalizationProvider>
          </html>
      </StoreProvider>
    </SessionProvider>
  );
}
