// import React, { useState } from "react";
// import { Package } from "lucide-react";

// const Billing = () => {
//   const [country, setCountry] = useState("");
//   const [address1, setAddress1] = useState("");
//   const [address2, setAddress2] = useState("");
  
//   const isFormValid = country && address1;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
//           <div className="flex items-center">
//             <Package className="h-8 w-8 text-[#3BCD5B]" />
//             <h1 className="ml-3 text-2xl font-bold text-[#1C542A]">
//               Home Inventory Billing
//             </h1>
//           </div>
//         </div>
//       </header>
//       <main className="flex-grow">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
//           <h2 className="text-4xl font-bold text-[#1C542A] mb-4">
//             Billing Information
//           </h2>
//           <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
//             <label className="block text-left font-semibold mb-1">Country *</label>
//             <select
//               className="w-full p-3 border rounded-lg"
//               value={country}
//               onChange={(e) => setCountry(e.target.value)}
//             >
//               <option value="">Select your country</option>
//               <option value="USA">United States</option>
//               <option value="Canada">Canada</option>
//               <option value="UK">United Kingdom</option>
//             </select>
//             <p className="text-sm text-gray-500 mt-1">Can't find your country? <a href="#" className="text-blue-500">Contact us</a></p>
            
//             <label className="block text-left font-semibold mt-4 mb-1">Address Line 1 *</label>
//             <input
//               type="text"
//               className="w-full p-3 border rounded-lg"
//               placeholder="Street and number, P.O. box, C/O"
//               value={address1}
//               onChange={(e) => setAddress1(e.target.value)}
//             />
            
//             <label className="block text-left font-semibold mt-4 mb-1">Address Line 2</label>
//             <input
//               type="text"
//               className="w-full p-3 border rounded-lg"
//               placeholder="Apartment, suite, unit, building, floor, etc."
//               value={address2}
//               onChange={(e) => setAddress2(e.target.value)}
//             />
            
//             <div className="flex justify-between mt-6">
//               <button className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow">Back</button>
//               <button
//                 className={`px-6 py-3 rounded-lg shadow ${isFormValid ? 'bg-[#3BCD5B] text-white hover:bg-[#32A94A]' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
//                 disabled={!isFormValid}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Billing;
