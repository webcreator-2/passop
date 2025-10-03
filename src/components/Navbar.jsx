import React from 'react'

const Navbar = ({ setToken }) => {
  return (
    <nav className='bg-slate-800 text-white flex'>
      <div className='mycontainer flex justify-between px-3 py-4 h-14'>
        <div className='logo font-bold text-2xl'>

          <span className='bg-green-500'> &lt;</span>
          <span>Pass</span>
          <span className='bg-green-500'>OP/&gt;</span>
        </div>

        <div className='flex gap-4 '>
        <a
          href="https://github.com/webcreator-2"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white bg-green-700 w-[100px] h-[33px] rounded-full ring-white ring-1 flex justify-evenly items-center"
        >
          <img className="invert" src="icons/Githubb.png" width={20} height={20} alt="GitHub logo" />
          <span className="font-semibold text-md p-1">GitHub</span>
        </a>
         <button className='text-white bg-green-700 w-[80px] h-[33px] rounded-full ring-white ring-1' onClick={() => {
            localStorage.removeItem("token");
            setToken(null);
          }}>
            Logout
          </button>
</div>
      </div>
    </nav>
  )
}

export default Navbar
