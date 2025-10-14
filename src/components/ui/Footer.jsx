import React from "react";
import Container from "./Container";
export default function Footer() {
  return (
    <footer className="flex justify-between items-center border-t border-[#BCC7D2] h-[calc(10.5%)] text-sm font-medium text-[#7E8489] px-[1%]">
      <Container width="w-[90%]">
          ©2020 Aiinhome Technologies Pvt. Ltd. All rights reserved
      </Container>
    </footer>
  );
}
