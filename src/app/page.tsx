'use client'
import { useEffect } from "react";

export default function Home() {
  useEffect(()=>{
    const number = document.querySelector("#number");
    let conter = 0;
    const ani = setInterval(() => {
        if (conter == 100) {
            clearInterval(ani);
        } else {
            conter += 1;
            number!.textContent = conter + "% Charged";
        }
    }, 30);
  },[])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="i-phone-frem">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px" className="circle-svg">
            <defs>
              <linearGradient id="GradientColor">
                <stop offset="0%" stopColor="#ff0032" />
                <stop offset="100%" stopColor="#ff8c00" />
              </linearGradient>
            </defs>
            <circle cx="80" cy="80" r="70" strokeLinecap="round" className="circle1" />
            <circle cx="80" cy="80" r="70" strokeLinecap="round" className="circle2" />
          </svg>
          <img src="./flash.png" alt="" className="flash" />
            <div id="number">
              0%
            </div>
          </div>
        </main>
        );
}
