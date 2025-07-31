import { useNavigate } from "react-router-dom"
import { IoMdArrowRoundBack } from "react-icons/io";

export default function NotFound() {
    const navigate = useNavigate();
  return (
    <div className = "bg-zinc-950 h-screen w-full relative">
        <img src="https://wallpapers.com/images/hd/red-light-aesthetic-galaxy-h32ayuraxnrntoqu.jpg" alt="Background Image" className = "w-full h-screen object-cover" />
<div className="absolute inset-0 text-sky-300 font-semibold flex flex-col items-center justify-center text-4xl" style={{ textShadow: '2px 2px 8px #001f3f' }}>
 <h1> 404: Signal Lost in Deep Space</h1>
    <div onClick = {() => navigate(-1)} className = "text-3xl text-slate-100 mt-3 flex items-center hover:cursor-pointer">
        <span><IoMdArrowRoundBack /></span>
        <h1 className = "ml-2">Wanna head back?</h1></div></div>
    </div>
  )
}
