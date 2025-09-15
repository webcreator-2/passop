import React from 'react'

const Footer = () => {
  return (
    <div className='bg-slate-800 text-white flex flex-col md:flex-row gap-1 justify-center items-center w-full'>
         <div>
             <div className='logo font-bold text-2xl'>
        <span className='bg-green-500'> &lt;</span>
        <span>Pass</span>
        <span className='bg-green-500'>OP/&gt;</span>
        </div></div>
        <div className='flex justify-center items-center'>Created with<img className='mx-1' src="/icons/download.png" width={20} height={10} alt="" /> by Salwa Unnissa.</div>
    </div>
  )
}

export default Footer
