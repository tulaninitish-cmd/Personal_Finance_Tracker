// export default function ViewTransactions({name,cat,date,amount,isNeg,}: any) {

//     let color = "text-red-500";
//   if(isNeg === "income"){
//      color = "text-green-500";
//   }

//   if(isNeg === "savings"){
//      color = "text-yellow-500";
//   }

//   return (
//     <tr className="hover:bg-slate-50 transition">
//       <td className="px-6 py-4 font-medium">{name}</td>
//       <td className="px-6 py-4">
//         <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium uppercase">
//           {cat}
//         </span>
//       </td>
//       <td className="px-6 py-4 text-slate-500 text-sm">{date}</td>
//       <td
//         className={ `px-6 py-4 text-right font-bold ${color}` }
//       >
//         {amount}
//       </td>
//     </tr>
//   );
// }"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ViewTransactions({
  id,
  name,
  cat,
  source,
  date,
  amount,
  isNeg,
  onDeleteSuccess,
}: any) {
  const [isDeleting, setIsDeleting] = useState(false);


  let color = "text-rose-600"; 
  if (isNeg === "income") {
    color = "text-emerald-600";
  }
  if (isNeg === "savings") {
    color = "text-amber-600";
  }

 const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this transaction?")) return;

  setIsDeleting(true);
  try {
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    const result = await res.json(); 

    if (res.ok) {
      toast.success("Transaction removed");
      onDeleteSuccess(); 
    } else {
  
      toast.error(result.error || "Failed to delete");
    }
  } catch (err) {
    toast.error("Something went wrong");
  } finally {
    setIsDeleting(false);
  }
};

  return (
    <tr className="hover:bg-slate-50 transition-colors group border-b border-slate-50 last:border-0">
      <td className="px-6 py-4 font-bold text-slate-800 capitalize">{name}</td>
      
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-tight border border-slate-200">
          {cat}
        </span>
      </td>

      <td className="px-6 py-4">
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${
            source === "savings"
              ? "bg-purple-50 text-purple-600 border-purple-100"
              : "bg-blue-50 text-blue-600 border-blue-100"
          }`}
        >
          {source || "balance"}
        </span>
      </td>

      <td className="px-6 py-4 text-slate-400 text-sm font-medium">{date}</td>

      <td className={`px-6 py-4 text-right font-black whitespace-nowrap ${color}`}>
        <div className="flex items-center justify-end gap-0.5">
          <span>{amount}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-slate-300 hover:text-rose-500 transition-opacity opacity-100 "
          title="Delete Transaction"
        >
          {isDeleting ? (
            <Loader2 size={16} className="animate-spin text-slate-400" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </td>
    </tr>
  );
}