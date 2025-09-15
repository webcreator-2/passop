import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-800 text-white flex'>
      <div className='mycontainer flex justify-between px-3 py-4 h-14'>
      <div className='logo font-bold text-2xl'>
       
        <span className='bg-green-500'> &lt;</span>
        <span>Pass</span>
        <span className='bg-green-500'>OP/&gt;</span>
        </div>
      {/* <ul>
        <li className='flex gap-4'>
          <a className='hover:font-bold' href="/">Home</a>
          <a className='hover:font-bold' href="/">About</a>
          <a className='hover:font-bold' href="/">Contact</a>
        </li>
        </ul> */}
        <button className='text-white bg-green-700 w-[100px] h-[33px] rounded-full ring-white ring-1 flex justify-evenly'>
          <img className='invert' src="icons/Githubb.png" width={50} height={40} alt="" />
          <span className='font-semibold text-md p-1'>GitHub</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
