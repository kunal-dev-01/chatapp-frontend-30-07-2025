// import React, { useEffect, useState } from 'react';
// import AuthLayout from '../Layouts/AuthLayout';
// import Link from 'next/link';
// import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
// import { useAppDispatch, useAppSelector } from '@/Redux/Hooks/reduxHook';
// import { verifyEmail, resendVerificationEmail } from '@/Redux/UserServices/Slices/auth.slice';
// import dynamic from 'next/dynamic';

// interface VerifyFormProps {
//   token?: string;
// }


// const VerifyForm: React.FC<VerifyFormProps> = ({ token }) => {
//   const dispatch = useAppDispatch();
//   const { isVerifyingEmail, isVerifyingEmailError } = useAppSelector((state) => state.auth);
  
//   const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
//   const [verificationMessage, setVerificationMessage] = useState('');
//   const [email, setEmail] = useState('');
//   const [resendLoading, setResendLoading] = useState(false);
//   const [resendMessage, setResendMessage] = useState('');
//   const [resendError, setResendError] = useState('');

//   useEffect(() => {
//     if (token) {
//       handleVerification(token);
//     } else {
//       setVerificationStatus('error');
//       setVerificationMessage('No verification token provided');
//     }
//   }, [token]);

//   const handleVerification = async (verificationToken: string) => {
//     try {
//       const result = await dispatch(verifyEmail(verificationToken)).unwrap();
      
//       if (result.status === 'success') {
//         setVerificationStatus('success');
//         setVerificationMessage(result.message || 'Email verified successfully!');
//       }
//     } catch (error: any) {
//       setVerificationStatus('error');
//       setVerificationMessage(error || 'Email verification failed');
//     }
//   };

//   const handleResendVerification = async () => {
//     if (!email.trim()) {
//       setResendError('Please enter your email address');
//       return;
//     }

//     setResendLoading(true);
//     setResendMessage('');
//     setResendError('');

//     try {
//       const result = await dispatch(resendVerificationEmail(email)).unwrap();
      
//       if (result.status === 'success') {
//         setResendMessage('Verification email sent successfully! Please check your inbox.');
//       }
//     } catch (error: any) {
//       setResendError(error || 'Failed to resend verification email');
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   const renderContent = () => {
//     switch (verificationStatus) {
//       case 'loading':
//         return (
//           <div className="text-center">
//             <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
//               <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
//             </div>
            
//             <h1 className="md:text-[2vw] text-[3.5vh] font-semibold dark:text-zinc-200 mb-2">
//               Verifying Your Email
//             </h1>
            
//             <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400">
//               Please wait while we verify your email address...
//             </p>
//           </div>
//         );

//       case 'success':
//         return (
//           <div className="text-center">
//             <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
//               <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
//             </div>
            
//             <h1 className="md:text-[2vw] text-[3.5vh] font-semibold dark:text-zinc-200 mb-2">
//               Email Verified!
//             </h1>
            
//             <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 mb-6">
//               {verificationMessage}
//             </p>

//             <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
//               <p className="text-sm text-green-700 dark:text-green-300">
//                 🎉 Your account is now fully activated! You can access all features.
//               </p>
//             </div>

//             <Link
//               href="/login"
//               className="inline-block w-full py-2 rounded-md font-medium text-white 
//                        bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
//                        hover:from-[#8557b3] hover:to-[#6b42b5]
//                        transition-all duration-200 text-center"
//             >
//               Continue to Sign In
//             </Link>
//           </div>
//         );

//       case 'error':
//         return (
//           <div className="text-center">
//             <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
//               <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
//             </div>
            
//             <h1 className="md:text-[2vw] text-[3.5vh] font-semibold dark:text-zinc-200 mb-2">
//               Verification Failed
//             </h1>
            
//             <p className="text-sm md:text-md text-zinc-600 dark:text-zinc-400 mb-6">
//               {verificationMessage}
//             </p>

//             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
//               <div className="text-sm text-red-700 dark:text-red-300">
//                 <p className="font-medium mb-2">Possible reasons:</p>
//                 <ul className="space-y-1 text-xs list-disc list-inside">
//                   <li>The verification link has expired</li>
//                   <li>The link has already been used</li>
//                   <li>The link is invalid or corrupted</li>
//                 </ul>
//               </div>
//             </div>

//             {/* Resend Section */}
//             <div className="border-t border-zinc-300 dark:border-zinc-700 pt-6">
//               <div className="flex items-center gap-2 justify-center mb-4">
//                 <Mail className="w-5 h-5 text-[#9668c2]" />
//                 <h3 className="font-medium dark:text-zinc-200">
//                   Request New Verification Link
//                 </h3>
//               </div>

//               {resendMessage && (
//                 <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
//                   <p className="text-sm text-green-700 dark:text-green-300">
//                     {resendMessage}
//                   </p>
//                 </div>
//               )}

//               {resendError && (
//                 <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                   <p className="text-sm text-red-700 dark:text-red-300">
//                     {resendError}
//                   </p>
//                 </div>
//               )}

//               <div className="space-y-3">
//                 <input
//                   type="email"
//                   placeholder="Enter your email address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 
//                            rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
//                            focus:outline-none focus:ring-2 focus:ring-[#9668c2] focus:border-transparent"
//                 />

//                 <button
//                   onClick={handleResendVerification}
//                   disabled={resendLoading || !email.trim()}
//                   className="w-full py-2 rounded-md font-medium text-white 
//                            bg-gradient-to-r from-[#9668c2] to-[#7a4dc4] 
//                            hover:from-[#8557b3] hover:to-[#6b42b5]
//                            disabled:opacity-50 disabled:cursor-not-allowed
//                            transition-all duration-200"
//                 >
//                   {resendLoading ? (
//                     <div className="flex items-center gap-2 justify-center">
//                       <Loader2 size={16} className="animate-spin" />
//                       <span>Sending...</span>
//                     </div>
//                   ) : (
//                     'Send New Verification Link'
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6 pt-4 border-t border-zinc-300 dark:border-zinc-700">
//               <p className="text-sm text-zinc-600 dark:text-zinc-400">
//                 Need help?{' '}
//                 <Link
//                   href="/register"
//                   className="text-[#9668c2] hover:underline cursor-pointer font-semibold"
//                 >
//                   Create New Account
//                 </Link>
//                 {' or '}
//                 <Link
//                   href="/login"
//                   className="text-[#9668c2] hover:underline cursor-pointer font-semibold"
//                 >
//                   Sign In
//                 </Link>
//               </p>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <AuthLayout>
//       <div className="w-full md:w-[30vw] p-[2px] rounded-lg md:bg-gradient-to-r from-[#FF6B6B] via-pink-500 to-violet-500">
//         <div className="flex flex-col w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-900 md:p-[2vw]">
//           {renderContent()}
//         </div>
//       </div>
//     </AuthLayout>
//   );
// };

// export default VerifyForm;