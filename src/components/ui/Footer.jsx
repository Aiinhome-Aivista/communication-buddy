import React from 'react'
import Container from './Container';

export default function Footer() {
  return (
    <footer className="footer-app-container h-16 bg-gray-200 text-black flex items-center justify-center shadow-sm border-t-2 border-black">
      <Container width="w-[90%]">
        <p className="text-center">
          {/* Copyright © AIINHOME Technologies Pvt Ltd, All rights reserved. */}
          2020 Aiinhome Technologies Pvt. Ltd. All rights reserved
        </p>
      </Container>
    </footer>
  );
}
