import React, { use, useEffect } from 'react'
import { useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
  const ref = useRef()
  const passwordRef = useRef()
  const [form, setform] = useState({site:"", username:"", password:""})
  const [passwordArray, setpasswordArray] = useState([])

  const getPasswords = async() =>{
    let req = await fetch("https://passop-5bk5.onrender.com")
    let passwords = await req.json()
    console.log(passwords)
    setpasswordArray(passwords)

  }
 
  useEffect(() => {

  getPasswords()

  },[])
  
  const copyText = (text) =>{
   toast('Copied to clipboard!', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
});
    navigator.clipboard.writeText(text)
  }

  const showPassword= () =>{
    passwordRef.current.type = "text"
    if(ref.current.src.includes("icons/hide.png")){
      ref.current.src = "icons/dontshow.png"
       passwordRef.current.type = "text"
    }
    else{
      ref.current.src = "icons/hide.png"
       passwordRef.current.type = "password"
    }
  }
  
const savePassword = async() => {
  if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

    // ✅ Only delete if editing (i.e., form.id exists)
    if (form.id) {
      await fetch("https://passop-5bk5.onrender.com", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id })
      });
    }

    // ✅ Use existing ID if editing, otherwise create a new one
    const newPassword = { ...form, id: form.id || uuidv4() };

    // ✅ Add to array
    setpasswordArray([...passwordArray, newPassword]);

    await fetch("https://passop-5bk5.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPassword)
    });

    setform({ site: "", username: "", password: "" });

    toast('Password saved!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  } else {
    toast('Error:Password not saved!');
  }
};







  const deletePassword = async(id) =>{
    console.log("Deleting password with id", id)
    let c= confirm("Do you really want to delete this password?")
    if(c){
    setpasswordArray(passwordArray.filter(item=>item.id !== id))

    await fetch("https://passop-5bk5.onrender.com", {method:"DELETE", headers: {"Content-Type":"application/json"}, body:JSON.stringify({ id}) })
    }
     toast('Password Deleted!', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
});
  }
  const editPassword = (id) =>{
    console.log("Editing password with id",id)
    setform({ ...passwordArray.filter(i=>i.id === id)[0], id: id})
    setpasswordArray(passwordArray.filter(item=>item.id !== id))
  }
  const handleChange = (e) =>{
      setform({ ...form, [e.target.name]: e.target.value})
    }
  return (
    <>
    <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>

   <div className="absolute top-0 z-[-2] min-h-screen w-screen rotate-180 transform bg-[radial-gradient(60%_120%_at_50%_50%,transparent_0,rgba(185,255,200,0.6)_100%)] opacity-100 blur-[80px]"></div>



    <div className="p-3 md:mycontainer min-h-[88.2vh]">
      <h2 className='text-4xl text font-bold text-center'>
       <span className='text-green-500'> &lt;</span>
       <span>Pass</span>
        <span className='text-green-500'>OP/&gt;</span></h2>
      <p className='text-green-900 text-lg text-center'>Your Own Password Manager</p>
   <div className='flex flex-col p-4 text-black gap-8 items-center'>
   <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-full border border-green-500 w-full p-4 py-1'  type="text " name='site' id='site' />
   <div className='flex flex-col md:flex-row w-full gap-8 justify-between'>
    <input value={form.username} onChange={handleChange} placeholder='Enter Username'  className='rounded-full border border-green-500 w-full p-4 py-1'  type="text " name='username' id='username' />
    <div className="relative">
    <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1'  type="password" name='password' id='' />
    <span className='absolute right-2 text-black top-2 cursor-pointer' onClick={showPassword}>
      <img ref={ref} width={20}  src="icons/hide.png" alt="" />
    </span>
</div>
   </div>
   <button onClick={savePassword} className='flex justify-center gap-2 items-center bg-green-400 rounded-full px-8 py-2 w-fit border border-green-900 hover:bg-green-300'>
   <lord-icon
    src="https://cdn.lordicon.com/efxgwrkc.json"
    trigger="hover">
   
</lord-icon>
   Save</button>
   </div>
   <div className="passwords">
    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
    {passwordArray.length === 0 && <div> NO Passwords to show </div>}
    {passwordArray.length != 0 &&<table className="table-auto w-full rounded-md overflow-hidden">
  <thead className='bg-green-800 text-white'>
    <tr>
      <th className='py-2'>Sites</th>
      <th className='py-2'>Username</th>
      <th className='py-2'>Password</th>
      <th className='py-2'>Delete</th>

    </tr>
  </thead>
  <tbody className='bg-green-100'>
    {passwordArray.map((item, index)=>{
      return <tr key={index}>
    <td className='py-2 border border-white text-center'>
      <div className='flex justify-center items-center'>
        <a href={item.site} target='_blank'>{item.site}</a>
    <div className='copyy w-5 h-5 cursor-pointer' onClick={()=>{copyText(item.site)}}>
   <lord-icon
    src="https://cdn.lordicon.com/cfkiwvcc.json"
    trigger="hover"
    style={{"width":"17px","height":"17px"}}>
</lord-icon>
    </div>
</div>
</td>

      <td className='py-2 border border-white text-center'>
        <div className='flex items-center justify-center' onClick={()=>{copyText(item.username)}}>
        <span>{item.username}</span>
        <div className='copyy w-5 h-5 cursor-pointer'>
      <lord-icon
    src="https://cdn.lordicon.com/cfkiwvcc.json"
    trigger="hover"
    style={{"width":"17px","height":"17px"}}>
</lord-icon>
        </div>
        </div>
        </td>

      <td className='py-2 border border-white text-center'>
        <div className='flex items-center justify-center'>
          <span>{"•".repeat(item.password.length)}</span>
          <div className='copyy w-5 h-5 cursor-pointer' onClick={()=>{copyText(item.password)}}>
            
      <lord-icon
    src="https://cdn.lordicon.com/cfkiwvcc.json"
    trigger="hover"
    style={{"width":"17px","height":"17px"}}>
</lord-icon>

      </div>
      </div>
      </td>

      <td className='py-2 border border-white justify-center text-center'>
        <span className='cursor-pointer mx-1' onClick={()=>{editPassword(item.id)}}>
          <lord-icon
    src="https://cdn.lordicon.com/valwmkhs.json"
    trigger="hover"
    style={{"width":"25px","height":"25px"}}>
</lord-icon>
 </span>
  <span className='cursor-pointer mx-1' onClick={()=>{deletePassword(item.id)}}>
           <lord-icon
    src="https://cdn.lordicon.com/oqeixref.json"
    trigger="hover"
    style={{"width":"25px","height":"25px"}}>
</lord-icon>

       </span>
      
      </td>
    </tr>
    })}
  </tbody>
</table>
}
   </div>
   </div>
   </>
  )
}

export default Manager
