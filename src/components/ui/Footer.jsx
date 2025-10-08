// import React from 'react'
// import Container from './Container';

// export default function Footer() {
//   return (
//     <footer className="footer-app-container h-16 bg-gray-700 text-gray-100 flex items-center justify-center shadow-sm">
//       <Container width="w-[90%]">
//         <p className="text-center">
//           Copyright © AIINHOME Technologies Pvt Ltd, All rights reserved.
//         </p>
//       </Container>
//     </footer>
//   );
// }

import React from "react";
import Container from "./Container";
import { Info } from "lucide-react";
export default function Footer() {
  return (
    <footer className="flex justify-between items-center bg-gray-100 border-t rounded-b-lg px-6 py-3 text-sm text-gray-600">
      <Container width="w-[90%]">
<div className="text-gray-500 text-xs -ml-20">
  ©2020 Aiinhome Technologies Pvt. Ltd. All rights reserved
</div>

      </Container>
    </footer>
  );
}
