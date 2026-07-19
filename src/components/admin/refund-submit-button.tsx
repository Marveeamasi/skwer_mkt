"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
export function RefundSubmitButton({id}:{id:string}){const[busy,setBusy]=useState(false),[error,setError]=useState(""),router=useRouter();async function submit(){if(!confirm("Submit this refund to Paystack? This financial action cannot be undone here."))return;setBusy(true);setError("");const response=await fetch(`/api/admin/refunds/${id}/submit`,{method:"POST"}),result=await response.json();if(!response.ok){setError(result.error);setBusy(false);return}router.refresh()}return <div><button className="button button-small" onClick={submit} disabled={busy}>{busy?"Submitting…":"Submit to Paystack"}</button>{error&&<small className="form-error">{error}</small>}</div>}
