// "use client";
// import React from 'react';
// import dynamic from "next/dynamic";
// import Loader from "@/components/Layouts/Loader";
// import { useParams } from 'next/navigation';

// const VerifyForm = dynamic(() => import("@/components/AuthForms/VerifyForm"), {
//   ssr: false,
//   loading: () => <Loader />,
// });

// const VerifyEmail = () => {
//   const params = useParams();
//   const token = params?.token as string;

//   return (
//     <VerifyForm token={token} />
//   );
// };

// export default VerifyEmail;