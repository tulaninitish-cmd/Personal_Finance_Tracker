
// "use client";

// import React, { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { User as UserIcon, Mail, Calendar, Pencil, Loader2, Fingerprint, ShieldCheck, MapPin, Check, X, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
// import Sidebar from "@/components/Sidebar";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import Loading from "../loading";

// export default function Profile() {
//   const { data: session, status, update } = useSession();
//   const [joinedDate, setJoinedDate] = useState<string>("Loading...");
//   const [isImageError, setIsImageError] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [newName, setNewName] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);
//   const router = useRouter();

//   // Password Change States
//   const [showPasswordForm, setShowPasswordForm] = useState(false);
//   const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
//   const [isChangingPassword, setIsChangingPassword] = useState(false);
  
//   // Visibility States
//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       toast.error("Please login first");
//       router.push("/login");
//       return;
//     }

//     const fetchProfile = async () => {
//       if (session?.user?.id) {
//         setNewName(session.user.name || "");
//         try {
//           const res = await fetch(`/api/dashboard/stats?userId=${session.user.id}`);
//           const result = await res.json();
          
//           if (result.createdAt) {
//             const date = new Date(result.createdAt);
//             const formattedDate = date.toLocaleDateString('en-GB', { 
//               day: 'numeric',
//               month: 'long', 
//               year: 'numeric' 
//             });
//             setJoinedDate(formattedDate);
//           }
//         } catch (err) {
//           setJoinedDate("Error loading date");
//         }
//       }
//     };

//     if (status === "authenticated") {
//       fetchProfile();
//     }
//   }, [status, session, router]);

//   const handleUpdateName = async () => {
//     if (!newName.trim() || newName.trim().length < 2) {
//       toast.error("Name must be at least 2 characters long");
//       return;
//     }

//     if (newName.trim() === session?.user?.name) {
//       setIsEditing(false);
//       return;
//     }

//     try {
//       setIsUpdating(true);
//       const res = await fetch("/api/user/update-profile", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: session?.user?.id, name: newName.trim() }),
//       });

//       if (res.ok) {
//         await update({ name: newName.trim() }); 
//         toast.success("Name updated successfully");
//         setIsEditing(false);
//       } else {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Failed to update");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Error updating name");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleChangePassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (passwordData.newPassword.length < 6) {
//       toast.error("New password must be at least 6 characters");
//       return;
//     }

//     try {
//       setIsChangingPassword(true);
//       const res = await fetch("/api/user/change-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: session?.user?.id,
//           oldPassword: passwordData.oldPassword,
//           newPassword: passwordData.newPassword,
//         }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         toast.success("Password changed successfully");
//         setShowPasswordForm(false);
//         setPasswordData({ oldPassword: "", newPassword: "" });
//         setShowOldPassword(false);
//         setShowNewPassword(false);
//       } else {
//         throw new Error(data.error || "Failed to change password");
//       }
//     } catch (err: any) {
//       toast.error(err.message);
//     } finally {
//       setIsChangingPassword(false);
//     }
//   };

//   if (status === "loading") {
//     return <Loading />;
//   }

//   return (
//     <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
//       <Sidebar />

//       <main className="flex-1 overflow-y-auto p-4 md:p-8">
//         <div className="max-w-4xl mx-auto">
//           <header className="mb-10">
//             <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
//               <Fingerprint className="text-blue-600" size={32} />
//               Account Identity
//             </h1>
//             <p className="text-slate-500 font-medium mt-1">Manage your digital presence and personal credentials.</p>
//           </header>

//           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-10 transition-all hover:shadow-2xl hover:shadow-blue-100/50">
//             <div className="h-40 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 relative">
//               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
//             </div>

//             <div className="px-10 pb-10">
//               <div className="relative flex flex-col md:flex-row items-center md:items-end gap-8 -mt-16 mb-8">
//                 <div className="p-2 bg-white rounded-[2.2rem] shadow-2xl">
//                   <div className="w-36 h-36 bg-slate-100 rounded-4xl flex items-center justify-center border-4 border-white overflow-hidden relative group">
//                     {session?.user?.image && !isImageError ? (
//                       <Image 
//                         src={session.user.image} 
//                         alt="Profile" 
//                         fill
//                         className="object-cover transition-transform duration-500 group-hover:scale-110"
//                         onError={() => setIsImageError(true)}
//                       />
//                     ) : (
//                       <UserIcon size={56} className="text-slate-300" />
//                     )}
//                   </div>
//                 </div>

//                 <div className="pb-2 text-center md:text-left flex-1">
//                   <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
//                     {isEditing ? (
//                       <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-blue-100 shadow-inner">
//                         <input
//                           type="text"
//                           value={newName}
//                           onChange={(e) => setNewName(e.target.value)}
//                           className="bg-transparent px-3 py-1 font-bold text-xl outline-none text-slate-900 min-w-50"
//                           autoFocus
//                         />
//                         <button onClick={handleUpdateName} disabled={isUpdating} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
//                           {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
//                         </button>
//                         <button onClick={() => { setIsEditing(false); setNewName(session?.user?.name || ""); }} className="p-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-colors">
//                           <X size={16} />
//                         </button>
//                       </div>
//                     ) : (
//                       <>
//                         <h2 className="text-3xl font-black text-slate-900 tracking-tight">
//                           {session?.user?.name || "Member"}
//                         </h2>
//                         <button 
//                           onClick={() => setIsEditing(true)}
//                           className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all border border-slate-100 shadow-sm group"
//                         >
//                           <Pencil size={18} className="group-hover:rotate-12 transition-transform" />
//                         </button>
//                       </>
//                     )}
//                   </div>
                  
//                   <div className="flex items-center justify-center md:justify-start gap-3">
//                     {session?.user?.image ? (
//                       <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100 shadow-sm">
//                         <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-3 h-3" />
//                         Google Connected
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
//                         <ShieldCheck size={12} />
//                         Email Account
//                       </span>
//                     )}
//                     <span className="text-slate-400 text-sm font-bold flex items-center gap-1.5">
//                       <MapPin size={14} /> IN
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
//                 <DetailTile icon={<Mail size={22} />} label="Primary Email" value={session?.user?.email || "Not linked"} subValue="Connected via secure Auth" />
//                 <DetailTile icon={<Calendar size={22} />} label="Join Date" value={joinedDate} subValue="Account established" />
//               </div>

//               {/* Password Change Section */}
//               <div className="mt-8 pt-8 border-t border-slate-50">
//                 {session?.user?.image ? (
//                   /* Message for Google Users */
//                   <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
//                     <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400">
//                       <Lock size={18} />
//                     </div>
//                     <div>
//                       <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">Security Notice</p>
//                       <p className="text-sm font-bold text-slate-600">You are signed in via Google. Password management is handled by your provider.</p>
//                     </div>
//                   </div>
//                 ) : (
//                   /* Feature for Email Users */
//                   <>
//                     {!showPasswordForm ? (
//                       <button 
//                         onClick={() => setShowPasswordForm(true)}
//                         className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
//                       >
//                         <KeyRound size={16} />
//                         Update Security Password
//                       </button>
//                     ) : (
//                       <form onSubmit={handleChangePassword} className="bg-slate-50 rounded-4xl p-8 border border-blue-50 space-y-4">
//                         <div className="flex justify-between items-center mb-2">
//                           <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
//                             <Lock size={16} className="text-blue-600" /> 
//                             Security Credentials
//                           </h3>
//                           <button type="button" onClick={() => { setShowPasswordForm(false); setShowOldPassword(false); setShowNewPassword(false); }} className="text-slate-400 hover:text-slate-600">
//                             <X size={18} />
//                           </button>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="relative">
//                             <input 
//                               type={showOldPassword ? "text" : "password"} 
//                               placeholder="Current Password"
//                               required
//                               className="w-full px-5 py-3 pr-12 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium"
//                               value={passwordData.oldPassword}
//                               onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
//                             />
//                             <button
//                               type="button"
//                               onClick={() => setShowOldPassword(!showOldPassword)}
//                               className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
//                             >
//                               {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                             </button>
//                           </div>
//                           <div className="relative">
//                             <input 
//                               type={showNewPassword ? "text" : "password"} 
//                               placeholder="New Password"
//                               required
//                               className="w-full px-5 py-3 pr-12 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium"
//                               value={passwordData.newPassword}
//                               onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
//                             />
//                             <button
//                               type="button"
//                               onClick={() => setShowNewPassword(!showNewPassword)}
//                               className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
//                             >
//                               {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                             </button>
//                           </div>
//                         </div>
//                         <button 
//                           type="submit" 
//                           disabled={isChangingPassword}
//                           className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
//                         >
//                           {isChangingPassword ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Confirm New Password"}
//                         </button>
//                       </form>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// const DetailTile = ({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string; subValue: string }) => (
//   <div className="group p-6 rounded-4xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/40 transition-all duration-300">
//     <div className="flex items-start gap-5">
//       <div className="p-4 bg-white text-blue-600 rounded-2xl shadow-sm group-hover:scale-110 group-hover:shadow-blue-200 transition-all duration-300">
//         {icon}
//       </div>
//       <div className="flex flex-col">
//         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</span>
//         <span className="text-slate-900 font-bold text-lg">
//           {value === "Loading..." ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : value}
//         </span>
//         <span className="text-xs text-slate-400 font-medium mt-1">{subValue}</span>
//       </div>
//     </div>
//   </div>
// );







"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react"; // Added signOut
import { 
  User as UserIcon, Mail, Calendar, Pencil, Loader2, Fingerprint, 
  ShieldCheck, MapPin, Check, X, Lock, KeyRound, Eye, EyeOff, LogOut 
} from "lucide-react"; // Added LogOut icon
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "../loading";

export default function Profile() {
  const { data: session, status, update } = useSession();
  const [joinedDate, setJoinedDate] = useState<string>("Loading...");
  const [isImageError, setIsImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Password Change States
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Visibility States
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      if (session?.user?.id) {
        setNewName(session.user.name || "");
        try {
          const res = await fetch(`/api/dashboard/stats?userId=${session.user.id}`);
          const result = await res.json();
          
          if (result.createdAt) {
            const date = new Date(result.createdAt);
            const formattedDate = date.toLocaleDateString('en-GB', { 
              day: 'numeric',
              month: 'long', 
              year: 'numeric' 
            });
            setJoinedDate(formattedDate);
          }
        } catch (err) {
          setJoinedDate("Error loading date");
        }
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, session, router]);

  const handleUpdateName = async () => {
    if (!newName.trim() || newName.trim().length < 2) {
      toast.error("Name must be at least 2 characters long");
      return;
    }

    if (newName.trim() === session?.user?.name) {
      setIsEditing(false);
      return;
    }

    try {
      setIsUpdating(true);
      const res = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id, name: newName.trim() }),
      });

      if (res.ok) {
        await update({ name: newName.trim() }); 
        toast.success("Name updated successfully");
        setIsEditing(false);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update");
      }
    } catch (err: any) {
      toast.error(err.message || "Error updating name");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully");
        setShowPasswordForm(false);
        setPasswordData({ oldPassword: "", newPassword: "" });
        setShowOldPassword(false);
        setShowNewPassword(false);
      } else {
        throw new Error(data.error || "Failed to change password");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900">
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 md:mb-10 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3">
              <Fingerprint className="text-blue-600" size={32} />
              Account Identity
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Manage your digital presence and personal credentials.</p>
          </header>

          <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-10 transition-all">
            <div className="h-24 md:h-40 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <div className="px-6 md:px-10 pb-8 md:pb-10">
              <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 -mt-12 md:-mt-16 mb-8">
                <div className="p-1.5 bg-white rounded-3xl md:rounded-[2.2rem] shadow-2xl">
                  <div className="w-24 h-24 md:w-36 md:h-36 bg-slate-100 rounded-3xl md:rounded-4xl flex items-center justify-center border-4 border-white overflow-hidden relative group">
                    {session?.user?.image && !isImageError ? (
                      <Image 
                        src={session.user.image} 
                        alt="Profile" 
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => setIsImageError(true)}
                      />
                    ) : (
                      <UserIcon size={40} className="text-slate-300 md:size-14" />
                    )}
                  </div>
                </div>

                <div className="pb-1 text-center md:text-left flex-1">
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-4 mb-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-blue-100 shadow-inner w-full md:w-auto">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="bg-transparent px-3 py-1 font-bold text-lg md:text-xl outline-none text-slate-900 flex-1 md:min-w-50"
                          autoFocus
                        />
                        <div className="flex gap-1 pr-1">
                          <button onClick={handleUpdateName} disabled={isUpdating} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                          </button>
                          <button onClick={() => { setIsEditing(false); setNewName(session?.user?.name || ""); }} className="p-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">
                          {session?.user?.name || "Member"}
                        </h2>
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl md:rounded-2xl transition-all border border-slate-100 shadow-sm group"
                        >
                          <Pencil size={16} className="md:size-4.5 group-hover:rotate-12 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                    {session?.user?.image ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] md:text-xs font-bold border border-blue-100 shadow-sm">
                        <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-3 h-3" />
                        Google Connected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] md:text-xs font-bold border border-slate-200">
                        <ShieldCheck size={12} />
                        Email Account
                      </span>
                    )}
                    <span className="text-slate-400 text-xs md:text-sm font-bold flex items-center gap-1.5">
                      <MapPin size={14} /> IN
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-6 border-t border-slate-50">
                <DetailTile icon={<Mail size={22} />} label="Primary Email" value={session?.user?.email || "Not linked"} subValue="Connected via secure Auth" />
                <DetailTile icon={<Calendar size={22} />} label="Join Date" value={joinedDate} subValue="Account established" />
              </div>

              {/* Security & Access Section */}
              <div className="mt-8 pt-8 border-t border-slate-50">
                {/* Mobile-Only Logout Section */}
                <div className="md:hidden mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Security & Access</h3>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-5 bg-rose-50 border border-rose-100 rounded-2xl group active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white text-rose-500 rounded-xl shadow-sm">
                                <LogOut size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black text-rose-600">Logout</p>
                            </div>
                        </div>
                    </button>
                </div>

                {session?.user?.image ? (
                  <div className="flex items-start md:items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400 shrink-0">
                      <Lock size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Security Notice</p>
                      <p className="text-xs md:text-sm font-bold text-slate-600 leading-tight">You are signed in via Google. Password management is handled by your provider.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {!showPasswordForm ? (
                      <div className="flex justify-center md:justify-start">
                        <button 
                          onClick={() => setShowPasswordForm(true)}
                          className="flex items-center gap-2 text-[10px] md:text-sm font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <KeyRound size={16} />
                          Update Security Password
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleChangePassword} className="bg-slate-50 rounded-3xl md:rounded-4xl p-6 md:p-8 border border-blue-50 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                            <Lock size={16} className="text-blue-600" /> 
                            Security Credentials
                          </h3>
                          <button type="button" onClick={() => { setShowPasswordForm(false); setShowOldPassword(false); setShowNewPassword(false); }} className="text-slate-400 hover:text-slate-600">
                            <X size={18} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <input 
                              type={showOldPassword ? "text" : "password"} 
                              placeholder="Current Password"
                              required
                              className="w-full px-4 md:px-5 py-3 pr-12 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm md:text-base font-medium"
                              value={passwordData.oldPassword}
                              onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <div className="relative">
                            <input 
                              type={showNewPassword ? "text" : "password"} 
                              placeholder="New Password"
                              required
                              className="w-full px-4 md:px-5 py-3 pr-12 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm md:text-base font-medium"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        <button 
                          type="submit" 
                          disabled={isChangingPassword}
                          className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
                        >
                          {isChangingPassword ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Confirm New Password"}
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const DetailTile = ({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string; subValue: string }) => (
  <div className="group p-4 md:p-6 rounded-[1.5rem] md:rounded-4xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/40 transition-all duration-300">
    <div className="flex items-start gap-4 md:gap-5">
      <div className="p-3 md:p-4 bg-white text-blue-600 rounded-xl md:rounded-2xl shadow-sm group-hover:scale-110 group-hover:shadow-blue-200 transition-all duration-300">
        <div className="scale-75 md:scale-100">{icon}</div>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 truncate">{label}</span>
        <span className="text-slate-900 font-bold text-sm md:text-lg truncate">
          {value === "Loading..." ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-blue-500" /> : value}
        </span>
        <span className="text-[10px] md:text-xs text-slate-400 font-medium mt-1 truncate">{subValue}</span>
      </div>
    </div>
  </div>
);