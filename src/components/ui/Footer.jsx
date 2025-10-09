import React from "react";
import Container from "./Container";
export default function Footer() {
  return (
    <footer className="flex justify-between items-center bg-gray-100 border-t border-[#BCC7D2] px-6 h-[calc(10%)] text-sm text-gray-600">
      <Container width="w-[90%]">
        <div className="flex-1 text-start text-gray-500 text-xs">
          ©2020 Aiinhome Technologies Pvt. Ltd. All rights reserved
        </div>
      </Container>
    </footer>
  );
}
